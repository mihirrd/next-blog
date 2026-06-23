---
title: 'Bloom Filters: The Three Questions After You Build One'
subtitle: 'Scaling Bloom Filters for Real Systems'
date: '2026-06-23'
peek: 'Before diving into the topic, I will assume you are already familiar with Bloom Filters. We will not revisit how Bloom filters work. Instead, we will look at the engineering problems that appear after you have already implemented one in production.'
---

Before diving into the topic, I will assume you are already familiar with Bloom Filters. We won't revisit how Bloom filters work. Instead, we'll look at the engineering problems that appear after you've already implemented one. 

To build a little context, we will start with a problem. Let's say you are designing a deduplication layer for a large-scale event ingestion pipeline. Each event comes with an `event_id`. For each incoming event, design a system that checks if the event has already been seen before. 

The system supports two APIs.

- `add(event_id)` records an event id.
- `seen(event_id)` returns whether the event id has been seen.

Go ahead and give it a try yourself. 

---

We can start off with linear search to check if the eventID exists in the system. For sorted eventIDs, we can use binary search. We can go with a hash map with O(1) membership checks, but storing billions of event IDs becomes memory intensive. Scanning all previously seen event IDs for every insertion becomes expensive as the stream grows.

This is where we use Bloom filters. A Bloom Filter is an m-bit vector that stores the _signature_ of the elements. Every new event ID is passed through a set of k hash functions. Each hash function hashes the eventID, outputs a number between 0 to m-1, and sets that bit in the bit-vector. 

To check membership, we pass the eventID through the same hash functions. If any of the returned bits is not set, this means that the eventID is guaranteed to be unique. If all the bits are set, it means that the event may or may not be present and requires a scan to be sure. The fact that we guarantee no false negatives saves us significant efforts. 

So far so good. Now we will try to reason about 3 design problems about this system. 

1. How large should the bit vector be?  
2. What happens when we underestimate the number of elements?  
3. Can we support deletions?

### Question 1

> The false positive rate depends on three parameters: number of bits `m`, number of hash functions `k`, and number of inserted elements `n`. How do you choose the right `m` and `k` for a given `n`?

To answer this question, we first want to know the relation between number of bits (`m`) and the number of hash functions `k`. Intuitively, we're trying to figure out how much information each element should leave behind in the bit vector.

Let's say we only have one hash function. (k = 1) i.e each element sets only one bit. This provides too little information and leads to high false positives (FPs). As k increases, false positives initially decrease since each element leaves a richer signature, but beyond a point the bit vector fills up and FPs rise again. Thus, FP vs. k is a U-shaped curve, with the minimum occurring when _roughly_ half the bits are set. 

![images/bloom-filter](/images//u-curve-bf.png)

Now let's derive the formula for choosing the best k. 

This might seem a little complicated, but it really isn't.

### Step 1: What's the chance one specific bit stays 0?
You insert `n` elements, each sets `k` bits. So you throw `k.n` "darts" at `m` slots. For any single bit, 
the dart hits it with probability $\frac{1}{m}$. Hence the probability of missing the dart, (leaving the bit unset) is $1 - \frac{1}{m}$. 
After all `k.n` darts, the bit is still 0 with probability $(1 - \frac{1}{m})^{kn}$, which is approximately $e^{\frac{-kn}{m}}$. (using  $(1 - \frac{1}{m})^{m} \approx e^{-1}$)



### Step 2: What's a false positive?
A false positive means a non-member's `k` hash bits all happen to be 1 already. Let `f` denote the probability that a bit is set. You need all `k` of them to be 1, so:
$$
FP \approx f^{k} = (1 - e^{\frac{-kn}{m}})^{k}
$$
### Step 3: Optimal k and m
For the optimal `k`: minimize that FP expression over `k`. The minimum lands exactly where `f = 1/2` i.e. the array is half ones, half zeros. That gives 
$$
k = \frac{m}{n} \ln 2
$$

For optimal `m`, we need to first fix the maximum accepted FP rate `p`. Then plug f = 1/2 and the desired p into FP ≈ fᵏ and solve for m. It comes out to be 
$$
m = \frac{-(n \ln p)}{(\ln 2)^{2}}
$$

### Question 2:

 > Even a Bloom filter sized for billions of events at a low FP rate needs careful capacity planning, and if you _underestimate_ the count, the filter saturates and the FP rate climbs toward 1. How do you handle an unbounded stream where you can't pre-size the bits-array? 

The core problem here is that a standard Bloom Filter has a fixed sized bit-vector. So its FP rate is proportional to how full it is. An unbounded stream of data is bound to saturate it eventually. We cannot pre-size it, so we don't try to. 

Let's see how to design a scalable Bloom Filter.

When one filter fills up to the target FP rate, freeze it and create a new one. All inserts go to the new filter, and query checks all the filters for membership. Returns positive if any says yes. 

Unfortunately, this introduces another problem. Now there are two filters, each having its own false positive rate. When we query a _non-member_, every filter gets a chance to wrongly say yes. 

> The element is a true negative only if _all_ filters correctly say no. 

$P(no ~ FP) = (1 - P_0)(1 - P_1)(1 - P_2)...$

if every filter had the _same_ FP rate `P`, then after `t` filters the chance of a false positive is roughly `t × P` for small `P`. That grows linearly with `t` and `t` grows without bound on an infinite stream. So, simply adding a new filter does not suffice. 

For each new filter added, let's think about the possibility of halving the FP rate `P` for small probabilities, we can approximate the total false-positive rate by the sum of individual rates.
$$
P_{total} \approx P_0 + \frac{P_0}{2} + \frac{P_0}{4} + \cdots
$$
This is a geometric series whose sum is bounded to 2. Concretely, with $P_0$ = 0.01 and you keep halving it for subsequent filters, the ceiling is 0.01 / (1 - 1/2) = **0.02**. No matter how long the stream runs, your overall FP rate stays under 2%. 

The exact factor doesn't matter. Any geometric decay keeps the total false-positive probability bounded. Halving simply makes the math easy.

But as all optimizations in system design, this also does not come free of cost. To halve the FP rate for a filter, you have to proportionally increase bit-vector according to the following relation.
$$
m \propto n \cdot \ln\left(\frac{1}{P}\right)
$$

Example FP and required bits per element.

| Target FP | Bits per element |
| --------- | ---------------- |
|       10% | ~4.8             |
|        1% | ~9.6             |
|      0.1% | ~14.4            |

### Question 3

> Standard Bloom filters don't support deletion. Why not, and what variant fixes it?

This is straightforward. Standard Bloom filters do not support deletion because multiple elements may set the same bit, and clearing that bit while deleting one element can accidentally remove evidence of another element.

The issue is that a bit only records whether it has been set, not how many elements contributed to it. A **Counting Bloom Filter** fixes this by replacing each bit with a small counter: insertions increment the counters at the hashed positions, and deletions decrement them, allowing elements to be removed safely without affecting other elements that share those positions.

Just make sure you only delete elements that were previously inserted. Counting Bloom Filters assume deletions corresponding to previously inserted elements. Deleting a non-existent element can corrupt the counters and introduce false negatives.


Worth knowing that CBF isn't the only answer anymore. Cuckoo filters support deletion too, with better space efficiency at low FP rates and far friendlier cache behavior, since a lookup touches one or two buckets instead of k scattered bits. If you're reaching for a deletable filter today, that's the one to benchmark first.

---

Bloom filters are essentially a memory-for-certainty tradeoff. They willingly accept false positives to achieve enormous space savings, making them useful in databases, caches, CDNs, storage engines, and large-scale ingestion systems. 

The interesting engineering in system design begins, not with how things work, but with how to scale them reliably. Every solution introduces new tradeoffs, and understanding those tradeoffs is ultimately what system design is about.

---
### References

1. Burton H. Bloom, _Space/Time Trade-offs in Hash Coding with Allowable Errors_, Communications of the ACM, 13(7), 1970.
2. Michael Mitzenmacher and Eli Upfal, _Probability and Computing: Randomized Algorithms and Probabilistic Analysis_, Cambridge University Press, 2005.
3. P. S. Almeida, C. Baquero, N. Preguiça, and D. Hutchison, _Scalable Bloom Filters_, Information Processing Letters, 101(6), 2007.
4. RocksDB Wiki — Bloom Filter Support.

---
title: 'On Binary Search'
subtitle: 'More about where to look than how to look'
date: '2024-11-19'
peek: 'After solving a few binary search problems on LeetCode, I’m beginning to appreciate the elegant generality of this algorithm...'
---
![images/binary-search](/images/binary_search.png)

After solving a few binary search problems on _LeetCode_, I’m beginning to appreciate the elegant generality of this algorithm. The idea extends beyond searching for an element in a sorted array. The core idea lies in *constructing a search space*. This might not necessarily be an array but a conceptual range of values that might contain a solution.

### Constructing a search space
It's difficult to arrive at a binary search approach at first glance (unless you've seen the problem already). Brute force is a fundamental prerequisite. Brute-forcing allows you to see all the possibilities you are considering as a solution and create a search space out of it. You begin to understand what you’re optimizing for, what’s varying, and which constraints matter.

Once the search space is defined, the next step is to check whether it's [monotonic](https://en.wikipedia.org/wiki/Monotonic_function). In this context, whether the outcome of a certain condition (typically a boolean) changes in only one direction as you move through the range.

Take an example of a famous problem: [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/).
Here's the gist of the problem:

Koko has `n` piles of bananas and `h` hours to eat them all. She eats from one pile per hour at a fixed speed `k` (bananas/hour). If a pile has fewer than `k` bananas, she eats all of them and waits for the next hour, rather than moving to the next pile immediately.

The goal is to find the *minimum integer eating speed `k`* such that Koko can finish all the bananas in *at most `h` hours*.

If you don't pay attention closely, you might suggest calculating the total number of bananas and dividing them by the expected time to eat them all to calculate the speed. Easy, right? Well, here's the catch:

>If a pile has fewer than `k` bananas, she eats all of them and waits for the entire hour before moving on to the next pile.

If the speed is 5 bananas/hour and there are 2 bananas in a pile, Koko will eat two bananas and wait for the entire hour before moving on to the next pile.

If you notice, the word "search" appears zero times in the problem statement. How is this a binary search problem?

Let's look at the brute force solution. The minimum possible number of hours to finish all the piles is... well, the total number of piles, since she can finish a maximum of one pile per hour (irrespective of how many bananas are in a pile). This makes the speed equal to the maximum number of bananas present in a pile. For example, if the piles are `[1, 7, 6, 3]`, then 7 would be the minimum speed required to eat each pile in one hour.

Similarly, the maximum possible number of hours to finish would be the total number of bananas combined in all the piles (at the speed of 1 banana per hour).

The minimum possible answer is 1, and the maximum is `max(piles)`. To simulate the number of hours she’d take for a given speed `k`, we loop through each pile and do:

```python
hours += math.ceil(pile / k)
```

Now, for every value from 1 to `max(piles)`, check if the total number of hours is equal to the target hours.

### Optimization
The range 1 to `max(piles)` is monotonic! You don't have to loop through each value in this range. As you move up, you are gradually increasing the speed, thereby minimizing the number of hours. 
Start with the middle value instead. If the hours are less than expected, search in the lower half of the speeds and vice versa, till you find the correct speed.

### Code
```python
def minEatingSpeed(piles: List[int], h: int) -> int:
    left, right = 1, max(piles)
    result = right # Minimum possible value
    while left <= right:
        mid = (left + right) // 2
        hours_needed = sum(math.ceil(pile / mid) for pile in piles)
        if hours_needed <= h:
            result = mid # Potential answer
            # Search further to find the least value 
            # that satisfies the condition.
            right = mid - 1 
        else:
            left = mid + 1
    return result
```

### TL;DR

1. *Define the monotonic search space*: This won’t usually be handed to you directly in the problem statement. This could be index-based (like arrays), value-based (minimum/maximum values), or even time-based (searching over time units). 
    
2. *Define the condition*: Create a predicate (a function that returns `true` or `false`) based on whether the value satisfies the problem constraints.
    
3. *Narrow the space*: Use the outcome of the condition to discard half the space on each iteration.

Figuring out where to look in a binary search problem wins almost all the battle!
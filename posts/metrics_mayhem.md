---
title: 'Metrics Mayhem'
subtitle: The Hidden Cost of Granularity in Graphite
date: '2024-12-31'
peek: 'This is an incident that caused the disk I/O to surge by 200%, database latency to increase from a few milliseconds to ~30 seconds, and a perfectly running Grafana dashboard to turn into a digital sloth on sedatives...'
---

This article serves as a post-it note for my future self. A reminder that a half-baked understanding of a system can bake a full-fledged disaster. This is an incident that caused the disk I/O to surge by 200%, database latency to increase from a few milliseconds to ~30 seconds, and a perfectly running Grafana dashboard to turn into a digital sloth.

Our observability tech stack includes Grafana, Graphite, and GoCarbon. 
At the heart of it is Graphite, a file-based time-series database we
rely on to store application metrics. It collects data
via a protocol called StatsD.

At its core, Graphite consists of two primary components:
- Carbon: A daemon that listens for incoming time-series data.
- Whisper: A file-based database library for storing time-series data.

We use GoCarbon, a Golang implementation of carbon that provides improved performance and better resource utilization than the original Python implementation. 


### The Incident
The DevOps team reported that some of the Grafana dashboards were experiencing unusually long load times. This issue was cascading, causing other dashboards to slow down due to delays in data fetching. After investigating, we discovered that the file size for one of the metric types had ballooned to 13.5 GB, approximately 200 times the anticipated size.
After inspecting the data files, the root cause became quite clear - Granularity.

### Understanding Granularity
Granularity refers to the level of detail captured in metrics — essentially, how finely the data points are subdivided. For instance, let's say we’re tracking how often a function called *foo* runs within a
service named *bar*. The metrics are generally represented with '.' and might look like this - `bar.core.foo` 
where, *core* is the namespace containing the foo function. 

Everytime the codeflow runs through this function, a metric point gets emitted. Each data point corresponds to an epoch timestamp, like -

 |epoch |foo|
|:------:|:------:|
  | 1732414698 |     1|
  | 1732414700 |     1 |

So far, so good.

Now let’s say we want to capture not just the number of calls but also the function’s return value — whether it’s true or false. This introduces subdivisions into the metric thereby increasing its granularity. Our new metrics become:
- `bar.core.foo.true`
- `bar.core.foo.false`

This tiny change completely alters how the data is stored:

  |epoch | foo.true | foo.false |
  |:------:|:------:|:------:|
  | 1732414698 |    0 |  1 |
  | 1732414700 |      1 |  0 |

Every function call now requires storage across these subdivisions, whether the return value is `true` or `false`. Adding more granularity exponentially increases the storage constraints. 

The same thing happened in our case. 
While debugging an oncall issue, we decided to increase the granularity of our metrics by subdividing them based on tenants in the platform. Each tenant represented a distinct customer, and tracking their metrics individually was crucial to isolating the root cause.

This approach gave us the clarity we needed, allowing us to pinpoint discrepancies and anomalies unique to specific tenants. However, the trade-off was significant:

For each tenant, a new set of metric subdivisions was created. This meant that instead of storing a single data point for a given epoch, the system now stored a data point for each tenant. The storage pattern transformed from something like this:

| epoch	| foo.tenant1 |foo.tenant2	| foo.tenant3 | ...|
|:----:|:----:|:----:|:----:|:----:|
|1732414698	| 1 | 0 | 0|...|
|1732414700	| 0	| 1	| 0|...|

### Reflections 
Understanding how data is stored, retrieved, and indexed is non-negotiable. For instance, choosing the wrong indexing strategy can make a simple query unbearably slow, while the right one can make even complex queries lightning-fast.

When working with tools like Kafka, knowing how topics are partitioned and consumed is critical. Misconfiguring partitioning can lead to uneven loads, delayed processing, or even consumer lag spiraling out of control.

If you're designing or consuming APIs, understanding rate limits, timeout behaviors, and caching mechanisms is crucial. Without this knowledge, you might inadvertently overwhelm a service or introduce latency to your application.

Metrics and logs are only as useful as their configuration. Are you aggregating the right data at the right granularity? Are your alert thresholds tuned to avoid noise but still catch critical issues?

Knowing your system and its nuances in depth is critical before making decisions. Whether it's addressing an on-call issue, optimizing performance, or scaling a platform, a deep understanding of how your system components function is the foundation for informed choices.

### References
- [Observability](https://newrelic.com/blog/best-practices/what-is-observability)
- [Grafana](https://grafana.com/)
- [Graphite](https://graphite.readthedocs.io/en/latest/overview.html)
- [StatsD](https://www.datadoghq.com/blog/statsd/)


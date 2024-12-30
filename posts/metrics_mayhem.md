---
title: 'Metrics Mayhem'
subtitle: The Hidden Cost of Granularity in Graphite
date: '2024-12-31'
peek: 'This is an incident that caused the disk I/O to surge by 200x, database latency to increase from a few milliseconds to ~30 seconds, and a perfectly running Grafana dashboard to turn into a digital sloth...'
---
![images/metrics_mayhem](/images/overflowing_closet.png)

When working with complex systems, it’s easy to underestimate the impact of seemingly minor changes. This is an incident that caused the disk I/O to surge by 200x, database latency to increase from a few milliseconds to ~30 seconds, and a perfectly running Grafana dashboard to turn into a digital sloth. 

It revolves around a pretty common observability stack that includes Grafana, Graphite, and GoCarbon. At the heart of it is Graphite, a file-based time-series database that stores application metrics. It collects data via StatsD.

Graphite consists of two primary components:
- Carbon : A daemon that listens for incoming time-series data.
- Whisper : A file-based database library for storing time-series data.

GoCarbon is a Golang implementation of carbon that provides improved performance and better resource utilization than the original Python implementation. 

So imagine this - 

On a pretty normal working day, you notice that the alerting channels have been flooded with grafana alerts. The slight delay in displaying Grafana Dashboards that you’ve been overlooking for days has now grown into a significant issue. Other teams are also reporting that many of their dashboards are experiencing unusually long load times. Upon looking into it, you notice that the data retrieval has become a bottleneck. You start digging into it and discover that the size of one of the data files has ballooned to approximately 200 times the anticipated size.
After a bit more firefighting, the root cause becomes quite evident - **Granularity** that you had added to the metrics. A single line change in your git history that you did not think would become such a troublemaker. 

### Understanding Granularity
Granularity refers to the level of detail captured in metrics — essentially, how finely the data points are subdivided. For instance, let's say we’re tracking how often a function called *foo* runs within a
service named *bar*. Graphite represents metrics in a hierarchical structure using dot-separated names, also known as metrics paths. like this - `bar.core.foo` 
where, *core* is the namespace containing the foo function. 

Everytime the codeflow runs through this function, a metric point gets emitted. Each data point corresponds to an epoch timestamp, like -

 |epoch |foo|
|:------|:------|
  | 1732414698 |     1|
  | 1732414700 |     1 |

So far, so good.

Now let’s say we want to capture not just the number of calls but also the function’s return value — whether it’s true or false. This introduces subdivisions into the metric thereby increasing its granularity. Our new metrics become:
- `bar.core.foo.true`
- `bar.core.foo.false`

This tiny change completely alters how the data is stored:

  |epoch | foo.true | foo.false |
  |:------|:------|:------|
  | 1732414698 |    0 |  1 |
  | 1732414700 |      1 |  0 |

Every function call now requires storage across these subdivisions, whether the return value is `true` or `false`. Adding more granularity exponentially increases the storage constraints. 

This is what happened in your case. In an attempt to add more granularity to the metrics, you subdivided them into the tenants of your platform. Each tenant represented a distinct customer, and tracking their metrics individually was crucial for you. Although this approach gave you the clarity that you needed, the trade-off it came with was significant.

For each tenant, a new set of metric subdivisions was created. This meant that instead of storing a single data point for a given epoch, the system now stored a data point for each tenant. Something like this -

| epoch	| foo.tnt1 |foo.tnt2| foo.tnt3 | ...|
|:----|:----|:----|:----|:----|
|1732414698	| 1 | 0 | 0|...|
|1732414700	| 0	| 1	| 0|...|
|1732415830	| 0	| 0	| 1|...|

The metrics that were once aggregated into a single column for all tenants were now split into 200 separate columns, each representing a more granular data point. The replication of data across those additional columns increased the overall data size 200 times. This exponential growth in data volume consumed an enormous amount of storage space and placed an immense burden on data processing and retrieval. Each query that previously accessed a compact dataset now had to traverse a vastly bloated structure, leading to dramatic inefficiencies and system slowdowns.

### Reflections 
Understanding how data is stored, retrieved, and indexed in a database is non-negotiable. For instance, choosing the wrong indexing strategy can make a simple query unbearably slow, while the right one can make even complex queries lightning-fast. 

When working with Kafka, knowing how topics are partitioned and consumed is critical. Wrongly configured partitioning can lead to uneven loads, delayed processing, or even consumer lag spiraling out of control. 

If you're designing or consuming APIs, understanding rate limits, timeout behaviors, and caching mechanisms is crucial. Without this knowledge, you might inadvertently overwhelm a service or introduce latency to your application.

Metrics and logs are only as useful as their configuration. Are you aggregating the right data at the right granularity? Are your alert thresholds tuned to avoid noise but still catch critical issues?

Knowing your system and its nuances in depth is critical before making decisions. Whether it's addressing an on-call issue, optimizing performance, or scaling a platform, a deep understanding of how your system components function is the foundation for informed choices.

### References
- [Observability](https://newrelic.com/blog/best-practices/what-is-observability)
- [Grafana](https://grafana.com/)
- [Graphite](https://graphite.readthedocs.io/en/latest/overview.html)
- [StatsD](https://www.datadoghq.com/blog/statsd/)
---
title: 'Heartbeats in Distributed Systems'
subtitle: "A quick glance on failure detection"
date: '2025-06-30'
peek: 'While implementing heartbeats in the Pensieve, I realized that there are essentially two ways of detecting node failure...'
---

While implementing heartbeats in [Pensieve](https://github.com/mihirrd/pensieve), I realized that there are essentially two ways of detecting a node failure. The node proactively signaling “I’m alive” (Push model), and a node periodically asking "Are you alive?" (Pull model)

<p align="center">
<img src="/images/pulse.png" alt="" width="250"/>
</p>

The push model is often preferred for its lower latency and reduced polling overhead, but it comes with caveats. Let's have a look - 

### Push Model (POST): Proactive and Scalable
In the push model, each node sends its heartbeat at regular intervals to a central monitor or to its peers. This is typically done via a POST request.

This approach has several advantages:

- Scalability: Each node only needs to manage one outbound request per interval.

- Efficiency: Lower CPU usage, memory consumption, and fewer open connections, especially in larger clusters.

- Clarity of Failure: In the push model, failure = silence. If a node doesn’t send a heartbeat, it’s presumed to be down.


### Push-Based Brokers

Brokers push heartbeats every 3 seconds by default. Controller marks broker as dead after missing 2-3 consecutive heartbeats. Consumer groups also use push-based heartbeats to the group coordinator

Following reasons make Push model work for Kafka - 

- High-throughput messaging requires minimal overhead
- Broker failures need fast detection for partition reassignment
- Scales well with hundreds of brokers

### Pull Model (GET): Reactive and Demanding
In the pull model, a central node (or each peer) periodically pulls status from every other node using GET requests.

While functional, this introduces trade-offs:

- Resource Overhead: Each node (or monitor) must initiate N outbound requests every interval in a cluster of size N. This increases load and the number of concurrent connections.

- Asymmetric Failures: In a pull model, network partitions and latency can lead to ambiguity. For example, Node A might successfully reach Node B, but B might not reach A. This makes it unclear whether a node is actually down or just slow.

- GET requests might get cached, which we definitely don't want for heartbeats where freshness is critical.

### When Pull Makes Sense
That said, pull is not inherently bad; it's just better suited for different scenarios.

In environments where:
- You want precise, on-demand control over which nodes are scraped and when.
- The cluster is small or static.
- Node discovery is predictable.

For instance, Prometheus, a popular monitoring tool, uses a pull-based approach to collect metrics and perform health checks. This allows it to scrape targets on a fixed schedule and gives operators tight control over what is monitored and when. 

Similarly Kubernetes uses pull-based liveness and readiness probes. It takes the opposite approach with pull-based liveness and readiness probes. The kubelet pulls health status every 10 seconds by default, with rich configuration options for fine-tuning per workload. A typical configuration might look like checking `/healthz` every 10 seconds with a 5-second timeout and 3 failure threshold.

### Other Considerations
There are several other factors that can significantly impact reliability, scalability, and accuracy in health checks. Here are some key considerations I came across:

#### Interval and Timeout Tuning
Set a sensible heartbeat interval (e.g., every 2s) and a timeout threshold (e.g., 5s).
Add slight randomness (jitter) to intervals to avoid all nodes syncing up and causing load spikes. Too short = noisy and expensive; too long = delayed failure detection.

#### Clock Skew Awareness
Don’t assume perfectly synced clocks across nodes.
Always compare durations, not absolute timestamps.
This becomes especially important if you're tracking “last seen” times to determine liveness.

#### Failure Semantics
What does a missed heartbeat mean?
It could be a crash, a GC pause, network lag, or a temporary blip.
In pull-based systems, it's especially hard to know 
Your system needs to handle ambiguity gracefully.

#### Redundancy and Fault Tolerance
If a central node receives heartbeats, what happens if it crashes?
- Consider backup monitors, or decentralize the monitoring using a gossip protocol.
- Log heartbeat failures and recovery events for easier debugging.


#### Observability
Emit metrics like:

- Heartbeat success/failure count
- Average round-trip time
- Missed heartbeat streaks

These metrics are crucial for diagnosing outages and tracking system health over time.

--- 

These subtleties are often overlooked when working with existing frameworks or abstracted infrastructure. Health checks weren't new to me at all, but something I had always taken for granted; which I think was because I never implemented them from scratch. Building a distributed system from ground up forces you to examine every component with a sharper eye. I’ve had to question things I thought I understood and dig deeper into how systems actually behave in the real world. 

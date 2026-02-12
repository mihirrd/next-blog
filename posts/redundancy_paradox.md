---
title: 'The Redundancy Paradox'
subtitle: 'Why software maintenance is the harder problem.'
date: '2026-02-12'
peek: "Hardware usually breaks because of physics. Software breaks because of math and misunderstanding"
---

![images/pico-8-movement](/images/redundancy_paradox.png)

Let's say you are building a temperature analytics system. You are working on both the hardware and software parts of it. As for the IoT devices to measure temperature, you decide to have one with a thermistor and one with a thermocouple. Rationale being, if one technology fails, the other one will carry you forward. This is called the 1-out-of-2 principle, or Diverse Redundancy in this case. Quite intuitive, in fact, the gold standard in hardware systems.

But then, you decide to follow the same principle in your software. 
You commission two different teams to build completely separate implementations of the critical component: the algorithm that detects anomalous temperature spikes and filters out sensor noise.
Both teams will implement this independently with different tech stacks and different logic, but both implementations must produce the same results.

Pause for some time and think about whether this is a good idea...

### The Nature of Failure
The software safety standards actually advise against it, and the main reason is the nature of the failure. 

Hardware usually breaks because of physics. A fan gets dusty, a capacitor leaks, a battery loses capacity, or moving parts wear out. If there is one electronic sensor and one mechanical switch, they are unlikely to share the same physical "blind spot." Thus, a hardware failure is almost an independent event. 

Software doesn't break because of physics; it breaks because of math and misunderstanding. The [Knight-Leveson](https://www.csc.kth.se/utbildning/kth/kurser/DA2210/vettig13/Seminarier/KnightLeveson.pdf) study found that even when different teams write software independently, they tend to make the same logical errors in the same difficult parts of the requirements. If the specification says, "Handle the edge case of a 0.001ms delay," and that requirement is hard to implement, both teams will likely introduce a bug at that exact point. Diversity doesn't protect you from a flawed blueprint. 

This means your two "redundant" software systems will likely fail in the exact same scenarios, giving you no real redundancy at all; just twice the code with the same vulnerabilities.


### The Maintenance Burden
But even if you could somehow guarantee true independence between your two implementations, you'd face an even harder problem: maintenance. You now have twice as much code to maintain, verify, and document. I assume you'd already thought about this when I asked you to pause earlier. But what makes software maintenance such a pain in the ass? 

#### Software Maintenance Isn't Really "Maintenance"
In software, "maintenance" is a misnomer if you are from a hardware background. You aren't usually fixing something that wore out. You're fixing something that was never actually right to begin with, or you're changing it because the world around it moved. When you change one line of code in a large system, you are potentially changing the meaning of every other line that touches it. 
Now multiply this work by two. Every bug needs to be understood, fixed, and verified in both implementations. Every edge case needs to be handled twice. Every security patch needs to be applied to two different codebases with two different architectures.


#### Software Never Reaches Steady State
Hardware eventually reaches a "steady state." Once a server is racked and cooled, it stays the same for years. Software, however, sits in a soup of changing dependencies. Your uv environment might be locked, but the OS, the APIs it calls, and the security exploits discovered yesterday are all shifting. To keep software "the same," you have to change it constantly.
With two redundant implementations, you're not just maintaining two codebases—you're maintaining two different dependency trees, two different test suites, two different sets of assumptions about the world. The maintenance burden doesn't just double; it compounds.

-----

In the hardware world, you're a mechanic. In the software world, you're a historian and a detective trying to figure out what a version of yourself from three years ago was thinking. Hardware redundancy works because failures are independent. Software can't achieve that independence, and trying only doubles the maintenance burden.


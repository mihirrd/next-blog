---
title: 'Intriguing Duality of Load Balancers'
date: '2024-11-03'
peek: 'Websockets are technically an HTTP upgrade — When a client initiates a Websocket connection...'
---
Horizontal scaling typically involves adding servers to the cluster and evenly distributing the workload through a [Load Balancer](https://aws.amazon.com/what-is/load-balancing/). This is relatively straightforward for HTTP requests, primarily due to their stateless nature. Each HTTP request is an independent and isolated attempt to communicate with the server. No two requests share the same context. (though there are mechanisms to achieve this wherever necessary)

Websockets, however, are persistent, full-duplex TCP connections between the client and the server. In a multi-node setup, once the connection is established, each request must be routed to the same server. This makes scaling out a bit more challenging.
Interestingly, load balancers like HAProxy, nginx, and AWS ELB have a fascinating approach to handling such scenarios. Let’s walk through the flow from the beginning.


### Websocket Handshake 
Websockets are technically an HTTP upgrade — When a client initiates a Websocket connection, it sends an HTTP request with the `Upgrade` header set to `websocket`, signaling its intent to establish the connection. This initial request is routed by the load balancer to one of the servers in the cluster. At this point, the load balancer operates at Layer 7 i.e application layer.

![images/websocket](/images/duality_of_lb_2.png)

### Persisting connections 
Once the TCP connection is established, each request must be routed to the correct server, which can add latency and processing overhead if examined at Layer 7. This is where the load balancer shines through. Instead of inspecting each request at the application layer, the load balancer shifts to operating at Layer 4. It routes requests by checking the `(source_ip, source_port, destination_ip, destination_port)` tuple in the TCP header, allowing it to efficiently maintain connection persistence with minimal resource usage. This approach maintains sticky sessions for persistent TCP connections while still operating at Layer 7 for other, non-persistent connection requests.

![images/websocket](/images/duality_of_lb_1.png)

### Caveats
This duality, like any other design decision, comes with tradeoffs. 
Layer 4 load balancers don’t perform SSL termination, meaning encrypted websocket connections `(wss://)` are passed through without being decrypted. SSL termination would have to be handled by the backend servers, which can increasing their workload.

Layer 4 load balancers often provide basic health checks (e.g., TCP connection checks), but they can’t perform detailed health checks at the application level. This may result in websocket traffic being sent to a server that’s technically reachable but not fully functional for the application. 
If a connection drops and the client reconnects, a Layer 4 load balancer may direct it to a different backend server, potentially losing state if the application doesn’t support distributed state management. This problem is solved by implementing a distributed session storage. 

Being able to visualize what happens under the hood, helps better understand performance bottlenecks and make informed decisions about scaling and optimizing the architecture. But more importantly, it deepens the appreciation for the engineering that goes behind solving seemingly commonplace problems. 

### References
- [www.pubnub.com/guides/websockets/](https://www.pubnub.com/guides/websockets/)
- [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- [www.f5.com/glossary/load-balancer](https://www.f5.com/glossary/load-balancer)


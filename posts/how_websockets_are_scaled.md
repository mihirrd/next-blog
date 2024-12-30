---
title: 'How Websockets are Scaled'
subtitle: 'The Duality of Load Balancers'
date: '2024-11-03'
peek: 'When a client initiates a Websocket connection, it sends an HTTP request with the `Upgrade` header set to `websocket`, signaling its intent to establish the connection. Once the TCP connection is established, each request must be routed to the correct server, which can add latency and processing overhead if examined at Layer 7...'
---
![images/websocket](/images/duality_of_lb_cover.png)

Horizontal scaling (or scaling out) typically involves adding servers to the cluster and evenly distributing the workload through a [Load Balancer](https://aws.amazon.com/what-is/load-balancing/). HTTP traffic scales easily because requests are stateless, meaning each one can go to any server.
Scaling websockets, however, comes with rather a challenge due to their persistent, full-duplex nature. Once a Websocket connection is established, it’s crucial for each interaction within that session to route back to the same server to ensure continuity.
Interestingly, Load Balancers such as HAProxy, nginx, and AWS ELB have a fascinating approach to handling such scenarios. In this post, I attempt to highlight the same and explain a few scaling strategies of websocket connections.


### Websocket Handshake
Websockets are technically an HTTP upgrade — When a client initiates a Websocket connection, it sends an HTTP request with the `Upgrade` header set to `websocket`, signaling its intent to establish the connection. This initial request is routed by the load balancer to one of the servers in the cluster. At this point, the load balancer operates at Layer 7 i.e. the Application Layer of the OSI model.

![images/websocket](/images/duality_of_lb_2.png)

### The Duality of Load Balancers
Once the TCP connection is established, each request must be routed to the correct server, which can add latency and processing overhead if examined at Layer 7. This is where the load balancer shines through.

![images/websocket](/images/duality_of_lb_4.png)

Instead of inspecting each request at the application layer, the load balancer shifts to operating at Layer 4. It routes requests by checking the `(source_ip, source_port, destination_ip, destination_port)` tuple in the TCP header, allowing it to efficiently maintain connection persistence with minimal resource usage. This approach maintains sticky sessions for persistent TCP connections while still operating at Layer 7 for other, non-persistent connection requests.

![images/websocket](/images/duality_of_lb_1.png)

### Caveats
This duality, like any other design decision, comes with tradeoffs. 
Layer-4 load balancers don’t perform SSL termination, meaning encrypted websocket connections `(wss://)` are passed through without being decrypted. This process is typically performed by load balancers or dedicated SSL termination proxies to relieve backend servers from the computational burden of handling SSL encryption and decryption. SSL termination would have to be handled by the backend servers, which can increase their workload.

Layer-4 load balancers often provide basic health checks (e.g., TCP connection checks), but they can’t perform detailed health checks at the application level. This may result in websocket traffic being sent to a server that’s technically reachable but not fully functional for the application.
If a connection drops and the client reconnects, a Layer-4 load balancer may direct it to a different backend server, potentially losing state if the application doesn’t support distributed state management. This problem is solved by implementing a distributed session storage.

### Websocket Scaling Strategies
#### Using a Distributed Message Broker (Pub/Sub)
A distributed pub/sub system, such as Redis Pub/Sub, Kafka, or RabbitMQ, can be used to broadcast messages to multiple WebSocket servers. When a client sends a message, it is published to the broker, which then distributes it to other connected servers. It ensures all users receive the message regardless of the server they’re connected to.
#### Sharding Based on User Segmentation
For applications like chatrooms or live streams, sharding connections by topic, room, or channel can help scale Websocket usage. All users in a chatroom can be routed to the same set of servers which makes it easier to broadcast messages within that room without unnecessary server hops.
#### Edge Computing
Using a Content Delivery Network (CDN) with Websocket support can improve response times and distribute connection load. Although traditional CDNs cache static content, some modern CDNs, like cloudflare, offer Websocket compatibility.
#### Serverless WebSocket Solutions
Managed Websocket services, like AWS API Gateway for Websocket or Azure Web PubSub, allow automatic scaling with serverless architectures. These services handle scaling, connection management, and message routing, abstracting away the complexities of server and connection management.

___

Being able to visualize what happens under the hood, helps better understand performance bottlenecks and make informed decisions about scaling and optimizing the architecture. But more importantly, it deepens the appreciation for the engineering that goes behind solving seemingly commonplace problems.

### References
- [Websockets](https://www.pubnub.com/guides/websockets/)
- [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- [Load Balancers](https://www.f5.com/glossary/load-balancer)
- [Websockets with CDNs](https://developers.cloudflare.com/network/websockets/)
- [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html)


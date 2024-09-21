---
title: 'The Essence of Apache Kafka'
slug: 'essence_apache_kafka'
date: '2023-12-14'
---

Imagine that you go to your usual coffee place and encounter a gigantic queue. Going a little further, you realize that each individual has to wait in line until the coffee is prepared and handed over to them, as opposed to just placing the order at the counter and moving on. The latter approach seems pretty obvious since we know that order placement and the subsequent preparation process can be done as distinct, independent activities. The orders can be listed on a board and the barista can prepare them one after another. This idea is called asynchronous communication, where entities do not necessarily wait for each other to complete a task before initiating another.

This problem is not so uncommon in software systems either. For example, when you post a picture of your cat wearing Santa’s costume, other people don’t need to receive a notification about the same immediately (no matter how cute the cat looks). Otherwise, you could find yourself in a situation where the app is loading for hours because a lot notifications are still pending to be sent. The ‘notification service’ can do its job at its own pace; it just needs to receive the ‘message’ to do so from the ‘upload service’. (Services are basically software components that are responsible for carrying out certain tasks).

Now let’s see how we can establish the asynchronous communication between them.
---
name: redplex
summary: Redis pubsub multiplexer service.
ghOwner: mixer
lang: [Go]
---

One of the many features of [Redis](https://redis.io/) is a pubsub protocol. Clients can subscribe to and publish events. At [Mixer](/work/mixer), we ran many of our systems on large "bare-metal" servers. One of these was our chat service, which received messages through Redis pubsub and ran on our hefty dual-CPU, 40-core servers.

Now, chat was written in Node.js, which is single threaded. The easy way to take advantage of all these cores is to spin up roughly one process per core. This meant that each process had its own channel to Redis which could, and often did, cause Redis to send a message to the same server up to 40 times. Multiply that out to a couple dozen servers, and you're starting to look at some load.

redplex is a service which implements the Redis protocol, multiplexing events and ref-counting subscribe requests. Each chat process connected to the local redplex instance, which would receive the pubsub message on their behalf and send it to the interested local processes.

This worked swimmingly and significantly reduced load on our system. redplex is well-optimized and consumed hardly any resources, and was benchmarked at a several gigabits-per-second of data over loopback. It lived on in production until Mixer eventually spun down.

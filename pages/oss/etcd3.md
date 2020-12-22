---
name: etcd
summary: Node.js client library for etcd.
ghOwner: microsoft
lang: [TypeScript]
---

[etcd](https://etcd.io/) is a data store that backs a sizable chunk of critical web infrastructure, like Vitess and Kubernetes. We also used it at [Mixer](/work/mixer) in a system called Constellation, which I will one day write about. Several years ago they released their grpc-based "v3" API, which is more efficient and capable than the previous version.

In this client I maintain, to my knowledge, the only mature and stable Node.js client for their current API.

Using underlying etcd data store, etcd implements higher level constructs like software transactional memory (STM), elections, and soon hashrings. I also took the chance to play with [TLA+](https://en.wikipedia.org/wiki/TLA%2B) to prove correctness of the watcher implementation, which is one of the more intricate portions of the code.

Recently I've married etcd3 to [Cockatiel](/oss/cockatiel) for fault-handling.

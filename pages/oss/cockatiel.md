---
name: cockatiel
summary: Cockatiel is resilience and transient-fault-handling library for JS/TS services.
lang: [TypeScript]
---

After [Mixer](/work/mixer) was acquired by Microsoft to become part of Xbox, we started migrating many of our services to .NET to take advantage of Xbox Live's tooling and infrastructure.

In these services, we used the wonderful [Polly](https://github.com/App-vNext/Polly) project to deal with transient failures and fault-handling--particularly important in our move to microservices. I missed having a similar tool in my Node.js work, so I wrote Cockatiel.

At some point, I'll write some blog posts about fault handling.

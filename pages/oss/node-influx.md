---
name: node-influx
summary: Node.js client library for InfluxDB.
ghOwner: node-influx
lang: [TypeScript]
---

[InfluxDB](https://www.influxdata.com/) is a high performance* time-series data store. We initially used it at [Mixer](/work/mixer) before we ran into some scaling issues (InfluxDB was less mature at the time, and we were pushing outside the average use case--no hard feelings.)

The InfluxDB client at the time was not actively maintained and had some design and usability issues. I volunteered to maintain it, spruce it up, and port it to TypeScript.

I was less skilled at API design then than I am now, and there are some API warts to show for that. After priorities shifted at Mixer and InfluxDB continued to rapidly evolve, I didn't have a large enough allocation of personal time to keep up maintainence. But node-influx remains a used and useful tool, and I am thankful for [@bencevans](https://github.com/bencevans) for his continued work on the project.

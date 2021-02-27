---
title: 'billboard to home server'
date: '2021-02-27'
---

I was showing off the neat things I could do with my [Home Assistant](https://www.home-assistant.io/) setup to my mom the other day, and she mentioned she'd be interested in a similar system for their house.

## Buying

The Home Assistant docs recommend a Raspberry Pi model B with 4GB of RAM as a hardware configuration. But getting the Pi, power adapter, case, suitable SD card, and micro HDMI to HDMI converter adds up to around $90 on Adafruit pre-tax. Meanwhile there's lots of old computers on Ebay looking for a home, which would be much more interesting to play with. That search brought me to this beauty, the "Nexcom NDiS-163 Digital Signage Player":

[![](/blog/0003/system.jpg)](/blog/0003/system.jpg)

Apparently designed for running electronic billboards and signs, the NDiS-163 features 4GB of RAM and a [2008-era Core 2 Duo](https://ark.intel.com/content/www/us/en/ark/products/35568/intel-core-2-duo-processor-p8600-3m-cache-2-40-ghz-1066-mhz-fsb.html) laptop CPU. It's not the fastest machine I've ever had in my house, but it should have _roughly_ the performance of a Raspberry Pi, is fanless, and was $42.99 delivered to my front door. And it has GPIO, neat.

The power supply is rated at 96 watts, but TDP for the CPU is only 25W, maybe it's made to deliver substantial current over its VCC pin? More likely this is a standard PSU Nexcom used on a variety of models. I don't have equipment for measuring its power draw from the wall, but it would be hard to dissipate anything close to 96 watts in its small set of passive fins (just look at this [big passive cooler](https://youtu.be/0RYFsb99OwI?t=168) that cooks a Ryzen 3600 at 45W). Regardless, it may not be as power efficient as a Raspberry Pi, but in the PNW we need heating much more often than we need cooling, so any excess is not really 'waste' heat anyway.

## Hardware

It arrives! It's surprisingly well constructed, and _heavy_. The top of the board is a solid piece of CNC'd aluminium, interfaced with thermal pads onto the CPU and north(?) bridge. I assume the L-shaped motherboard is custom to some degree, and that the two mini PCIe slots are used for other models of the machine, perhaps wifi-enabled versions. The case has mounts for 30mm case fans, which supports the idea that there were higher-wattage, non-fanless models available.

[![](/blog/0003/opened.jpg)](/blog/0003/opened.jpg)

The BIOS worried me for a moment reporting IDE drives, but it turned out to house a 2.5" SATA drive after all. I swapped out the hard drive for a $25, 128GB ADATA SSD. That brought the budget to $68, but I'm much happier running an SSD over an hard drive (or an SD card, for a Pi) for Home Assistant that writes and reads from its sqlite database frequently. Best of all, there's no longer any moving parts, making it completely silent.

## Software

This is not exactly a Threadripper system, so I went with [Alpine Linux](https://alpinelinux.org/) as a small, lightweight Linux distro. It took some fiddling to get the bootable USB to work, but after formatting using [Rufus](https://rufus.ie/) in "ISO Mode" it installed smoothly.

After getting it running, my next natural step was to use VS Code's [remote SSH](https://code.visualstudio.com/docs/remote/ssh) to connect to it and start setting up Home Assistant, but I ran into two problems. First was that the remote server expected `bash` to be installed, and didn't work with Alpine's default `ash` shell. I installed `bash` manually, which got me further, but then I ran into an "unsupported architecture" error. Though we ship a 32-bit Windows build of VS Code, we don't ship 32-bit Linux!

So I was stuck manually `ssh`'ing in like the good ol' days. But that's alright, a quick `apk add docker` and a drop of my [docker-compose.yml](https://gist.github.com/connor4312/f16544bcc5b48af345a94feedb5a0ee1) (which runs the fantastic [zigbee2mqtt](https://www.zigbee2mqtt.io/) and a [mosqitto](https://mosquitto.org/) server) and we're good to go:

[![](/blog/0003/its-alive.png)](/blog/0003/its-alive.png)

The Zigbee dongle is still on the way -- a Conbee II, in this case, since it'll be covering a fairly large, low-density area. Once that and the sensors come in, I should be all set.

## It Works Well

There's innumerable listings for mini PC's on Ebay at any time: lots embedded machines like this for signage or projecting equipment, as well as old Chromeboxes, compact ThinkStations, and so on. Instead of buying a new Raspberry Pi off the production line, consider saving one of these computers from becoming e-waste. Chances are it'll be a bit cheaper, and if you need GPIO you can [get that via USB](https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20210226225356&SearchText=FT232H) pretty easily.

The downsides are:

- Size. Pi's are small. Mini PCs are not quite so small.
- Power consumption. For thermal consideration if nothing else, most of the 2010s-era mini PC's are using Intel mobile CPUs. While they sip power lightly for a desktop, the Pi's [2-7 watt power consumption](https://www.pidramble.com/wiki/benchmarks/power-consumption) will still be lower.
- Display resolution. The integrated GPUs found on these mini PCs tend to be pretty anemic, while the Raspberry Pi 400 supports 4k displays. However, this is not a concern if you're using the device as headless server.

I'm consdering doing something like this again to set up a monitoring system for my houseplants. You can buy capacitive soil sensors for under $0.50 each on Aliexpress; it would be useful to show moisture information for all my plants in Home Assistant, and even script them individually to remind me when to water them. For example, if one plant likes a constant moisture, or if another likes to stay dry a few days between watering, that could be automated. Stay tuned.

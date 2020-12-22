---
name: arcade-machine
summary: Input abstraction layer for gamepads, keyboards, and UWP apps in React.
ghName: arcade-machine-react
ghOwner: mixer
lang: [TypeScript]
---

At [Mixer](/work/mixer) we, of course, had an Xbox app. Universal Windows Platform (UWP) web apps run on Xbox, and can opt to either receive gamepad input as keyboard events, or handle it themselves. The former is easy to get started with, but eventually apps will usually want to take gamepad input directly for more advanced scenarios and better overall experience.

arcade-machine provides bindings in React and React components for gamepads. It works on Xbox, as well as on your computer (go ahead and plug in your Xbox controller with the demo page open!)

This was actually the first React code I ever wrote, but it served us well and was/is used by a number of other internal and external consumers. It needs a could benefit from the addition of a hooks API.

I also wrote our original Angular version of this, but we don't talk about Angular...

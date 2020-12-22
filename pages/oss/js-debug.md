---
name: js-debug
summary: The JavaScript debugger for VS Code and VS.
ghOwner: microsoft
ghRepo: vscode-js-debug
lang: [TypeScript]
---

js-debug is the built-in JavaScript debugger for VS Code, and is also shared with Visual Studio proper. At the time of writing, this is one of the projects I currently work on actively. It leverages the [Chrome Devtools Protocol](https://chromedevtools.github.io/devtools-protocol/) to debug Chrome, Edge, React Native, Blazor, and any other CDP-speaking target.

This debugger is a 'cleanroom' implementation which is the latest in a couple generations of debuggers in VS Code and VS over the years. The primary conceptual shift the debugger takes over previous generations is the notion of 'multi-target' debugger, which lets it deal with things like child processes, worker threads, web workers, service workers, and iframes.

It also brings a fresh focus on user experience, and a slew of other improvements such as profiling, deminification, and easier entry points for new users.

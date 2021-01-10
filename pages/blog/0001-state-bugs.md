---
title: 'make bugs harder to write'
date: '2021-01-09'
---

Arguably the most powerful aspect of statically typed languages is the ability to model your domain--the world of things your program knows about. Writing and testing bits of code that operate on small facets of the domain are easy. Rationalizing and testing how parts of the domain fit together in a whole is much harder and is where I've seen experienced programmers generate the most bugs. In this post I'll discuss and give some examples showing how I try to model data so that this class of bug is harder (or ideally impossible!) to write.

Succinctly, **if a state should be impossible, make it impossible to represent**. I'll present three strategies and examples for how I've tackled this before:

- Use enum differentiators for values or properties in different states;
- Avoiding duplication that can result in torn state;
- Shaping APIs so that invalid calls are harder to make.

I'll be using TypeScript for this, since it's what I use most often nowadays and has a capable type system. However, you can translate this to other languages with greater or lesser fidelity.

## Enum Differentiators: HTTP Requests

At the type of writing, immutable data stores (like Redux or MobX/VueX) are the jam for writing frontend applications. When dealing with web requests, you'll often want to store some state object. An initial approach might have you write something like this, as a TypeScript interface:

```typescript
interface FormSubmitState {
  isLoading: boolean; // whether we're making a request
  errorCode?: number; // set if the response was an error
  result?: MyFormResult; // set once the data comes back
}
```

However, this is not a very well-typed model. Only one of `isLoading`, `errorCode`, or `user` will be relevant at a given time.

This could lead to some real bugs, for example it'd be easy to forget to clear the `errorCode` if the user corrects their input and resubmits it, which could result in both an "error" and "success" message being shown at the same time. Worse, if you don't use strict null types in TypeScript (or are writing something like this in a language that doesn't have them) you could use the `result` when it wasn't loaded, resulting in a null pointer exception.

Instead, what we can do is create a type that looks something like this:

<div>hello</div>

```typescript
const enum RetrievalState {
  Idle,
  Working,
  Succeeded,
  Errored,
}

type Retrieval<T> =
  | { state: RetrievalState.Idle | RetrievalState.Working }
  | { state: RetrievalState.Succeeded; value: T }
  | { state: RetrievalState.Errored; errorCode: number };

type FormSubmitState = Retrieval<MyFormResult>;
```

In here, we define an enum for all the possible states we want to represent. In addition to lending type information, enumerating all the possible states makes it very clear what we need to represent when we implement our UI. You probably didn't immediately distinguish that there were four states in our value-pack interface above, but they're obvious here!

Also, it requires us to check the state before we can operate (or assume) any additional properties. If we try to use `value` without checking that the request has succeeded, we'll get yelled at:

```
src/example.ts:17:18 - error TS2339: Property 'value' does not exist on type 'Retrieval<{}>'.
  Property 'value' does not exist on type '{ state: RetrievalState.Idle | RetrievalState.Working; }'.

17 console.log(state.value);
```

The "retrieval" type is simple, but so useful that we made a small [npm module](https://github.com/mixer/retrieval) for it on my old team.

## Duplication: More on Stateful Stores

Web applications inevitably deal with requesting paginated resources from a server. Using the `Retrieval` type, that could be represented as an array of 'things', along with a Retrieval indicating the loading state and eventually holding a pagination token if there's more data to load:

```typescript
interface MyStateStore {
  thingsTheUserOwns: Thing[];
  // continuation token if more data, undefined otherwise:
  thingsRetrieval: Retrieval<string | undefined>;
}
```

Now, say there's a form where the user can edit one of their "things", after which the API will give back the modified object. An initial approach might look something like this:

```typescript
interface MyStateStore {
  thingsTheUserOwns: Thing[];
  thingsRetrieval: Retrieval<string | undefined>;
  thingThatWasEdited: Retrieval<Thing>; // <-
}
```

This works okay, but what if the user goes back to their list of things after they're done editing? We could check to see if `thingThatWasEdited` was in the `thingsTheUserOwns` array, and replace it if so.

However, that introduces the possibility for a sheared state between the object in `thingThatWasEdited` and `thingsTheUserOwns`. For example, we might refresh the list and the item could contain other changes, but if antoher UI component uses `thingThatWasEdited` elsewhere, it will show outdated information. Given that we want our UI to always show the current version of every `Thing`, this allows for a state that should be impossible!

Instead, what I prefer to do is have a central maping of IDs to objects. Whenever other state references the object, it does so by ID instead of holding a copy of an instance by itself.

```typescript
interface MyStateStore {
  allThings: { [id: string]: Thing };

  thingsTheUserOwns: string[]; // now a list of IDs
  thingsRetrieval: Retrieval<string | undefined>;
  thingThatWasEdited: Retrieval<string>; // now holds the item ID
}
```

Now, since objects exist only in one place, it's guarenteed that they will always be consistent in the UI. As an aside, this also encourages patterns that make rerendering more efficient.[^1]

## API Shape: Etcd Elections

I maintain [the Node.js client](/oss/etcd3) for etcd's v3 API, and I try to have or pass parity with their first-party Go implementation. This winter I finally landed a PR to add election support. The [original interface in Go](https://pkg.go.dev/go.etcd.io/etcd@v3.3.25+incompatible/clientv3/concurrency#Election), translated to TypeScript and summarized, looked like this:

```typescript
interface Election {
  /** Campaigns a value for election, resolves once the value is elected */
  campaign(value: string): Promise<void>;
  /** Header is the response header from the last successful election proposal,
      or undefined if there was none. */
  header(): Header | undefined;
  /** Observe returns a channel that reliably observes ordered leader. */
  observe(): Observable<string>;
  /** Proclaim lets the leader announce a new value without another election.
      Errors if the campaigned value is not elected or there is no campaigned value. */
  proclaim(value: string): Promise<void>;
  /** Resigns a campaigned value from the election. (Calling it with an ongoing
      campaign can lead to surprising results.) */
  proclaim(value: string): Promise<void>;
  // ...
}
```

There's more methods, but you get the picture. The API is very stateful, and very easy to misuse if you call something at the wrong time. To be safe, a consumer would effectively need to store some indicator for the current "campaign" state beside their election, and check that before making any calls or `try/catch` around their call sites. Easy things to forget to do, and noisy.

Something further that doesn't come across well is that the Election API is not thread-safe. This is not a 'bug', but it means that usages that are fine in a single-threaded Go consumer would cause issues in async-happy Node.js. For example, what happens if someone calls `proclaim()` when a campaign is happening? In Go, this is illegal, but in Node it's more likely to happen.

One more thing you might have missed: there are two disjoint usages of the API, observing the election as well as campaigning. For the Node.js implementation, made the election have only two (relevant) methods that return separate objects:

```typescript
interface Election {
  campaign(value: string): Campaign;
  observe(): Promise<ElectionObserver>;
}

interface Campaign extends EventEmitter {
  // Emits the "elected" event when elected, "error" if error, etc.
  proclaim(value: string): Promise<void>;
  resign(): Promise<void>;
  // ...
}
```

There's mostly looking at the "Campaign" interface, there's two safeguards this adds:

1. You cannot call methods like `resign()` and `proclaim()` if there's not yet a campaign happening. There's no possibility for error there.
1. These methods are legal to call at any time. Even if a campaign is still happening, `proclaim()` was designed to be able to update the ongoing value and return once published.

These tweaks to the API shapes remove most of the footguns that would be present in a direct translation of the Go API into JavaScript. Calling `proclaim` is disallowed after resigning, but there's no way we can guard against that in JavaScript.

## That's It

In the beginning ~~the Universe~~ state was created. This has made a lot of people very angry and been widely regarded as a bad move.

State is hard, and even better than these strategies would be avoiding state altogether! Maybe that's why we're seeing a renaissance of 'new age' service-side rendering with tools like [Next.js](https://nextjs.org/), [remix.run](https://remix.run/), [hotwire](https://hotwire.dev/), in rebuke of the heavy client-side apps that have dominated the last half-decade of web development. I have expertise in big ol' SPA development, but I would not be sorry to trade it in for less complex systems.

Regardless, you're always going to be dealing with a database, so this article should not fully go to waste. Hopefully the tips here gave you some inspiration on ways to make your domain and models more precise, if you're unlucky enough to deal with state :)

[^1]: If you had an array of Thing objects, when one of them changed then the array will be updated, requiring any `<ThingList>` elements to rerender. However, if you have an array of IDs and `<ThingList>` passes individual IDs into `<ThingDisplay>` elements, then only the individual `<ThingDisplay>` associated with the updated object will rerender.

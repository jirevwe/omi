# Omi 🌊

Lmao. Ignore the name for a second.

This lib was inspired by [@shinout's](https://github.com/shinout) [ArrayStream](https://github.com/shinout/ArrayStream).

This a tiny tool that turns a array into a stream to which items can be added to. I wrote this because a few stream libs I found didn't allow me add items to it after I'd already created the stream. Plus I wanted to learn a little about streams in NodeJs.

## Usage

```ts
import Omi, { OmiEvent } from '.';

const omi = new Omi([]);

omi.on(OmiEvent.DATA, (data, key) => {
  console.log(key, data);
});

omi.on(OmiEvent.END, () => {
  console.log('Stream closed');
});

omi.on(OmiEvent.ERROR, error => {
  console.log(error);
});

setTimeout(() => {
  omi.add([...Array.from({ length: 100 }).keys()].map((i: number) => i ** i));
}, 1000);

setTimeout(() => {
  omi.add([...Array.from({ length: 100 }).keys()].map((i: number) => 2 ** i));
}, 3000);
```

## Contribution

PRs are welcome 😬

## TODO

- Write tests
- Comepletion handler callback to end stream context consuming the stream

# NB

We're hiring, DM me on twitter [@rtukpe](https://twitter.com/rtukpe) 😎

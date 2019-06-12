# Omi 🌊

This lib was inspired by [@shinout's](https://github.com/shinout) [ArrayStream](https://github.com/shinout/ArrayStream).

This a tiny tool that turns a array of objects into a stream to which items can be added to. I wrote this because a few stream libs I found didn't allow me add items to it after I'd already created the stream. Plus I wanted to learn a little about streams in NodeJs.

## Usage

```ts
import Omi, { OmiEvent } from '.';

const omi = new Omi<number>([]);

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

## Usage with `Stream`s or `Transform`ers

```ts
import { createWriteStream } from 'fs';
import Omi from '..';
import faker from 'faker';
import { join } from 'path';
import { Transform } from 'stream';

const omi = new Omi<string>([], false);

const uppercaseTransformer = new Transform({
  transform(chunk, encoding, callback) {
    const upperCase = chunk.toString().toUpperCase() + '\n';
    this.push(upperCase);
    callback();
  }
});

// create a write stream to the file system
const writeStream = createWriteStream(join(__dirname, '../../test.txt'));

// pipe the data into the file as it is recieved
omi.pipe(uppercaseTransformer).pipe(writeStream);

// add data to the stream
omi.add(
  [...Array.from({ length: 100 }).keys()].map(() => faker.lorem.lines(1))
);

// add data to the stream
omi.add(
  [...Array.from({ length: 100 }).keys()].map(() => faker.internet.email())
);
```

## Contribution

PRs are welcome 😬

## TODO

- Write tests

## PS

We're hiring, DM me on twitter [@rtukpe](https://twitter.com/rtukpe) 😎

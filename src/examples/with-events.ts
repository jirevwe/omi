import Omi, { OmiEvent } from '..';

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

[...Array.from({ length: 10 }).keys()].forEach(() => {
  setTimeout(() => {
    omi.addMany(
      [...Array.from({ length: 10000 }).keys()].map((i: number) => i ** 2)
    );
  }, 100);
});

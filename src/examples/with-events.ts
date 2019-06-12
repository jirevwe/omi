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

setTimeout(() => {
  omi.add([...Array.from({ length: 100 }).keys()].map((i: number) => i ** i));
}, 1000);

setTimeout(() => {
  omi.add([...Array.from({ length: 100 }).keys()].map((i: number) => 2 ** i));
}, 3000);

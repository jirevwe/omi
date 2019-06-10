import { Stream } from 'stream';
const nextTick = process.nextTick;

export enum OmiEvent {
  READABLE = 'readable',
  ERROR = 'error',
  CLOSE = 'close',
  DONE = 'done',
  DATA = 'data',
  END = 'end'
}

export default class Omi<T> extends Stream {
  private keys = [];
  private items: T[];
  private index: number;
  private paused: boolean = false;
  private readable: boolean = true;

  constructor(_items: T[]) {
    super();
    this.index = 0;
    this.items = _items;
    this.keys = Object.keys(this.items);
  }

  stream() {
    return this;
  }

  bind() {
    // fires the `emit` function immediately
    nextTick(this.emit.bind(this));
  }

  // unpause the stream and poll the op in the event loop
  resume() {
    this.paused = false;
    this.bind();
  }

  // pause the stream
  pause() {
    this.paused = true;
  }

  // force close the stream
  end() {
    this.paused = true;
    this.readable = false;
    super.emit(OmiEvent.END);
  }

  add(_items: T[]) {
    //add the new items to the stream
    this.items = this.items.concat(_items);

    // remap object keys
    this.keys = Object.keys(this.items);

    // continue stream
    this.resume();
  }

  // override the original emit function
  // @ts-ignore
  emit() {
    // hook into the super's emit
    const emit = super.emit;
    const self = this;

    (function run() {
      try {
        if (!self.readable) return;

        if (self.index >= self.items.length) {
          // check if current iteration is done
          // self.pause();
          // self.end();
          emit.call(self, OmiEvent.DONE);
        } else {
          // emit the current item
          const currentKey = self.keys[self.index++];
          const currentItem = self.items[currentKey];
          emit.call(self, OmiEvent.DATA, currentItem, currentKey);

          // move to the next item
          if (!self.paused) nextTick(run);
        }
      } catch (error) {
        emit.call(self, OmiEvent.ERROR, error);
      }
    })();
  }
}

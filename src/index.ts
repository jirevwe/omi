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
  private mode: boolean;
  private paused: boolean = false;
  private readable: boolean = true;

  /**
   *  Creates a new array stream
   *
   * @param _items The array items
   * @param objectMode Object mode or string mode
   */
  constructor(_items: T[], objectMode: boolean = true) {
    super();
    this.index = 0;
    this.items = _items;
    this.mode = objectMode;
    this.keys = Object.keys(this.items);
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

  ended() {
    return this.paused && !this.readable;
  }

  // close the stream we're done here
  end() {
    this.paused = true;
    this.readable = false;
    super.emit(OmiEvent.END);
  }

  addMany(_items: T[]) {
    //add the new items to the stream
    this.items.push(..._items);

    // remap object keys
    this.keys = Object.keys(this.items);

    // continue streaming data
    this.resume();
  }

  addOne(_item: T) {
    //add the new items to the stream
    this.items.push(_item);

    // remap object keys
    this.keys = Object.keys(this.items);

    // continue streaming data
    this.resume();
  }

  // override the original emit function
  emit() {
    // hook into the super's emit
    const emit = super.emit;
    const self = this;

    return (function run() {
      try {
        if (!self.readable) return;

        if (self.index < self.items.length) {
          // emit the current item
          const currentKey = self.keys[self.index++];
          const currentItem = self.items[currentKey];

          // LMAO, I've changed this code many times.
          // If we push null to the stream, we're telling it we're done
          // :p xD :D
          if (currentItem === null) {
            self.end();
            return true;
          }

          emit.call(
            self,
            OmiEvent.DATA,
            self.mode ? currentItem : JSON.stringify(currentItem),
            currentKey
          );

          // move to the next item
          if (!self.paused) nextTick(run);
        }
      } catch (error) {
        emit.call(self, OmiEvent.ERROR, error);
        return false;
      }
    })();
  }
}

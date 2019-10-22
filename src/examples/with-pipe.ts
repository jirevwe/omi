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
omi.addMany(
  [...Array.from({ length: 100 }).keys()].map(() => faker.lorem.lines(1))
);

// add data to the stream
omi.addMany(
  [...Array.from({ length: 100 }).keys()].map(() => faker.internet.email())
);

const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;

    this.remainder = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    const chunkString = Buffer.concat([this.remainder, chunk]).toString(this.encoding);

    const splits = chunkString.split(new RegExp(os.EOL));

    this.remainder = Buffer.from(splits.slice(-1).join());

    splits.slice(0, -1).forEach(element => {
      this.push(element);
    });

    callback();
  }

  _flush(callback) {
    callback(null, this.remainder);
  }
}

module.exports = LineSplitStream;

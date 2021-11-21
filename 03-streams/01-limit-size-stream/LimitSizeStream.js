const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;

    this.limitCollector = 0;
  }

  _transform(chunk, encoding, callback) {
    this.limitCollector += chunk.length;

    if (this.limitCollector > this.limit) {
      return callback(new LimitExceededError());
    }

    callback(null, chunk.toString(this.encoding));
  }
}

module.exports = LimitSizeStream;

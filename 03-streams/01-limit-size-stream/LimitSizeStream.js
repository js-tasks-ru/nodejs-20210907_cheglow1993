const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({limit, ...options}) {
    super(options);

    this.limit = limit;
    this.size = 0;
    this.isObjectMode = !!options.readableObjectMode;
  }

  _transform(chunk, encoding, callback) {
    if (this.isObjectMode) {
      this.size += 1;
    } else {
      this.size += chunk.byteLength;
    }

    if (this.size > this.limit) {
      callback(new LimitExceededError());
      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitedSizeStream = require('./LimitSizeStream');

const FILE_UPLOAD_LIMIT = 1024 * 1024;

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (/\//.test(pathname)) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const limitedStream = new LimitedSizeStream({limit: FILE_UPLOAD_LIMIT});
      limitedStream.on('error', (err) => {
        switch (err.code) {
          case 'LIMIT_EXCEEDED':
            res.statusCode = 413;
            res.end('file is too big');
          default:
            res.statusCode = 500;
            res.end();
        }

        stream.destroy();
        fs.unlink(filepath, () => {});
      });

      const stream = fs.createWriteStream(filepath, { flags: 'wx' });
      stream.on('error', (err) => {
        switch(err.code) {
          case 'EEXIST':
            res.statusCode = 409;
            res.end('File exists');
            break;
          default:
            res.statusCode = 500;
            res.end(err);
        }
      });
      stream.on('finish', () => {
        res.statusCode = 201;
        res.end();
      });

      req
        .pipe(limitedStream)
        .pipe(stream);

      req.on('close', () => {
        if (req.aborted) {
          fs.unlink(filepath, () => {});
        }
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

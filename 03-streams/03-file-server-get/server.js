const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const ERORR_SYSTEM_INTERNAL = 'System error';
const ERROR_NOT_FOUND = 'Not Found';
const ERROR_INCORRECT_PATH = 'Inappropriate file name';
const ERROR_NO_SUPPORT = 'Not implemented';

const checkIsFileExistsSync = (filepath) => {
  try {
    fs.accessSync(filepath, fs.constants.R_OK);
    return true;
  } catch(err) {
    return false;
  }
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (/\//.test(pathname)) {
    res.statusCode = 400;
    res.end(ERROR_INCORRECT_PATH);
    return;
  }

  const isFileExists = checkIsFileExistsSync(filepath);

  if (!isFileExists) {
    res.statusCode = 404;
    res.end(ERROR_NOT_FOUND);
    return;
  }

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);

      stream.on('error', () => {
        res.statusCode = 500;
        res.end(ERORR_SYSTEM_INTERNAL);
      });

      stream.pipe(res)
      break;

    default:
      res.statusCode = 501;
      res.end(ERROR_NO_SUPPORT);
      break;
  }
});

module.exports = server;

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const allowDir = path.join(__dirname, 'files');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(allowDir, pathname);

  switch (req.method) {
    case 'GET':
      if (path.dirname(filepath) !== allowDir) {
        res.statusCode = 400;
        res.end('Bad request');
      }
      
      fileStream = fs.createReadStream(filepath);
      fileStream
        .on('error', (err) => {
          console.log(err.message);

          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }
        })
        .pipe(res);
      
      req.on('aborted', () => fileStream.destroy())

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

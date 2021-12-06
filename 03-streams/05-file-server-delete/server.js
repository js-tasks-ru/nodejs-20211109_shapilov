const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const allowDir = path.join(__dirname, 'files');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.dirname(filepath) !== allowDir) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.rm(filepath, {}, (err) => {
        if (err && err.code === 'ENOENT') {
          console.log(err.message);
          
          res.statusCode = 404;
          res.end('File not found');
        } else if (err) {
          console.log(err.message);

          res.statusCode = 500;
          res.end('Internal server Error');
        } else {
          res.statusCode = 200;
          res.end('File deleted');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

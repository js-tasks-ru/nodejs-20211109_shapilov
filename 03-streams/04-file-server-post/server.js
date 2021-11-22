const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const allowDir = path.join(__dirname, 'files');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(allowDir, pathname);

  handleOnError = (err) => {
    if (err) {
      console.log(err.message);

      res.statusCode = 500;
      res.end('Internal server error');
    }
  }

  switch (req.method) {
    case 'POST':
      if (path.dirname(filepath) !== allowDir) {
        res.statusCode = 400;
        res.end('Bad request');
      }

      fileWritebbleStream = fs.createWriteStream(filepath, {flags:'wx'});

      req
        .pipe(new LimitSizeStream({limit: 1000000}))
        .on('error', (err) => {
          fileWritebbleStream.destroy(err);
        })
        .pipe(fileWritebbleStream)

      fileWritebbleStream
        .on('error', (err) => {
          console.log(err.message);
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File already exists');
          } else if (err.code === 'LIMIT_EXCEEDED') {
            fs.rm(filepath, {force: true}, handleOnError);

            res.statusCode = 413;
            res.end('Limit has been exceeded');
          } else {
            fs.rm(filepath, {force: true}, handleOnError);

            handleOnError(err);
          }
        })
        .on('finish', () => {
          res.statusCode = 201;
          res.end('File has been saved');
        });

      req.on('aborted', () => {
        fileWritebbleStream.destroy();
        fs.rm(filepath, {force: true}, handleOnError)
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

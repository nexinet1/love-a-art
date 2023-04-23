const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');
const zlib = require('zlib');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error: ${err.message}`);
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Encoding', 'gzip');
        zlib.gzip(data, (err, compressedData) => {
          if (err) {
            res.statusCode = 500;
            res.end(`Error: ${err.message}`);
          } else {
            res.write(compressedData);
            res.end();
          }
        });
      }
    });
  } else if (pathname === '/search') {
    const q = query.q;
    const url = `http://www.google.com/search?q=${q}`;
    request(url, (error, response, body) => {
      if (error) {
        res.statusCode = 500;
        res.end(`Error: ${error.message}`);
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Encoding', 'gzip');
        zlib.gzip(body, (err, compressedData) => {
          if (err) {
            res.statusCode = 500;
            res.end(`Error: ${err.message}`);
          } else {
            res.write(compressedData);
            res.end();
          }
        });
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});


server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

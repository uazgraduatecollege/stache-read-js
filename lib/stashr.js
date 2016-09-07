
var http = require('http');
var https = require('https');
var statusCodes = http.STATUS_CODES;
var url = require('url');
var timeout = 30000; // milliseconds
var handler;

function read(address) {
  var time = Date.now();
  var urlProperties = url.parse(address);
  urlProperties.method = 'GET';
  urlProperties.headers = {
    'User-Agent': "UAGC StashR"
  };

  if (urlProperties.protocol === 'http:') {
    handler = http;
  }

  if (urlProperties.protocol === 'https:') {
    handler = https;
  }

  var req =
    handler.request(urlProperties, (res) => {
      return res;
    })
    .on('error', (err) => {
      return err;
    });

  req.on('socket', (socket) => {
    socket.setTimeout(5000);
    socket.on('timeout', () => {
      req.abort();
    });
  });

  req.end();
}

module.exports = stashr;

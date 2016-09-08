var http = require('http');
var https = require('https');
var url = require('url');

function StacheR (server, client) {
  this.server = {};
  this.server.protocol = server.protocol || 'https';
  this.server.domain = server.domain || null,
  this.server.port = server.port || '443',
  this.server.path = server.path || '/api/v1/item/read/';

  this.client = {};
  this.client.method = 'GET';
  this.client.userAgent = client.userAgent || "UA Graduate College StacheR(ead)";
}

StacheR.prototype.get = function get (item, key, cb) {

  // assemble the URL from this.server
  var stacheUrl = `${this.server.protocol}:\/\/${this.server.domain}:` +
    `${this.server.port}${this.server.path}${item}`;

  // create a full URL properties object & add our headers
  var urlProperties = url.parse(stacheUrl);
  urlProperties.method = this.client.method;
  urlProperties.headers = {
    'User-Agent': this.client.userAgent,
    'X-STACHE-READ-KEY': key
  };

  // in production, we'll always use https, but
  // testing we should be able to handle http
  var handler;
  if (urlProperties.protocol === 'http:') {
    handler = http;
  }
  if (urlProperties.protocol === 'https:') {
    handler = https;
  }

  handler.get(urlProperties, (res) => {
    res.setEncoding('utf8');

    var body = '';
    res.on('data', (d) => {
      body += d;
    });

    res.on('end', () => {
      var statusCode = res.statusCode;
      var statusMsg = res.statusMessage;

      switch (statusCode) {
        case 200:
          try {
            var parsed = JSON.parse(body);
          } catch (err) {
            return cb(err);
          }
          break;

        // by default, return an error using the
        // response code & the server's message
        default:
          return cb(new Error(`statusCode: ${statusCode}, msg: ${body}`));
          break;
      }

      cb(null, parsed);
    });

  }).on('error', function (err) {
    cb(err);
  });
}

module.exports = StacheR;


var ping = require('./lib/stashr');
var urlUtil = require('url');
var url = process.argv[2];

if (typeof url !== 'undefined') {
  var urlProperties = urlUtil.parse(url);
  if (urlProperties.protocol !== null) {
    stashr.read(url);
  } else {
    console.log("\nError: you must provide a valid URL\n");
  }
}

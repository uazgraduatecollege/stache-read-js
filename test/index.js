var expect = require("chai").expect;
var StacheR = require("../index");
var testapp = require("express")();

var mystache = new StacheR({
  protocol: 'http',
  domain: 'localhost',
  port: 3000,
  path: '/item/'
}, {});

var itemNumber = 1234;
var itemKey = 'a0297d708e';

describe("StacheR client", () => {
  var testserver;

  // mockup Stache responses
  var goodResponse = "{\"nickname\":\"pb-test-stache-api\",\"purpose\":\"\",\"secret\":\"{ 'mykey':'r&3yEFrcNY3ir', 'mysecret':'6mwUgAENPuqgeFWwOH1+cVAl7OEOnGVV', 'mysong':'Yo ho ho and a bottle of rum' }\",\"memo\":\"\"";
  var invalidIdResponse = '<html> <head> <title>403 error</title> </head> <body> <pre>Invalid item ID</pre> </body> </html>';
  var unauthorizedResponse = '<html> <head> <title>403 error</title> </head> <body> <pre>Invalid API key</pre> </body> </html>';
  var errorResponse = '<html> <head> <title>500 error</title> </head> <body> <pre>Unable to access the stored item</pre> </body> </html>';

  before((done) => {
    testapp.get("/item", (req, res) => {
      res
      .status(403)
      .send(invalidIdResponse);
    });

    testapp.get("/item/:id", (req, res) => {
      var requestedItem = req.params.id;
      var requestedKey = req.get('X-STACHE-READ-KEY');
      if (requestedItem == itemNumber && requestedKey != itemKey) {
        res
        .status(403)
        .send(unauthorizedResponse);
      }
      if (requestedItem != itemNumber && requestedKey == itemKey) {
        res
        .status(500)
        .send(errorResponse);
      }
      if (requestedItem == itemNumber && requestedKey == itemKey) {
        res.json(goodResponse);
      }
    });

    testserver = testapp.listen(3000, () => {
      done();
    });
  });

  after((done) => {
    testserver.close(() => {
      done();
    });
  });

  describe("Verify test server", () => {
    it("does not error and has a response", () => {
      mystache.get(itemNumber, itemKey, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.be.ok;
      });
    });
  });

  describe("Request an item correctly", () => {
    it("should return an object with known Stache properties", () => {
      mystache.get(itemNumber, itemKey, (error, response) => {
console.log('ACK!! `body` and `response.statusCode` are undefined, so why does this test not fail?');
        expect(error).to.be.null;
        expect(response.statusCode.to.equal(200));
        expect(body.to.be.ok);
        expect(body.to.have.property('nickname'));
        expect(body.to.have.property('purpose'));
        expect(body.to.have.property('secret'));
        expect(body.to.have.property('memo'));
      })
    });
  });

  describe("Request an item without an item number", () => {
    it("should gracefully handle an unauthorized error 403", () => {
      mystache.get(null, itemKey, (error, response) => {
        expect(error.to.have.property('msg'));
        expect(error.to.have.property('statusCode'));
        expect(error.statusCode.to.equal(403));
      });
    });
  });

  describe("Request an item that does not match the key", () => {
    it("should gracefully handle a server error 500", () => {
      mystache.get(12345, itemKey, (error, response) => {
        expect(error.to.have.property('msg'));
        expect(error.to.have.property('statusCode'));
        expect(error.statusCode.to.equal(500));
      });
    });
  });

  describe("Request an item using a bad key", () => {
    it("should gracefully handle an unauthorized error 403", () => {
      mystache.get(itemNumber, 'abcdefg', (error, response) => {
        expect(error.to.have.property('msg'));
        expect(error.to.have.property('statusCode'));
        expect(error.statusCode.to.equal(403));
      });
    });
  });
});

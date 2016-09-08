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

  // mockup a Stache server w/typical responses
  var testserver;
  var goodResponse = {
    nickname: "arthur-king-of-britons",
    purpose: "To seek the Grail",
    secret: "{ swallows: 'can carry coconuts', whatfloats: 'witches', camelot: 'a silly place', enchanter: 'some call him... Tim?', princess: 'has huge tracks of land', lancelot: 'heroic in his own particular idiom', robin: 'bravely runs away' }",
    memo: "Strange women lying in ponds distributing swords is no basis for a system of government."
  };
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
    it("does not error and has a response", (done) => {
      mystache.get(itemNumber, itemKey, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.be.ok;
        done();
      });
    });
  });

  describe("Request an item correctly", () => {
    it("should return an object with known Stache properties", (done) => {
      mystache.get(itemNumber, itemKey, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.be.ok;
        expect(response).to.have.property('nickname');
        expect(response).to.have.property('purpose');
        expect(response).to.have.property('secret');
        expect(response).to.have.property('memo');
        done();
      })
    });
  });

  describe("Request an item without an item number", () => {
    it("should gracefully handle an unauthorized error 403", (done) => {
      mystache.get(null, itemKey, (error, response) => {
        expect(error).to.be.an('error');
        done();
      });
    });
  });

  describe("Request an item that does not match the key", () => {
    it("should gracefully handle a server error 500", (done) => {
      mystache.get(12345, itemKey, (error, response) => {
        expect(error).to.be.an('error');
        done();
      });
    });
  });

  describe("Request an item using a bad key", () => {
    it("should gracefully handle an unauthorized error 403", (done) => {
      mystache.get(itemNumber, 'abcdefg', (error, response) => {
        expect(error).to.be.an('error');
        done();
      });
    });
  });
});

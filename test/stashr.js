var expect = require("chai").expect;
var ping = require("../lib/stashr");
var testapp = require("express")();
var testserver;

describe("StashR client", () => {
  // a URL known to be good
  var goodUrl = "http://localhost:3000/hello";

  // a URL known to be bad
  var badUrl = "http://localhoist:3000/hello";

  // a URL known to be inaccessible
  var downUrl = "http://gcwebproj01.grad.arizona.edu/";

  beforeEach((done) => {
    testapp.get("/hello", (req, res) => {
      res.send("Hello, world.")
    });
    testserver = testapp.listen(3000, () => {
      done();
    });
  });

  afterEach((done) => {
    testserver.close(() => {
      done();
    });
  });

  describe("Check test server", () => {
    it("test server returns status 200", () => {
      ping(goodUrl, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  describe("Ping a good URL", () => {
    it("has an HTTP status", () => {
      ping(goodUrl, (error, response, body) => {
        expect(response.statusCode.to.be.ok);
      })
    });
  });

  describe("Ping a known-bad URL", () => {
    it("should result in an error", () => {
      ping(badUrl, (error, response, body) => {
        expect(error.to.exist);
      });
    });
  });

  describe("Ping an inaccessible URL", () => {
    it("should result in an error", () => {
      ping(downUrl, (error, response, body) => {
        expect(error.to.exist);
      });
    });
  });
});

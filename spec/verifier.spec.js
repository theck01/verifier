var verifier = require("../verifier");
var should = require("should");

describe("verifier", function () {

  describe("verifier.validate", function () {

    context("when object matches template", function () {
      it("should return object", function () {

        verifier.validate(function () { return {}; }, "function");

        verifier.validate({ one: 1, two: "hello", three: null, four: [1,2,3]},
                          { one: "number", two: "string",
                            three: null, four: ["number"] }).should.be.ok;

        verifier.validate(
          { x: null, y: undefined, z: 1 },
          { x: null, y: "undefined", z: "number" }
        ).should.be.ok;

        verifier.validate({
            pixels: [ { x: 1, y: 2, color: "#FFFFFF" },
                      { x: 1, y: 3, color: "#000000" } ],
            center: { x: 1, y: 2 }
          },
          {
            pixels: [ { x: "number", y: "number", color: "string" } ],
            center: { x: "number", y: "number" }
          }
        ).should.be.ok;

        verifier.validate({
            pixels: [ { x: 1, y: 2, color: "#FFFFFF" },
                      { x: 1, y: 3, z: 4, color: "#000000" },
                      { x: 1, y: 4, z: 5, color: "#FFFFFF" } ],
            center: { x: 1, y: 2 }
          },
          {
            pixels: [ { x: "number", y: "number", color: "string" },
                      { x: "number", y: "number", z: "number", 
                        color: "string" }],
            center: { x: "number", y: "number" }
          }
        ).should.be.ok;

        verifier.validate({
            pixels: [], center: { x: 1, y: 2 }
          },
          {
            pixels: [ { x: "number", y: "number", color: "string" } ],
            center: { x: "number", y: "number" }
          }
        ).should.be.ok;
      });
    });

    context("when object does not match template", function () {
      it("should return null", function () {
        should.not.exist(
          verifier.validate({ one: 1, two: "hello", three: null, four: [1,2,3]},
                            { one: "number", two: "string",
                              three: null, four: "number" })
        );

        should.not.exist(
          verifier.validate({ one: 1, two: "hello", three: null, four: [1,2,3]},
                            { one: "string", two: "string",
                              three: null, four: ["number"] })
        );

        should.not.exist(
          verifier.validate({ one: 1, two: "hello", three: null, four: [1,2,3]},
                            [{ one: "number", two: "string",
                               three: null, four: ["number"] }]));

        should.not.exist(
          verifier.validate({
              pixels: [ { x: 1, y: 2, color: "#FFFFFF" },
                        { sql: "destroy", x: 1, y: 3, color: "#000000" } ],
              center: { x: 1, y: 2 }
            },
            {
              pixels: [ { x: "number", y: "number", color: "string" } ],
              center: { x: "number", y: "number" }
            }
          )
        );
        
        should.not.exist(
          verifier.validate({
              pixels: [ { x: 1, y: 2, color: "#FFFFFF" },
                        { x: 1, y: 3, z: 4, color: "#000000" } ],
              center: { x: 1, y: 2 }
            },
            {
              pixels: [ { x: "number", y: "number", color: "string" },
                        { x: "number", y: "number", z: "number" }],
              center: { x: "number", y: "number" }
            }
          )
        );
      });

      it("should call the error function", function () {
        var calledMismatch = false;

        verifier.validate("I will fail", 1, function (msg) {
          var expectedMsg = '"I will fail" does not match template \'1\'';
          msg.should.eql(expectedMsg);
          calledMismatch = true;
        });

        calledMismatch.should.be.true;
      });
    });
  });

  describe("verifier.template", function () {

    it("should create valid templates from existing structures", 
      function (done) {
        var template = verifier.template([
          1,2,"hello", { a: null, b: undefined }
        ]);
        template.should.eql([
          "number", "string", { a: null, b: "undefined" }
        ]);

        var template = verifier.template({
          one: 1, two: "hello", three: [1,2,3,"four", function () { return 6; }]
        });
        template.should.eql({
          one: "number", two: "string", three: [ "number", "string", "function"]  
        });

        done();
      }
    );
  });
});

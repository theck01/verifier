verifier
=============

A validation function to ensure that javascript data structures match a template structure, and a template function to generate template structures from example data.

Why use verifier?
-----------------

Validating JSON data sent from the client is a painful task to do by hand. Rather than manually checking that fields exist with proper values, wouldn't it be nice to specify a template data structure to validate incoming data against? And wouldn't it be great if that template structure could be generated automatically from example data? **verifier** takes care of data structure validations and can create template structures given example data.

Lets see a quick example before I install this thing
----------------------------------------------------

    var verifier = require('verifier');

    var testObject = { 
      one: 1, 
      two: ["a","b"], 
      three: { a:1, b: undefined } 
    } 

    // create a template for the data to match by hand
    var template = {
      one: "number",
      two: ["string"],
      three: { a: "number", b: "undefined" }
    }

    // returns the object, after being successfully validated with the template
    verifier.validate(testObject, template);

    // create another template for the data to match.
    // Notice that the "two" field should now have a value "string", rather than
    // an array of strings
    var anotherTemplate = {
      one: "number",
      two: "string",
      three: { a: "number", b: "undefined" }
    }

    // returns null, after validation with the template fails
    verifier.validate(testObject, anotherTemplate);

    var anotherTestObject = [ 1, 2, 3, "four", function () { return 5; } ];

    // generate a template for the data
    var yetAnotherTemplateObject = verifier.template(anotherTestObject)

    // returns anotherTestObject, of course data should match its own template
    verifier.validate(anotherTestObject, yetAnotherTemplate);

    var yetAnotherTestObject = [ { a: 'b'}, 1, 2, "four" } ];

    
    // returns null, the template will not match {a: 'b'} in yetAnotherTestObject
    verifier.validate(yetAnotherTestObject, yetAnotherTemplate);

Alright, looks good, how do I install?
--------------------------------------

Install **verifier** using npm, either on the command line:

    npm install verifier

Or by adding "verifier" to your package.json file.

Now that I've got it, how do I use it?
--------------------------------------

The most common use case is to create a sample object, array, etc, and then use the template function to create a template structure. That template structure can be used to validate that other data is in the same format as the example data.

    var verifier = require("verifier");

    var exampleData = ...;
    var template = verifier.template(exampleData);

    var testData = ...;

    if(verifier.validate(testData, template)) {
      // do some stuff with testData because it has the desired structure
    }
    else {
      // do some other stuff with testData because it does not match the desired
      // structure
    }

The created template matches against the structure and type of the data, but not the specific values.

    // A template created from any one of the following would match the others
    { x: 1, y: 2, move: function () { ... }, colors: [ "#0000FF", "#FF0000" ] }
    { x: 1000, y: 0.33, move: function () { ... }, colors: [ "#00FFFF" ] }
    { x: -10, y: 33/2, move: function () { ... }, colors: [ "#0000FF", "foo", "bar", "baz" ] }

    // A template generated from any of the above would not match against any of the below
    { x: 1, y: 2, move: {}, colors ["#0000FF", "#FF0000"] }; // move should be a function
    { x: 1, y: 2, colors ["#0000FF", "#FF0000"] }; // move fields is not present
    // extra field z is present
    { x: 1, y: 2, z: 4, move: function () { ... }, colors: [ "#0000FF", "#FF0000" ] }

To best understand what data will match what template, it is worth reading the section on how to create template structures by hand.

How do I create one of these templates by hand?
-----------------------------------------------

Lets say you want to make a template to check against for some data, x. There are a few rules for making template structures, use the first that matches the data you are trying to create a template for:

#### If _typeof x !== "object"_

The template is just _typeof x_
    
Example:

    var x = "hello";
    var template = "string";

#### If _x === null_

The template is just null

Example:

    var x = null;
    var template = null;

#### If _!(x instanceof Array)_, a javascript object

The template is an object that has the same fields as the x. The values of the template at each field should be found by applying these rules to each value.

Examples:

    var x = { one: 1, two: "two", three: null };
    var template = { one: "number", two: "string", three: null };

    var anotherX = { 
      a: undefined, 
      b: true,  
      c: { x: 1, y: 2 } 
    };
    var anotherTemplate = {
      a: "undefined",
      b: "boolean",
      c: { x: "number", y: "number" }
    };

#### If _x instanceof Array_

The template object is an array of structures that match all elements in x. Any duplicate structures do not need to be kept in the final template.

Examples:

    // the template for each item in x is "number", so the template for x is ["number']
    var x = [1,2,3,4];
    var template = ["number"];

    // there are two templates that match items in anotherX include both in another template 
    // Notice { x: "number", y: "number" } only has to appear in the template once
    var anotherX = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6, z: 12}
    ];
    var anotherTemplate = [{ x: "number", y: "number" }, 
                           { x: "number", y: "number", z: "number" }];

This is helpful, but its missing...
-----------------------------------

Submit an issue. Or even better a pull request.

Here's a list of known shortcomings:

1. There is no way to create a template that matches one of many structures (null and a string for example)

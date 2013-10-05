var _ = require("underscore");

var primitives = ["string", "number", "boolean", "undefined", "function"];


function ObjectTemplateMismatch(obj, template) {
  this.value = obj;
  this.message = " does not match template '" + JSON.stringify(template) + "'";
  this.toString = function () {
    return JSON.stringify(this.value) + this.message;
  };
}


function hasOnly (obj, propList) {
  var retval = _.reduce(propList, function (memo, prop) {
    return memo && _.has(obj, prop);
  }, true);

  if(retval && _.keys(obj).length === propList.length) return true;
  return false;
};


function template(obj) {

  var temp;

  // base case, check to see if object is a primitive
  if(_.indexOf(primitives, typeof obj) >= 0){
    return typeof obj;
  }

  // if obj is null, return null;
  if(!obj) return null;

  // if object is an array, return an array of unique templates to match all
  // possible elements in the array
  if(obj instanceof Array){
    debugger;
    return _.uniq(_.map(obj, template));
  }


  // object must be a javascript object
  temp = {};
  _.each(obj, function (v,k) {
    temp[k] =  template(v);
  });

  return temp;
}

// export the template function
exports.template = template;


function validateRec(obj, template) {
  
  // base case, check to see if object is a primitive
  if(_.indexOf(primitives, typeof obj) >= 0){
    if((typeof obj) === template) return;
    throw new ObjectTemplateMismatch(obj, template);
  }

  // check if obj equals template exactly, if so return
  if(_.isEqual(obj, template)) return;

  // check if obj is an array, if so match each element to the template
  if(obj instanceof Array){
    if(template instanceof Array){
      // find the first template that matches each element in obj. if no
      // template matches, either throw or drop element
      _.each(obj, function (e) {
        var match = _.find(template, function (t) {
          return validate(e,t) !== null;
        });
        if(match === undefined) throw new ObjectTemplateMismatch(obj, template);
      })

      return;
    }
    throw new ObjectTemplateMismatch(obj, template);
  }

  // object is a true javascript object, check against template
  if(!hasOnly(obj, _.keys(template)))
    throw new ObjectTemplateMismatch(obj, template);

  _.each(obj, function(v,k) {
    validateRec(v, template[k]);
  });
  
  return;
}

// wrapper around validateRec, catching thrown ObjectTemplateMismatchs
function validate(obj, template) {
  try{
    validateRec(obj, template);
  }
  catch (e) {
    if(e instanceof ObjectTemplateMismatch){
      return null;
    }
    throw e; // rethrow exception
  }

  return obj;
};

// export the validate function
exports.validate = validate;

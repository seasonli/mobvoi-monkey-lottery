// safeCall
var zepto = require('zepto');

module.exports = function(fun, args, thisArg) {
  'use strict';    // Use strict mode to ensure that function will not be called on global 'window' object when 'thisArg' was omitted.

  if (fun && $.type(fun) == 'function') {
    return fun.apply($.type(thisArg) == 'object' ? thisArg : null, args !== undefined ? [].concat(args) : []);
  }
};
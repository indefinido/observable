var chai, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

root.observable = require('observable');

root.sinon = require('observable/vendor/spec/sinon.js');

if (Object.defineProperty) {
  chai = require('chaijs-chai');
  root.should = chai.should();
}

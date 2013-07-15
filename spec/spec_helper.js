var chai, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

chai = require('chaijs-chai');

root.should = chai.should();

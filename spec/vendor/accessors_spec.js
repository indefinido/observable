var $;

require('observable/vendor/shims/accessors.js');

$ = require('jquery');

describe('Object #defineProperty', function() {
  return describe('on dom elements', function() {
    var object, spy;

    spy = object = null;
    beforeEach(function() {
      object = document.createElement('domo');
      document.body.appendChild(object);
      return spy = sinon.spy();
    });
    it('should define property', function(done) {
      return Object.defineProperty(object, 'kun', {});
    });
    it('should define property getter', function(done) {
      var getter;

      getter = sinon.stub().returns(42);
      Object.defineProperty(object, 'kun', {
        get: getter
      });
      expect(object.kun + 1).toBe(43);
      return expect(getter.called).toBe(true);
    });
    return it('should define property setter', function(done) {
      Object.defineProperty(object, 'kun', {
        set: spy
      });
      object.kun = 10;
      return expect(spy.calledWith(10)).toBe(true);
    });
  });
});

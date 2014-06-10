var Platform;

Platform = require("observable/vendor/observe-js/observe.js").Platform;

describe('rivets adapter', function() {
  before(function() {
    var _this = this;

    this.adapter = require('observable/lib/adapters/rivets.js');
    return this.wait = function(callback, time) {
      if (time == null) {
        time = 800;
      }
      return setTimeout(callback, time);
    };
  });
  beforeEach(function() {
    this.subobject = {
      subproperty: 'subvalue'
    };
    this.object = observable({
      property: 'value',
      subobject: this.subobject
    });
    return this.spy = sinon.spy();
  });
  xdescribe('#subscribe', function() {});
  xdescribe('#unsubscribe', function() {});
  describe('#read', function() {
    it('should return values for keys', function() {
      this.object.subscribe('property', this.spy);
      this.adapter.read(this.object, 'property').should.be.eq('value');
      return this.spy.called.should.be["false"];
    });
    it('should return values for keypaths', function() {
      this.object.subscribe('subobject.subproperty', this.spy);
      this.adapter.read(this.object, 'subobject.subproperty').should.be.eq('subvalue');
      return this.spy.called.should.be["false"];
    });
    return xit('should throw error for unobserved properties');
  });
  return describe('#publish', function() {
    it('should change values for keys', function(done) {
      var _this = this;

      this.object.subscribe('property', function() {
        _this.object.should.have.property('property', 'another_value');
        return done();
      });
      return this.adapter.publish(this.object, 'property', 'another_value');
    });
    it('should change values for keypaths', function(done) {
      var _this = this;

      this.object.subscribe('subobject.subproperty', function() {
        _this.object.subobject.should.have.property('subproperty', 'another_subvalue');
        return done();
      });
      return this.adapter.publish(this.object, 'subobject.subproperty', 'another_subvalue');
    });
    return xit('should throw error for unobserved properties');
  });
});

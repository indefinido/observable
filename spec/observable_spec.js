var Platform, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

Platform = require("observable/vendor/observe-js/observe.js").Platform;

describe('observable #()', function() {
  if (!root.should) {
    return;
  }
  before(function() {
    var _this = this;

    return this.wait = function(callback, time) {
      if (time == null) {
        time = 800;
      }
      return setTimeout(callback, time);
    };
  });
  beforeEach(function() {
    return this.object = {
      property: 'value'
    };
  });
  it('should create a observation property', function() {
    this.object.should.not.have.property('observation');
    this.object = observable(this.object);
    return this.object.should.have.property('observation');
  });
  it('should create a observed property', function() {
    this.object.should.not.have.property('observed');
    this.object = observable(this.object);
    return this.object.should.have.property('observed');
  });
  describe('#subscribe', function() {
    beforeEach(function() {
      this.object = observable({
        property: 'value'
      });
      return this.spy = sinon.spy();
    });
    it('should throw error with wrong parameters type', function() {
      expect(function() {
        return this.object.subscribe();
      }).to["throw"](Error);
      return expect(function() {
        return this.object.subscribe('asdas');
      }).to["throw"](Error);
    });
    it('should schedule object observers check', function(done) {
      this.object.subscribe('property', function() {
        return done();
      });
      return this.object.property = 'mafagafo';
    });
    describe('when key', function() {
      it('should subscribe preserve the current property value', function() {
        this.object.should.have.property('property', 'value');
        this.object.subscribe('property', this.spy);
        this.object.should.have.property('property', 'value');
        return this.spy.called.should.be["false"];
      });
      it('should subscribe to property', function(done) {
        this.object.subscribe('property', function() {
          return done();
        });
        return this.object.property = 'mafagafoid';
      });
      return it('should let multiple function subscriptions to property', function(done) {
        var _this = this;

        this.object.subscribe('other', this.spy);
        this.object.subscribe('other', function() {
          _this.spy.called.should.be["true"];
          return done();
        });
        return this.object.other = 'mafagafo';
      });
    });
    describe('when object', function() {
      it('should report any changes', function(done) {
        this.object.subscribe(function() {
          return done();
        });
        this.object.domo = 10;
        return Platform.performMicrotaskCheckpoint();
      });
      return it('should schedule changes reporting when known properties are changed', function(done) {
        this.object.subscribe('domo', function() {});
        this.object.subscribe(function() {
          return done();
        });
        return this.object.domo = 10;
      });
    });
    describe('when keypath', function() {
      return it('should subscribe to double keypath', function(done) {
        this.object.property = {
          subproperty: 'subvalue'
        };
        this.object.subscribe('property.subproperty', function() {
          return done();
        });
        this.object.property.subproperty = 'mafagafo';
        return Platform.performMicrotaskCheckpoint();
      });
    });
    return describe('when array', function() {
      xit('should subscribe to property', function(done) {});
      xit('should observe objects added to array', function() {
        var friend;

        friend = {
          id: 1
        };
        this.object.friends = [];
        this.object.subscribe('friends', function() {});
        this.object.friends = [friend];
        this.object.friends[0].should.be.eq(friend);
        friend.should.have.property('observed');
        friend.subscribe('id', this.spy);
        friend.id = 2;
        return this.spy.callCount.should.be.eq(1);
      });
      xit('should override native methods');
      return xit('should preserve array bindings when setting new array', function() {
        this.object.friends = [];
        this.object.subscribe('friends', this.spy);
        this.object.friends.push(1);
        this.object.friends = [];
        this.object.friends.push(2);
        this.object.friends.length.should.be.eq(1);
        return this.spy.callCount.should.be.eq(3);
      });
    });
  });
  xdescribe('#publish', function() {
    return xit('should let element publish to property');
  });
  describe('#unsubscribe', function() {
    beforeEach(function() {
      this.object = observable({});
      return this.spy = sinon.spy();
    });
    xit('should remove self listener', function() {
      this.object.subscribe(this.spy);
      return this.object.unsubscribe(this.spy);
    });
    it('should remove all listeners from property', function(done) {
      var _this = this;

      this.object.subscribe('property', this.spy);
      this.object.unsubscribe('property');
      this.object.property = 'value';
      return this.wait(function() {
        _this.spy.called.should.be["false"];
        return done();
      });
    });
    return it('should remove only the specified listener from queue', function(done) {
      var second_spy,
        _this = this;

      second_spy = sinon.spy();
      this.object.subscribe('property', this.spy);
      this.object.subscribe('property', second_spy);
      this.object.unsubscribe('property', this.spy);
      this.object.property = 'value';
      return this.wait(function() {
        _this.spy.called.should.be["false"];
        second_spy.called.should.be["true"];
        return done();
      });
    });
  });
  return describe('#unobserve', function() {
    beforeEach(function() {
      return this.object = observable({
        property: 'value'
      });
    });
    it('should remove observation methods and properties', function() {
      var method;

      observable.unobserve(this.object);
      for (method in observable.methods) {
        this.object.should.not.have.property(method);
      }
      this.object.should.not.have.property('observation');
      return this.object.should.not.have.property('observed');
    });
    xit('should destroy observers');
    return xit('should remove getters and setters');
  });
});

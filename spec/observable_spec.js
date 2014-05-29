var Platform, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

Platform = require("observable/vendor/observe-js/observe.js").Platform;

describe('observable #()', function() {
  if (!root.should) {
    return;
  }
  beforeEach(function() {
    var _this = this;

    this.object = {
      property: 'value'
    };
    return this.wait = function(callback, time) {
      if (time == null) {
        time = 800;
      }
      return setTimeout(callback, time);
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
        var _this = this;

        this.object.subscribe('property', this.spy);
        this.object.property = 'mafagafoid';
        return this.wait(function() {
          _this.spy.called.should.be["true"];
          return done();
        });
      });
      return it('should let multiple function subscriptions to property', function(done) {
        var second_spy,
          _this = this;

        second_spy = sinon.spy();
        this.object.subscribe('other', this.spy);
        this.object.subscribe('other', second_spy);
        this.object.other = 'mafagafo';
        return this.wait(function() {
          _this.spy.called.should.be["true"];
          second_spy.called.should.be["true"];
          return done();
        });
      });
    });
    describe('when object', function() {
      it('should report any changes', function() {
        var _this = this;

        this.object.subscribe(function() {
          return _this.spy();
        });
        this.object.domo = 10;
        Platform.performMicrotaskCheckpoint();
        return this.spy.called.should.be["true"];
      });
      return it('should schedule changes reporting when know properties are mixed', function(done) {
        var _this = this;

        this.object.subscribe('domo', function() {});
        this.object.subscribe(function() {
          return _this.spy();
        });
        this.object.domo = 10;
        return this.wait(function() {
          _this.spy.called.should.be["true"];
          return done();
        });
      });
    });
    describe('when keypath', function() {
      return it('should subscribe to property', function() {
        var _this = this;

        this.object.property = {
          subproperty: 'subvalue'
        };
        this.object.subscribe('property.subproperty', function() {
          return _this.spy();
        });
        this.object.property.subproperty = 'mafagafo';
        Platform.performMicrotaskCheckpoint();
        return this.spy.called.should.be["true"];
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
  return describe('#unsubscribe', function() {
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
});

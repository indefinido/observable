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
      this.object = observable({});
      return this.spy = sinon.spy();
    });
    it('should schedule object observers check', function(done) {
      this.object.subscribe('other', function() {
        return done();
      });
      return this.object.other = 'mafagafo';
    });
    describe('when key', function() {
      it('should subscribe to property', function(done) {
        var _this = this;

        this.object.subscribe('other', this.spy);
        this.object.other = 'mafagafo';
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
    describe('when keypath', function() {
      return xit('should subscribe to property', function(done) {});
    });
    describe('when array', function() {
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
    return xit('should let element unsubscribe to property', function() {});
  });
  xdescribe('#publish', function() {
    return xit('should let element publish to property');
  });
  return describe('#unsubscribe', function() {
    beforeEach(function() {
      this.object = observable({});
      return this.spy = sinon.spy();
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

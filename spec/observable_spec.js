var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

describe('observable #()', function() {
  if (!root.should) {
    return;
  }
  beforeEach(function() {
    return this.object = {
      property: 'value'
    };
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
    it('should subscribe to property', function() {
      this.object.subscribe('other', this.spy);
      this.object.other = 'mafagafo';
      return this.spy.called.should.be["true"];
    });
    it('should let multiple function subscriptions to property', function() {
      var second_spy;

      second_spy = sinon.spy();
      this.object.subscribe('other', this.spy);
      this.object.subscribe('other', second_spy);
      this.object.other = 'mafagafo';
      this.spy.called.should.be["true"];
      return second_spy.called.should.be["true"];
    });
    describe('subscribes to properties of type array', function() {
      it('should observe objects added to array', function() {
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
      return it('should preserve array bindings when setting new array', function() {
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
    it('should remove all listeners from property', function() {
      this.object.subscribe('property', this.spy);
      this.object.unsubscribe('property');
      this.object.property = 'value';
      return this.spy.called.should.be["false"];
    });
    return it('should remove only the specified listener from queue', function() {
      var second_spy;

      second_spy = sinon.spy();
      this.object.subscribe('property', this.spy);
      this.object.subscribe('property', second_spy);
      this.object.unsubscribe('property', this.spy);
      this.object.property = 'value';
      this.spy.called.should.be["false"];
      return second_spy.called.should.be["true"];
    });
  });
});

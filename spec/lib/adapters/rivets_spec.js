describe('rivets adapter', function() {
  before(function() {
    return this.adapter = require('observable/lib/adapters/rivets.js');
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
    it('should return values for keypaths', function() {
      this.object.subscribe('property', this.spy);
      this.adapter.read(this.object, 'property').should.be.eq('value');
      return this.spy.called.should.be["false"];
    });
    it('should return values for long keypaths', function() {
      this.object.subscribe('subobject.subproperty', this.spy);
      this.adapter.read(this.object, 'subobject.subproperty').should.be.eq('subvalue');
      return this.spy.called.should.be["false"];
    });
    return xit('should throw error for unobserved properties');
  });
  return xdescribe('#publish', function() {});
});

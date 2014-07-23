var observationable;

observationable = require('observable/lib/observable/observation.js');

describe("observation", function() {
  beforeEach(function() {
    this.observer = {
      add: sinon.spy(),
      remove: sinon.spy()
    };
    this.listener = sinon.spy();
    this.observation = observationable({});
    return this.observation.observers.property = this.observer;
  });
  return it("should add a callback to the keypath observer", function() {
    this.observation.add('property', this.listener);
    return this.observer.add.called.should.be["true"];
  });
});

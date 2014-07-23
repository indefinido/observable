observationable = require 'observable/lib/observable/observation.js'

describe "observation", ->

    beforeEach ->
      @observer =
        add: sinon.spy()
        remove: sinon.spy()

      @listener = sinon.spy()

      @observation = observationable {}
      @observation.observers.property = @observer

    it "should add a callback to the keypath observer", ->
      @observation.add 'property', @listener
      @observer.add.called.should.be.true


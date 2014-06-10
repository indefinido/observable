# TODO figure out how to require all specs at once, and then move to
# es6 modules and component with the tests
root       = exports ? window
Platform   = require("observable/vendor/observe-js/observe.js").Platform


describe 'observable #()', ->
  return unless root.should

  before ->
    @wait   = (callback, time = 800) => setTimeout callback, time

  beforeEach ->
    @object = property: 'value'

  it 'should create a observation property', ->
    @object.should.not.have.property 'observation'

    @object = observable @object

    @object.should.have.property 'observation'


  it 'should create a observed property', ->
    @object.should.not.have.property 'observed'

    @object = observable @object

    @object.should.have.property 'observed'

  describe '#subscribe', ->

    beforeEach ->
      @object = observable property: 'value'
      @spy    = sinon.spy()

    it 'should throw error with wrong parameters type', ->
      expect(-> @object.subscribe()).to.throw Error
      expect(-> @object.subscribe 'asdas').to.throw Error

    it 'should schedule object observers check', (done) ->
      # Will execute sometime in the future
      @object.subscribe 'property', -> done()

      @object.property = 'mafagafo'

    describe 'when key', ->
      it 'should subscribe preserve the current property value', ->
        @object.should.have.property 'property', 'value'
        @object.subscribe 'property', @spy
        @object.should.have.property 'property', 'value'
        @spy.called.should.be.false

      it 'should subscribe to property', (done) ->
        @object.subscribe 'property', -> done()
        @object.property = 'mafagafoid'

      it 'should let multiple function subscriptions to property', (done) ->
        @object.subscribe 'other', @spy
        @object.subscribe 'other', =>
          @spy.called.should.be.true
          done()

        @object.other = 'mafagafo'

    describe 'when object', ->
      it 'should report any changes', (done) ->
        @object.subscribe -> done()
        @object.domo     = 10

        # Microtask Checkpoint is Mandatory in this case
        Platform.performMicrotaskCheckpoint()

      it 'should schedule changes reporting when known properties are changed', (done) ->
          @object.subscribe 'domo', -> # nothing
          @object.subscribe -> done()
          @object.domo      = 10


    describe 'when keypath', ->
      it 'should subscribe to double keypath', (done) ->
        @object.property = {subproperty: 'subvalue'}
        @object.subscribe 'property.subproperty', -> done()

        # TODO implement scheduler for long keypaths
        @object.property.subproperty = 'mafagafo'

        Platform.performMicrotaskCheckpoint()

    # TODO wait for rivets to implement array observer
    describe 'when array', ->
      xit 'should subscribe to property', (done) ->

      xit 'should observe objects added to array', ->
        friend = {id: 1}

        # TODO implement a one time setter to solve this
        # Specifically on array types
        # property must be an array before subscribing
        @object.friends = []

        # Remember, you must subscribe to new properties to
        # turn then into observable ones
        @object.subscribe 'friends', ->

        @object.friends = [friend]

        @object.friends[0].should.be.eq friend
        friend.should.have.property 'observed'

        friend.subscribe 'id', @spy
        friend.id = 2
        @spy.callCount.should.be.eq 1

      xit 'should override native methods'
      xit 'should preserve array bindings when setting new array', ->
        @object.friends = []
        @object.subscribe 'friends', @spy

        @object.friends.push 1
        @object.friends = []
        @object.friends.push 2

        @object.friends.length.should.be.eq 1
        @spy.callCount.should.be.eq 3


  xdescribe '#publish', ->

    xit 'should let element publish to property'

  describe '#unsubscribe', ->

    beforeEach ->
      @object = observable {}
      @spy    = sinon.spy()

    # TODO implement self listener unsubscription
    xit 'should remove self listener', ->
      @object.subscribe @spy
      @object.unsubscribe @spy

    it 'should remove all listeners from property', (done) ->
      @object.subscribe 'property', @spy
      @object.unsubscribe 'property'

      @object.property = 'value'

      @wait =>
        @spy.called.should.be.false
        done()

    it 'should remove only the specified listener from queue', (done) ->
      second_spy = sinon.spy()
      @object.subscribe 'property'  , @spy
      @object.subscribe 'property'  , second_spy

      @object.unsubscribe 'property', @spy

      @object.property = 'value'

      @wait =>
        @spy.called.should.be.false
        second_spy.called.should.be.true
        done()

  describe '#unobserve', ->
    beforeEach ->
      @object = observable property: 'value'

    it 'should remove observation methods and properties', ->
      observable.unobserve @object

      for method of observable.methods
        @object.should.not.have.property method

      @object.should.not.have.property 'observation'
      @object.should.not.have.property 'observed'

    xit 'should destroy observers'
    xit 'should remove getters and setters'

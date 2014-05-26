# TODO figure out how to require all specs at once, and then move to
# es6 modules and component with the tests
root       = exports ? window
Platform   = require("observable/vendor/observe-js/observe.js").Platform


describe 'observable #()', ->
  return unless root.should

  beforeEach ->
    @object = property: 'value'
    @wait   = (callback, time = 800) => setTimeout callback, time


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
      @object = observable {}
      @spy    = sinon.spy()

    it 'should throw error with wrong parameters type', ->
      expect(-> @object.subscribe()).to.throw Error
      expect(-> @object.subscribe 'asdas').to.throw Error

    it 'should schedule object observers check', (done) ->
      # Will execute sometime in the future
      @object.subscribe 'other', -> done()

      @object.other = 'mafagafo'

    describe 'when key', ->
      it 'should subscribe to property', (done) ->
        @object.subscribe 'other', @spy

        @object.other = 'mafagafo'

        @wait =>
          @spy.called.should.be.true
          done()

      it 'should let multiple function subscriptions to property', (done) ->
        second_spy = sinon.spy()

        @object.subscribe 'other', @spy
        @object.subscribe 'other', second_spy

        @object.other = 'mafagafo'

        @wait =>
          @spy.called.should.be.true
          second_spy.called.should.be.true
          done()

    describe 'when object', ->
      it 'should report any changes', ->
        @object.subscribe => @spy()
        @object.domo = 10

        Platform.performMicrotaskCheckpoint()

        @spy.called.should.be.true

      it 'should schedule changes reporting when know properties are mixed', (done) ->
        @object.subscribe 'domo', ->
        @object.subscribe => @spy()
        @object.domo = 10

        @wait =>
          @spy.called.should.be.true
          done()


    describe 'when keypath', ->
      xit 'should subscribe to property', (done) ->

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

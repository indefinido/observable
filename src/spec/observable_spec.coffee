# TODO figure out how to require all specs at once, and then move to
# es6 modules and component with the tests
root       = exports ? window

describe 'observable #()',  ->
  return unless root.should

  beforeEach ->
    @object = property: 'value'

  it 'should create a observed property', ->
    @object.should.not.have.property 'observed'

    @object = observable @object

    @object.should.have.property 'observed'

  describe '#subscribe', ->

    beforeEach ->
      @object = observable {}
      @spy    = sinon.spy()

    it 'should subscribe to property', ->
      @object.subscribe 'other', @spy

      @object.other = 'mafagafo'
      @spy.called.should.be.true

    it 'should let multiple function subscriptions to property', ->
      second_spy = sinon.spy()

      @object.subscribe 'other', @spy
      @object.subscribe 'other', second_spy

      @object.other = 'mafagafo'

      @spy.called.should.be.true
      second_spy.called.should.be.true

    describe 'subscribes to properties of type array', ->

      it 'should observe objects added to array', ->
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
      it 'should preserve array bindings when setting new array', ->
        @object.friends = []
        @object.subscribe 'friends', @spy

        @object.friends.push 1
        @object.friends = []
        @object.friends.push 2

        @object.friends.length.should.be.eq 1
        @spy.callCount.should.be.eq 3

    xit 'should let element unsubscribe to property', ->


  xdescribe '#publish', ->

    xit 'should let element publish to property'

  describe '#unsubscribe', ->

    beforeEach ->
      @object = observable {}
      @spy    = sinon.spy()

    it 'should remove all listeners from property', ->
      @object.subscribe 'property', @spy
      @object.unsubscribe 'property'

      @object.property = 'value'

      @spy.called.should.be.false

    it 'should remove only the specified listener from queue', ->
      second_spy = sinon.spy()
      @object.subscribe 'property'  , @spy
      @object.subscribe 'property'  , second_spy

      @object.unsubscribe 'property', @spy

      @object.property = 'value'

      @spy.called.should.be.false
      second_spy.called.should.be.true

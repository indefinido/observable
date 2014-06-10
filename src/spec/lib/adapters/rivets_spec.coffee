
describe 'rivets adapter', ->

  before ->
    @adapter = require 'observable/lib/adapters/rivets.js'

  beforeEach ->
    @subobject = subproperty: 'subvalue'
    @object    = observable property: 'value', subobject: @subobject
    @spy       = sinon.spy()

  xdescribe '#subscribe', ->

  xdescribe '#unsubscribe', ->
  describe '#read', ->

    it 'should return values for keypaths', ->
      @object.subscribe 'property', @spy
      @adapter.read(@object, 'property').should.be.eq 'value'
      @spy.called.should.be.false

    it 'should return values for long keypaths', ->
      @object.subscribe 'subobject.subproperty', @spy
      @adapter.read(@object, 'subobject.subproperty').should.be.eq 'subvalue'
      @spy.called.should.be.false

    xit 'should throw error for unobserved properties'

  xdescribe '#publish', ->

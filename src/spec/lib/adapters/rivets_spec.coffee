
Platform   = require("observable/vendor/observe-js/observe.js").Platform

describe 'rivets adapter', ->

  before ->
    @adapter = require 'observable/lib/adapters/rivets.js'
    @wait    = (callback, time = 800) => setTimeout callback, time

  beforeEach ->
    @subobject = subproperty: 'subvalue'
    @object    = observable property: 'value', subobject: @subobject
    @spy       = sinon.spy()

  xdescribe '#subscribe', ->

  xdescribe '#unsubscribe', ->
  describe '#read', ->

    it 'should return values for keys', ->
      @object.subscribe 'property', @spy
      @adapter.read(@object, 'property').should.be.eq 'value'
      @spy.called.should.be.false

    it 'should return values for keypaths', ->
      @object.subscribe 'subobject.subproperty', @spy
      @adapter.read(@object, 'subobject.subproperty').should.be.eq 'subvalue'
      @spy.called.should.be.false

    xit 'should throw error for unobserved properties'

  describe '#publish', ->
    it 'should change values for keys', (done) ->
      @object.subscribe 'property', =>
        @object.should.have.property 'property', 'another_value'
        done()

      @adapter.publish @object, 'property', 'another_value'

    it 'should change values for keypaths', (done) ->
      @object.subscribe 'subobject.subproperty', =>
        @object.subobject.should.have.property 'subproperty', 'another_subvalue'
        done()

      @adapter.publish @object, 'subobject.subproperty', 'another_subvalue'


    xit 'should throw error for unobserved properties'

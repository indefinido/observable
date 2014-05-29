# TODO transform look up into getOwnPropertyDescriptor Shim
`import lookup from '../lookup.js'`
`import jQuery from 'jquery'`

scheduler = (options = {}) ->
  timeout = null

  # Convert options to descriptors
  options[name] = value: value for name, value of options

  jQuery.extend options,
    keypaths: value: []
    schedule: value: ->
      deliver = => @deliver()
      clearTimeout timeout
      timeout = setTimeout deliver, 500 or options.wait

  Object.create scheduler.methods, options


jQuery.extend scheduler,
  methods:
    # TODO pass object as parameter
    property: (object, keypath) ->
      return unless @keypaths.indexOf(keypath) == -1
      @keypaths.push keypath
      {observation: {observers}} = object
      observer = observers[keypath]

      # Store current property value
      value = observer.path_.getValueFrom object

      # Transform property into observable
      Object.defineProperty object, keypath,
        get: @getter object, keypath
        set: @setter object, keypath
        enumerable: true
        configurable: true

      # Only update current value if the getter and setter definitions
      # changed it
      observer.setValue value unless value == observer.path_.getValueFrom object

    deliver   : ->
      observer.deliver() for keypath, observer of @target.observation.observers
      true

    setter: (object, keypath, callback) ->
      current_setter = lookup.setter.call object, keypath

      if current_setter
        (value) ->
          current_setter.call @, value

          @observed[keypath] = value
          @observation.scheduler.schedule()

      else
        (value) ->
          @observed[keypath] = value
          @observation.scheduler.schedule()

    getter: (object, keypath) ->
      lookup.getter.call(object, keypath) or root_getter = -> @observed[keypath]

    destroy: ->
      @target = null

schedulerable = (observable) ->
  # TODO use this property when shimming Object.observe, and when it
  # gets removed in the next version
  #
  # Object.defineProperty object, "observed",
  #   configurable: true
  #   enumerable: false
  #   value: {}

  original = observable.methods.subscribe
  # TODO allow multiple callbacks as arguments on the api
  observable.methods.subscribe = (keypath, callback)->
    original.apply @, arguments
    @observation.scheduler.property @, keypath unless typeof keypath == 'function'

  jQuery.extend (->
    object = observable.apply @, arguments
    object.observation.scheduler = scheduler target: object
    object), observable


`export default schedulerable`

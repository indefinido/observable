# TODO transform look up into getOwnPropertyDescriptor Shim
`import lookup from '../lookup.js'`
`import jQuery from 'jquery'`

scheduler = (options = {}) ->
  timeout = null

  # Convert options to descriptors
  options[name] = value: value for name, value of options

  jQuery.extend options,
    schedulable_keypaths: value: []
    schedule: value: ->
      deliver = => @deliver()
      clearTimeout timeout
      timeout = setTimeout deliver, 20 or options.wait

  Object.create scheduler.methods, options


jQuery.extend scheduler,
  methods:
    # TODO pass object as parameter
    schedulable: (object, keypath) ->
      return unless @schedulable_keypaths.indexOf(keypath) == -1
      @schedulable_keypaths.push keypath
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
      unless value == observer.path_.getValueFrom object
        observer.setValue value
        object.observation.deliver()

    deliver   : -> @target.observation.deliver()

    setter: (object, keypath, callback) ->
      current_setter = lookup.setter.call object, keypath

      if current_setter
        (value) ->
          current_setter.call @, value

          @observed[keypath] = value
          @observation.scheduler.schedule()
          value

      else
        (value) ->
          @observed[keypath] = value
          @observation.scheduler.schedule()
          value

    getter: (object, keypath) ->
      lookup.getter.call(object, keypath) or root_getter = -> @observed[keypath]

    destroy: ->
      @target = null

# Shims observable to schedule changes
schedulerable = (observable) ->
  schedulerable.storage_for observable
  schedulerable.schedulable_observers()
  schedulerable.augment observable

schedulerable.storage_for = (observable) ->
  # TODO use observed property when shimming Object.observe, and when it
  # gets removed in the next version
  #
  # Object.defineProperty object, "observed",
  #   configurable: true
  #   enumerable: false
  #   value: {}

schedulerable.schedulable_observers = ->

  # Augment keypath observer to also schedule changes when setting
  # values
  `import {Path} from '../../vendor/observe-js/observe.js'`
  original = Path.prototype.setValueFrom
  Path.prototype.setValueFrom = (object) ->
    changed = original.apply @, arguments
    object.observation.scheduler.schedule() if changed

schedulerable.augment = (observable) ->
  # Since property changes must be scheduled in legacy browsers that
  # does not support Object.observe, we override observable to add a
  # scheduler in each observed object
  original = observable.methods.subscribe

  # TODO allow multiple callbacks as arguments on the api
  observable.methods.subscribe = (keypath, callback)->
    original.apply @, arguments
    @observation.scheduler.schedulable @, keypath unless typeof keypath == 'function'

  jQuery.extend (->
    object = observable.apply @, arguments
    object.observation.scheduler = scheduler target: object
    object), observable


`export default schedulerable`

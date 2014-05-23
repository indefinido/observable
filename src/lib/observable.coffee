# Shim older needed features
`import './platform.js'`
# TODO remove jquery dependency
`import jQuery from 'jquery'`
# Observable Implementation
`import observation from './observable/observation.js'`
`import selection   from './observable/selection.js'`
`import Observer    from './observable/observer.js'`


observable = ->
  object = observable.select.apply @, arguments

  return if object.observation

  jQuery.extend observable.observe(object), observable.methods

jQuery.extend observable,
  select: selection observable

  observe: (object) ->

    # Observers storage
    Object.defineProperty object, "observation",
      configurable: true
      enumerable: false
      value: observation object

    # Actual properties value storage, and for backwards compatibility
      # TODO implement warning on this property
      Object.defineProperty object, "observed",
        configurable: true
        enumerable: false
        value: {}

  keypath: (object, keypath) ->
    {observation: {observers}} = object
    observer = observers[keypath] ||= new Observer object, keypath

  unobserve: (object) ->
    unobserved = {}

    # TODO remove root setter and root getter and callbacks from
    # callback thread

    # Remove mixed in properties
    for name of observation.methods
      delete object[name]

    object.observation.destroy()
    object.observation.scheduler.destroy()
    delete object.observation
    delete object.observed

    unobserved

  methods:
    # TODO when rivets updates, start using array observer
    subscribe: (keypath, callback) ->
      observable.keypath @, keypath unless @observation.observers[keypath]
      @observation.add keypath, callback

    unsubscribe: (keypath, callback) ->
      @observation[if callback then 'remove' else 'mute'] keypath, callback

    publish: (keypath, value) ->
      # TODO put option to force microtask execution
      @[keypath] = value

# We import the scheduler for automatically schedulling microtask
# executions when polymer does not have the Object.observe
unless Object.observe
  `import schedulerable from './legacy/schedulerable.js'`
  observable = schedulerable observable

# For compatibility reasons only
observable.mixin = observable

`export default observable`

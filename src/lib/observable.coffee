# Shim older needed features
`import './platform.js'`
# TODO remove jquery dependency
`import jQuery          from 'jquery'`
# Observable Implementation
`import observation     from './observable/observation.js'`
`import selection       from './observable/selection.js'`
`import KeypathObserver from './observable/keypath_observer.js'`
`import SelfObserver    from './observable/self_observer.js'`

observable = ->
  object = observable.select.apply @, arguments

  # In case the user tries to observe a observed object
  return object if object.observation

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

  self: (object) ->
    {observation: {observers}} = object
    observer = observers.self ||= new SelfObserver object

  keypath: (object, keypath) ->
    {observation: {observers}} = object
    observer = observers[keypath] ||= new KeypathObserver object, keypath

  unobserve: (object) ->
      # In case the users tries to unobserve a not observed object
    return object unless object.observation

    # TODO remove root setter and root getter

    # Remove mixed in properties
    delete object[name] for name of observable.methods

    object.observation.destroy()
    object.observation.scheduler.destroy()
    delete object.observation
    delete object.observed

    true

  methods:
    # TODO when rivets updates, start using array observer
    subscribe: (keypath_or_callback, callback) ->
      switch arguments.length
        when 1
          observer = observable.self @
          @observation.add 'self', keypath_or_callback
        when 2
          observable.keypath @, keypath_or_callback
          @observation.add keypath_or_callback, callback

    unsubscribe: (keypath, callback) ->
      @observation[if callback then 'remove' else 'mute'] keypath, callback

    publish: (keypath, value) ->
      # TODO put option to force microtask execution
      @[keypath] = value

  # Browser compatibility stuff
  ignores: [] # Array of ignored properties when using dom element fix


# We import the scheduler for automatically schedulling microtask
# executions when polymer does not have the Object.observe
unless Object.observe
  `import schedulerable from './legacy/schedulerable.js'`
  observable = schedulerable observable

# For compatibility reasons only
observable.mixin = observable

`export default observable`

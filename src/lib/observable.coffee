# TODO Better keypath support

# Shim older needed features
`import 'observable/lib/platform.js'`
`import generator from 'observable/lib/generator.js'`
`import jQuery    from 'jQuery' `

# Observable Implementation
{requiresDomElement} = Object.defineProperty

observable_prototype =
  subscribe: observable_subscribe = (keypath, callback) ->
    throw new TypeError("observable.subscribe: cannot observe reserved property observed")  if keypath is "observed"
    generator.mutations.call this, keypath  if jQuery.isArray(this[keypath])
    generator.observe.call this, keypath, callback
    true

  unsubscribe: (object, keypath, callback) ->
    console.error "observable.unsubscribe not implemented yet."
    console.log object, keypath, callback
    return

  publish: observable_publish = (keypath, value) ->

    # TODO actually call callbacks
    this[keypath] = value

if requiresDomElement
  observable = (object) ->
    fix = undefined

    # observable() or observable(object)
    if @document and @location
      object = {}  unless object

    # observable.call(...)
    else

      # observable.call(param, param)
      if object
        throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)")

      # observable.call(object)
      else
        object = this

    # TODO better documentation
    throw new Error("observable.call: For compatibility reasons, observable can only be called when dom is loaded.")  unless jQuery.isReady

    # Create dom element if object isn't one
    unless typeof object.nodeName is "string"
      fix = document.createElement("fix")
      unless jQuery.isReady
        jQuery ->
          document.body.appendChild fix
          return

      else
        document.body.appendChild fix

      # Replace object with dom node
      object = jQuery.extend(fix, object)

    # Observe element if it is not observed
    # TODO remove jquery dependency
    unless object.observed
      generator.observable_for object
      object = jQuery.extend object, observable_prototype

    object

  ignores = document.createElement("fix")
  fix_ignores = []
  property = undefined
  for property of ignores
    fix_ignores.push property
  observable.ignores = fix_ignores
else
  observable = (object) ->

    # observable() or observable(object)
    if this is window
      object = {}  unless object

    # observable.call(...)
    else if this isnt window

      # observable.call(param, param)
      if object
        throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)")

      # observable.call(object)
      else
        object = this

    generator.observable_for object  unless object.observed
    jQuery.extend object, observable_prototype

  observable.ignores = []

observable.unobserve = (object) ->
  name = undefined
  value = undefined
  subname = undefined
  unobserved = {}

  # TODO remove root setter and root getter and callbacks from
  # callback thread

  # Remove mixed in properties
  for name of observable_prototype
    delete object[name]

  # Remove array properties overrides
  for name of object
    value = object[name]
    if jQuery.type(value) is "array"
      delete value.thread

      delete value.object

      delete value.key

      for subname of mutations.overrides
        delete value[subname]

  for name of object

    # TODO put Array.indexOf as a dependency
    unobserved[name] = object[name]  if observable.ignores and observable.ignores.indexOf(name) is -1
  delete object.observed

  unobserved


# For compatibility reasons only
observable.mixin = observable

`export default observable`

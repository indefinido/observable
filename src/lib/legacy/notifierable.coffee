`import jQuery from 'jquery'`

notifierable =

  # TODO pass object as parameter
  observe: (object, keypath, callback) ->

    # Transform property into observable
    Object.defineProperty object, keypath,
      get: @getter object, keypath
      set: @setter object, keypath, callback
      enumerable: true


  storage_for: (object) ->
    toJSON = undefined
    Object.defineProperty object, "observed",
      configurable: true
      enumerable: false
      value: {}

    # TODO remove json in favor of the toJSON convention
    toJSON = object.json or object.toJSON
    if toJSON
      Object.defineProperty object, "toJSON",
        enumerable: false
        value: ->
          json = undefined

          # TODO remove underscore dependency
          # TODO ? move toJSON and observed to other methods
          json = toJSON.apply(this, arguments)
          observable.unobserve _.omit(json, observable.ignores, [
            "toJSON"
            "observed"
          ])

  # TODO improve readability
  # TODO implement linked list
  setter: (object, keypath, callback) ->
    setter = lookup.setter.call(object, keypath)

    # Store current value, since after definition there will be none
    @observed[keypath] = lookup.getter.call(object, keypath) and lookup.getter.call(object, keypath)() or object[keypath]

    # First time subscribing
    unless setter
      setter = (value) ->
        check.call(object, keypath, value) isnt false and setter.callback_thread.call(object, value)

    # First time subscribing but does not have callback_thread associated
    else unless setter.callback_thread
      old_setter = setter
      setter = (value) ->
        check.call(object, keypath, value) isnt false and setter.callback_thread.call(object, value)

      setter.callback_thread = old_setter
    current = setter.callback_thread or $.noop
    setter.callback_thread = thread = (value) ->
      current.call(object, value) isnt false and callback.call(object, value)


    # TODO better implementation of loookup setter / lookup getter on accessors shim
    @observed[keypath + "_setter"] = setter  if requiresDomElement
    setter

  getter: subscribed_getter = (object, keypath) ->
    getter = lookup.getter.call(object, keypath) or root_getter = -> object.observed[keypath]

    # TODO better implementation of loookup setter / lookup getter on accessors shim
    @observed[keypath + "_getter"] = getter  if requiresDomElement
    getter

  mutations: (keypath) ->
    setter = lookup.setter.call(this, keypath)
    array = this[keypath]

    # First time subscribing, and it is an array
    unless setter

      # TODO use this.subscribe instead of @observe.call
      @observe.call this, keypath, (new_array) ->
        i = undefined
        type = undefined
        j = undefined

        # Avoid non push operations!
        # TODO remove jquery dependency
        return  if $.type(new_array) isnt "array"

        # Skip this if it is not the first time
        return  if new_array.object is array.object and new_array.thread is array.thread
        i = new_array.length
        j = new_array.length
        new_array.thread = array.thread
        new_array.object = array.object
        new_array.key = keypath
        while i--

          # TODO remove jquery dependency
          type = $.type(new_array[i])

          # Recursivelly convert objects and arrays to observables
          new_array[i] = observable(new_array[i])  if not new_array[i].observed and (type is "object" or type is "array")
        new_array.length = j

        # Update internal property value
        $.extend new_array, mutations.overrides
        return

      setter = lookup.setter.call(this, keypath)

    # TODO Transform this code to define property
    array.thread = setter.callback_thread
    array.object = this
    array.key = keypath

    # Override default array methods
    $.extend array, mutations.overrides
    @observed.mutate = mutations.mutate  unless @observed.mutate
    return

mutations =
  mutate: (thread, method, array) ->
    array.method = method
    thread.call this, array
    @publish array.key, array # TODO ver se é uma boa
    delete array.method

    return

  overrides:
    push: ->
      i = arguments.length
      operation = undefined
      not arguments[i].observed and $.type(arguments[i]) is "object" and (arguments[i] = observable(arguments[i]))  while i--
      operation = Array::push.apply(this, arguments) # TODO Convert arguments for real array
      @object.observed.mutate.call @object, @thread, "push", this
      operation

jQuery("pop shift unshift".split(" ")).each (i, method) ->
  mutations.overrides[method] = ->
    Array::[method].apply this, arguments
    @object.observed.mutate.call @object, @thread, method, this

`export default notifierable`

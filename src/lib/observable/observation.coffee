observation =
  add      : (keypath, callback) -> @observers[keypath].add callback
  remove   : (keypath, callback) -> @observers[keypath].remove callback
  deliver  : (discard) -> observer.deliver discard for keypath, observer of @observers
  # TODO allow custom changes delivery
  # report: ->
  mute     : (keypath) ->
    @observers[keypath].close()
    delete @observers[keypath]
  destroy  : (keypath) ->
    observer.close() for keypath, observer of @observers
    delete @observers

observationable = (object) -> Object.create observation, {observers: {value: {}}}
`export default observationable`

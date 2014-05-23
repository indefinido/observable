`import {PathObserver} from '../../vendor/observe-js/observe.js'`
# TODO implement jQuery.Callbacks functionality as a component separately
`import {Callbacks} from 'jquery'`

class Observer extends PathObserver
  constructor: (object, keypath) ->
    _super.call @, object, keypath
    @callbacks = Callbacks()

    # TODO better opening functionality
    @open (-> @fireWith object, arguments), @callbacks

  add   : (callback) -> @callbacks.add callback
  remove: -> @callbacks.remove arguments...

  close: ->
    super
    @callbacks.empty()
    delete @callbacks

`export default Observer`

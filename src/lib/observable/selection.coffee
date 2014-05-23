`import jQuery from 'jquery'` # TODO remove jquery dependency
{requiresDomElement} = Object.defineProperty

selection = (observable) ->

  if requiresDomElement
    selection.generate_ignores observable
    selection.legacy
  else
    selection.from_call

selection.legacy = ->
  object = selection.from_call.apply @, arguments

  # TODO better documentation
  throw new Error("observable.call: For compatibility reasons, observable can only be called when dom is loaded.")  unless jQuery.isReady

  # Create dom element if object isn't one
  if typeof object.nodeName isnt "string"

    fix = document.createElement "fix"
    document.body.appendChild fix

    # Replace object with dom node
    object = jQuery.extend(fix, object)

  object

selection.generate_ignores = (observable) ->
  ignores = document.createElement("fix")
  fix_ignores = []
  property = undefined

  for property of ignores
    fix_ignores.push property

  observable.ignores = fix_ignores


selection.from_call = (param) ->
  # observable() or observable(object)
  if this is window
    object = param || {}

  # observable.call(...)
  else if this isnt window

    # observable.call(param, param)
    if param
      throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)")

    # observable.call(object)
    else

      object = this

  object




`export default selection`

# TODO implement shim for Object.getOwnPropertyDescriptor
# TODO implement using Object.getOwnPropertyDescriptor
lookup =
  setter: Object::__lookupSetter__ or (property) ->
    @observed and @observed[property + "_setter"]

  getter: Object::__lookupGetter__ or (property) ->
    default_getter = undefined
    @observed and @observed[property + "_getter"] or ((default_getter = $.proxy(lookup.default_getter, this, property)) and (default_getter.is_default = true) and (default_getter))

  types:
    undefined: `undefined`
    null: null
    true: true
    false: false
    NaN: NaN


  # overrides: [Object.prototype.toString, String.prototype.toString, Array.prototype.toString, Number.prototype.toString],
  basic_types: [
    `undefined`
    null
  ]
  default_getter: (property) ->
    possible_value = this[property]

    # Getter is the toString property of object
    if possible_value and possible_value.hasOwnProperty("toString")
      return @observed[property]  if possible_value.toString.is_default
      possible_value.toString.call this
    else if possible_value of lookup.types
      lookup.types[possible_value]
    else
      possible_value

`export default lookup`

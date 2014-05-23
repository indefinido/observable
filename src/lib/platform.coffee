require "../vendor/shims/object.create"  unless Object::create
require "../vendor/shims/array.indexOf"  unless Array::indexOf

# Object.defineProperty (for ie5+)
unless typeof require is "undefined" # TODO check why this check is here

  # __lookup*__ and __define*__ for browsers with defineProperty support
  # TODO Figure out why gives an infinity loop
  require "../vendor/shims/accessors-legacy.js"

  # Creates Object.defineProperty
  require "../vendor/shims/accessors.js"

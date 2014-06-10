adapter =
  subscribe: (record, attribute_path, callback) ->
    throw new TypeError 'observable.adapters.rivets.subscribe: No record provided for subscription' unless record?
    # TODO parse aura widget attributes options, remove, add as a
    # comentary, and let rivets bindings flow, and remove the if check
    record.subscribe attribute_path, callback if attribute_path
  unsubscribe: (record, attribute_path, callback) ->
    throw new TypeError 'observable.adapters.rivets.unsubscribe: No record provided for subscription' unless record?
    record.unsubscribe attribute_path, callback
  read: (record, attribute_path) ->
    throw new TypeError 'observable.adapters.rivets.read: No record provided for subscription' unless record?

    # Optimize for the comon case
    if attribute_path.indexOf('.') == -1
      record[attribute_path]
    else
      # TODO implement observation.observer_of(attribute_path)
      record.observation.observers[attribute_path].value_

  publish: (record, attribute_path, value) ->
    throw new TypeError 'observable.adapters.rivets.publish: No record provided for subscription' unless record?

    # Optimize for the comon case
    if attribute_path.indexOf('.') == -1
      record[attribute_path] = value
    else
      # TODO implement observation.observer_of(attribute_path)
      record.observation.observers[attribute_path].setValue value


`export default adapter`

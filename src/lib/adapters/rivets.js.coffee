exports.adapter =
  subscribe: (record, attribute_path, callback) ->
    throw new TypeError 'observable.adapters.rivets.subscribe: No record provided for subscription' unless record?
    record.subscribe attribute_path, callback
  unsubscribe: (record, attribute_path, callback) ->
    throw new TypeError 'observable.adapters.rivets.unsubscribe: No record provided for subscription' unless record?
    record.unsubscribe attribute_path, callback
  read: (record, attribute_path) ->
    throw new TypeError 'observable.adapters.rivets.read: No record provided for subscription' unless record?
    record[attribute_path]
  publish: (record, attribute_path, value) ->
    throw new TypeError 'observable.adapters.rivets.publish: No record provided for subscription' unless record?
    record[attribute_path] = value
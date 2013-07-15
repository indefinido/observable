exports.adapter =
  subscribe: (record, attribute_path, callback) ->
    record.subscribe attribute_path, callback
  unsubscribe: (record, attribute_path, callback) ->
    record.unsubscribe attribute_path, callback
  read: (record, attribute_path) ->
    record[attribute_path]
  publish: (record, attribute_path, value) ->
    record[attribute_path] = value
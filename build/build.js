

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};


require.register("observable/components/cjohansen-sinon.js/sinon.js", function(exports, require, module){
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = (function (buster) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function isRestorable (obj) {
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property];

            if (!isFunction(wrappedMethod)) {
                throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            }

            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
            }

            if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                throw new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            // IE 8 does not support hasOwnProperty on the window object.
            var owned = hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }
            if (typeof a != "object" || typeof b != "object") {
                return a === b;
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            if ((a === null && b !== null) || (a !== null && b === null)) {
                return false;
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Array]") {
                if (a.length !== b.length) {
                    return false;
                }

                for (var i = 0, l = a.length; i < l; i += 1) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            var prop, aLength = 0, bLength = 0;

            for (prop in a) {
                aLength += 1;

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            return aLength == bLength;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: "
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        },

        typeOf: function (value) {
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        },

        createStubInstance: function (constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError("The constructor should be a function.");
            }
            return sinon.stub(sinon.create(constructor.prototype));
        },

        restore: function (object) {
            if (object !== null && typeof object === "object") {
                for (var prop in object) {
                    if (isRestorable(object[prop])) {
                        object[prop].restore();
                    }
                }
            }
            else if (isRestorable(object)) {
                object.restore();
            }
        }
    };

    var isNode = typeof module == "object" && typeof require == "function";

    if (isNode) {
        try {
            buster = { format: require("buster-format") };
        } catch (e) {}
        module.exports = sinon;
        module.exports.spy = require("./sinon/spy");
        module.exports.spyCall = require("./sinon/call");
        module.exports.stub = require("./sinon/stub");
        module.exports.mock = require("./sinon/mock");
        module.exports.collection = require("./sinon/collection");
        module.exports.assert = require("./sinon/assert");
        module.exports.sandbox = require("./sinon/sandbox");
        module.exports.test = require("./sinon/test");
        module.exports.testCase = require("./sinon/test_case");
        module.exports.assert = require("./sinon/assert");
        module.exports.match = require("./sinon/match");
    }

    if (buster) {
        var formatter = sinon.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof buster == "object" && buster));

});
require.register("observable/index.js", function(exports, require, module){
module.exports = require('./lib/observable');

});
require.register("observable/lib/observable.js", function(exports, require, module){
(function() {

  // TODO Better keypath support
  this.observable = (function ($) {

	var mixer = function() {
	  return $.extend(this, mixin);
	},

	check = function (keypath, value) {
	  this.observed[keypath] = value;
	  return true;
	},

	// TODO implement Object.getOwnPropertyDescriptor
	lookup = {
	  setter: Object.prototype.__lookupSetter__ || function (property) {
		return this.observed && this.observed[property + '_setter'];
	  },
	  getter: Object.prototype.__lookupGetter__ || function (property) {
		return this.observed && this.observed[property + '_getter'] || lookup.default_getter;
	  },
	  types: {
		'undefined': undefined,
		'null': null,
		'true': true,
		'false': false,
		'NaN': NaN
	  },
	  overrides: [Object.prototype.toString, String.prototype.toString, Array.prototype.toString, Number.prototype.toString],
	  basic_types: [undefined, null],
	  default_getter: function (property) {
		value = this[property] && (this[property].toString.call(this)) || this[property] + '';
		if (value in lookup.types) return lookup.types[value];
		return value;
	  }
	},

	mixin = {
	  subscribe: function observable_subscribe (keypath, callback) {
		if (keypath == 'observed') throw new TypeError('observable.subscribe: cannot observe reserved property observed');
		if (!this.observed) generator.observable_for(this);

		Object.defineProperty(this, keypath, {
		  get: generator.getter.call(this, keypath),
		  set: generator.setter.call(this, keypath, callback)
		});

		if ($.isArray(this[keypath])) generator.mutations.call(this, keypath);
	  },
	  unsubscribe: function (object, keypath, callback) {
		return function() {
		  return console.log(object, keypath, callback);
		};
	  },
	  publish: function observable_publish (keypath, value) {
		return object[keypath] = value;
	  }
	},
	generator = {
	  observable_for: function (object) {
		return Object.defineProperty(object, 'observed', {
		  configurable: true,
		  enumerable: false,
		  value: {}
		});
	  },
	  setter: function subscribed_setter (keypath, callback) {
		var setter = lookup.setter.call(this, keypath), current, getter;

		// Set value
		this.observed[keypath] = lookup.getter.call(this, keypath) && lookup.getter.call(this, keypath)() || this[keypath];

		// First time subscribing
		if (!setter) {
		  setter = function setter (value) {
			check.call(this, keypath, value) !== false && setter.callback_thread.call(this, value);
		  }
		}

		current = setter.callback_thread || $.noop;

		setter.callback_thread = function thread (value) {
		  current.call(this, value) !== false && callback.call(this, value);
		}

		if ($.browser.msie && $.browser.version <= 8) this.observed[keypath + '_setter'] = setter;

		return setter;
	  },
	  getter: function subscribed_getter (keypath) {
		var object = this, getter;

		getter = lookup.getter.call(this, keypath) || function root_getter () {
		  return object.observed[keypath];
		};

		if ($.browser.msie && $.browser.version <= 8) this.observed[keypath + '_getter'] = getter;

		return getter;
	  },
	  mutations: function (keypath) {
        var setter = lookup.setter.call(this, keypath), array = this[keypath];
        // TODO Transform this code to define property
        array.thread = setter.callback_thread;
        array.object = this;

        // Override default array methods
        $.extend(array, mutations.overrides);

        if (!this.observed.mutate) this.observed.mutate = mutations.mutate;
      }
	},
	 mutations = {
      mutate: function (thread, method, array) {
        thread.apply(this, array, method);
      },
      overrides: {}
    };

	if ($.browser.msie && $.browser.version <= 8) {

	  mixer = function() {
//		if (!jQuery.isReady) throw new Error('observable.call: For compatibility reasons, observable can only be called when dom is loaded.');

		var fix = document.createElement('fix');

		if (!jQuery.isReady) $(function () {document.body.appendChild(fix);});
		else document.body.appendChild(fix);

		return $.extend(fix, this, mixin);
	  };

	  (function () {
		var fix = document.createElement('fix'),
		fix_ignores = [], property;

		for (property in fix) {
		  fix_ignores.push(property)
		}

		mixer.fix_ignores = fix_ignores;
	  })();
	}

	mixer.fix_ignores = mixer.fix_ignores || [];

	$('push pop shift unshift'.split(' ')).each(function (i, method) {
      mutations.overrides[method] = function () {
        Array.prototype[method].apply(this, arguments);
        this.object.observed.mutate.call(this.object, this.thread, method, this);
      };
    });

    return mixer;
  })(jQuery);

}).call(this);

});
require.register("observable/lib/adapters/rivets.js", function(exports, require, module){
(function() {
  model.rivets = function() {
    var model_extensions;

    model_extensions = {
      record: {
        tie: function(element) {
          var lasso;

          lasso = {};
          lasso[this.resource] = this;
          return rivets.bind(element, lasso);
        }
      }
    };
    rivets.configure({
      adapter: {
        subscribe: function(record, attribute_path, callback) {
          return record.subscribe(attribute_path, callback);
        },
        unsubscribe: function(record, attribute_path, callback) {
          return record.unsubscribe(attribute_path, callback);
        },
        read: function(record, attribute_path) {
          return record[attribute_path];
        },
        publish: function(record, attribute_path, value) {
          return record[attribute_path] = value;
        }
      },
      preloadData: true
    });
    return model.mix(function(modelable) {
      modelable.record || (modelable.record = {});
      window.observable.call(modelable.record);
      return $.extend(true, modelable, model_extensions);
    });
  };

}).call(this);

});



import 'observable/lib/platform.js';
import jQuery from 'jquery';
import observation from 'observable/lib/observable/observation.js';
import selection   from 'observable/lib/observable/selection.js';
import Observer    from 'observable/lib/observable/observer.js';
var observable;

observable = function() {
  var object;

  object = observable.select.apply(this, arguments);
  if (object.observation) {
    return;
  }
  return jQuery.extend(observable.observe(object), observable.methods);
};

jQuery.extend(observable, {
  select: selection(observable),
  observe: function(object) {
    return Object.defineProperty(object, "observation", {
      configurable: true,
      enumerable: false,
      value: observation(object)
    }, Object.defineProperty(object, "observed", {
      configurable: true,
      enumerable: false,
      value: {}
    }));
  },
  keypath: function(object, keypath) {
    var observer, observers;

    observers = object.observation.observers;
    return observer = observers[keypath] || (observers[keypath] = new Observer(object, keypath));
  },
  unobserve: function(object) {
    var name, unobserved;

    unobserved = {};
    for (name in observation.methods) {
      delete object[name];
    }
    object.observation.destroy();
    object.observation.scheduler.destroy();
    delete object.observation;
    delete object.observed;
    return unobserved;
  },
  methods: {
    subscribe: function(keypath, callback) {
      if (!this.observation.observers[keypath]) {
        observable.keypath(this, keypath);
      }
      return this.observation.add(keypath, callback);
    },
    unsubscribe: function(keypath, callback) {
      return this.observation[callback ? 'remove' : 'mute'](keypath, callback);
    },
    publish: function(keypath, value) {
      return this[keypath] = value;
    }
  }
});

if (!Object.observe) {
  import schedulerable from 'observable/lib/legacy/schedulerable.js';
  observable = schedulerable(observable);
}

observable.mixin = observable;

export default observable;

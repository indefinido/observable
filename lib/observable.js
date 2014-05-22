import 'observable/lib/platform.js';
import generator from 'observable/lib/generator.js';
import jQuery    from 'jQuery' ;
var fix_ignores, ignores, observable, observable_prototype, observable_publish, observable_subscribe, property, requiresDomElement;

requiresDomElement = Object.defineProperty.requiresDomElement;

observable_prototype = {
  subscribe: observable_subscribe = function(keypath, callback) {
    if (keypath === "observed") {
      throw new TypeError("observable.subscribe: cannot observe reserved property observed");
    }
    if (jQuery.isArray(this[keypath])) {
      generator.mutations.call(this, keypath);
    }
    generator.observe.call(this, keypath, callback);
    return true;
  },
  unsubscribe: function(object, keypath, callback) {
    console.error("observable.unsubscribe not implemented yet.");
    console.log(object, keypath, callback);
  },
  publish: observable_publish = function(keypath, value) {
    return this[keypath] = value;
  }
};

if (requiresDomElement) {
  observable = function(object) {
    var fix;

    fix = void 0;
    if (this.document && this.location) {
      if (!object) {
        object = {};
      }
    } else {
      if (object) {
        throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)");
      } else {
        object = this;
      }
    }
    if (!jQuery.isReady) {
      throw new Error("observable.call: For compatibility reasons, observable can only be called when dom is loaded.");
    }
    if (typeof object.nodeName !== "string") {
      fix = document.createElement("fix");
      if (!jQuery.isReady) {
        jQuery(function() {
          document.body.appendChild(fix);
        });
      } else {
        document.body.appendChild(fix);
      }
      object = jQuery.extend(fix, object);
    }
    if (!object.observed) {
      generator.observable_for(object);
      object = jQuery.extend(object, observable_prototype);
    }
    return object;
  };
  ignores = document.createElement("fix");
  fix_ignores = [];
  property = void 0;
  for (property in ignores) {
    fix_ignores.push(property);
  }
  observable.ignores = fix_ignores;
} else {
  observable = function(object) {
    if (this === window) {
      if (!object) {
        object = {};
      }
    } else if (this !== window) {
      if (object) {
        throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)");
      } else {
        object = this;
      }
    }
    if (!object.observed) {
      generator.observable_for(object);
    }
    return jQuery.extend(object, observable_prototype);
  };
  observable.ignores = [];
}

observable.unobserve = function(object) {
  var name, subname, unobserved, value;

  name = void 0;
  value = void 0;
  subname = void 0;
  unobserved = {};
  for (name in observable_prototype) {
    delete object[name];
  }
  for (name in object) {
    value = object[name];
    if (jQuery.type(value) === "array") {
      delete value.thread;
      delete value.object;
      delete value.key;
      for (subname in mutations.overrides) {
        delete value[subname];
      }
    }
  }
  for (name in object) {
    if (observable.ignores && observable.ignores.indexOf(name) === -1) {
      unobserved[name] = object[name];
    }
  }
  delete object.observed;
  return unobserved;
};

observable.mixin = observable;

export default observable;

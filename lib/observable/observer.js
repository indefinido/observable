import {PathObserver} from '../../vendor/observe-js/observe.js';
import {Callbacks} from 'jquery';
var Observer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observer = (function(_super) {
  __extends(Observer, _super);

  function Observer(object, keypath) {
    _super.call(this, object, keypath);
    this.callbacks = Callbacks();
    this.open((function() {
      return this.fireWith(object, arguments);
    }), this.callbacks);
  }

  Observer.prototype.add = function(callback) {
    return this.callbacks.add(callback);
  };

  Observer.prototype.remove = function() {
    var _ref;

    return (_ref = this.callbacks).remove.apply(_ref, arguments);
  };

  Observer.prototype.close = function() {
    Observer.__super__.close.apply(this, arguments);
    this.callbacks.empty();
    return delete this.callbacks;
  };

  return Observer;

})(PathObserver);

export default Observer;

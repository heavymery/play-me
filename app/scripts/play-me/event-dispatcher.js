'use strict';

// TODO: ドキュメント日本語で

/**
 * @fileoverview Event dispatcher and original event type.
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * Creates a new event dispatcher.
 * @constructor
 */
PlayMe.EventDispatcher = function() {
  this._listeners = {};
};
PlayMe.EventDispatcher.prototype.constructor = PlayMe.EventDispatcher;


/**
 * Add event listener.
 * @param {string} type Event type.
 * @param {function} listener Listener function.
 */
PlayMe.EventDispatcher.prototype.addEventListener = function(type, listener, once) {
  if (typeof this._listeners[type] === 'undefined') {
    this._listeners[type] = [];
  }

  var listenersOfType = this._listeners[type];

  var listenerWrapper;

  if(once) {
    listenerWrapper = function(event) {

      listener.call(event.target, event);

      var index = listenersOfType.indexOf(listenerWrapper);

      if(index > - 1) {
        listenersOfType.splice(index, 1);
      }
    };
  } else {
    listenerWrapper = listener;
  }

  if (listenersOfType.indexOf(listener) < 0) {
    listenersOfType.push(listenerWrapper);
  }
};


/**
 * Check event listener has added.
 * @param {string} type Event type.
 * @param {function} listener Listener function.
 */
PlayMe.EventDispatcher.prototype.hasEventListener = function(type, listener) {
  var listenersOfType = this._listeners[type];

  if (typeof listenersOfType !== 'undefined' && listenersOfType.indexOf(listener) > -1) {
    return true;
  } else {
    return false;
  }
};


/**
 * Remove event listener.
 * @param {string} type Event type.
 * @param {function} listener Listener function.
 */
PlayMe.EventDispatcher.prototype.removeEventListener = function(type, listener) {
  var listenersOfType = this._listeners[type];

  if(typeof listenersOfType !== 'undefined') {
    var index = listenersOfType.indexOf(listener);

    if(index > - 1) {
      listenersOfType.splice(index, 1);
    }
  }
};


/**
 * Dispatch new event.
 * @param {string} type Event type.
 * @param {object} data Event data.
 */
PlayMe.EventDispatcher.prototype.dispatchEvent = function(type, data) {
  var listenersOfType = this._listeners[type];

  if(typeof listenersOfType !== 'undefined') {
    for (var i = 0; i < listenersOfType.length; i ++) {
      listenersOfType[i].call(this, new PlayMe.Event(type, this, data));
    }
  }
};


/**
 * Creates a new event data.
 * @param {string} type Event type.
 * @param {object} target Target of event.
 * @param {object} data Data of event.
 * @constructor
 */
PlayMe.Event = function(type, target, data) {
  this.type = type;

  this.target = target;

  this.data = data;

  this.timeStamp = Date.now();
};

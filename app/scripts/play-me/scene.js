'use strict';

// TODO: ドキュメント日本語で

/**
 * @fileoverview Abstract scene object.
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * Creates a new scene.
 * @param {!(PIXI.DisplayObjectContainer|Object)} container Display objects container of scene.
 * @constructor
 * @extends {PlayMe.EventDispatcher}
 */
PlayMe.Scene = function(container) {
  PlayMe.EventDispatcher.call(this);

  /**
   * Wether scene is loaded or not.
   * @type {boolean}
   * @private
   */
  this._loaded = false;

  /**
   * The container of display objects.
   * @type {!(PIXI.DisplayObjectContainer|Object)}
   * @protected
   */
  this.container = container;

  /**
   * Scene manager object.
   * @type {?PlayMe.sceneManager}
   * @protected
   */
  this.sceneManager = null;
};
PlayMe.Scene.prototype = Object.create(PlayMe.EventDispatcher.prototype);
PlayMe.Scene.prototype.constructor = PlayMe.Scene;


/**
 * Event types dispatched by the scene object.
 * @enum {string}
 */
PlayMe.Scene.EventType = {
  /** Dispatched when scene assets load completed. */
  LOAD_COMPLETE: 'loadComplete',
  /** Dispatched when show scene elements completed. */
  SHOW_COMPLETE: 'showComplete',
  /** Dispatched when hide scene elements completed. */
  HIDE_COMPLETE: 'hideComplete'
};


/**
 * Wether scene is loaded or not.
 * @return {boolean}
 */
PlayMe.Scene.prototype.isLoaded = function() {
  return this._loaded;
};


/**
 * Load scene assets.
 * また基本的な表示要素はあらけじめ container に配置しておく
 */
PlayMe.Scene.prototype.load = function() {
  throw new Error('The type PlayMe.Scene must implement the \'load\' method.');
};


/**
 * Dispatch a show complete event.
 * @protected
 */
PlayMe.Scene.prototype.dispatchLoadCompleteEvent = function() {
  this._loaded = true;
  this.dispatchEvent(PlayMe.Scene.EventType.LOAD_COMPLETE);
};


/**
 * Show scene elements.
 */
PlayMe.Scene.prototype.show = function() {
  throw new Error('The type PlayMe.Scene must implement the \'show\' method.');
};


/**
 * Dispatch a show complete event.
 * @protected
 */
PlayMe.Scene.prototype.dispatchShowCompleteEvent = function() {
  this.dispatchEvent(PlayMe.Scene.EventType.SHOW_COMPLETE);
};


/**
 * Hide scene elements.
 */
PlayMe.Scene.prototype.hide = function() {
  throw new Error('The type PlayMe.Scene must implement the \'hide\' method.');
};


/**
 * Dispatch a hide complete event.
 * @protected
 */
PlayMe.Scene.prototype.dispatchHideCompleteEvent = function() {
  this.dispatchEvent(PlayMe.Scene.EventType.HIDE_COMPLETE);
};


/**
 * Update scene elements layout.
 * (when screen size or oriention changed)
 */
PlayMe.Scene.prototype.updateLayout = function() {
  throw new Error('The type PlayMe.Scene must implement the \'updateLayout\' method.');
};

'use strict';

// TODO: ドキュメント日本語で

/**
 * @fileoverview Manage multiple scene objects.
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * Creates a new scene manager.
 * @param {!(PIXI.Stage|Object)} stage PixiJS(or other renderer) stage object.
 * @constructor
 * @extends {PlayMe.EventDispatcher}
 */
PlayMe.SceneManager = function(stage) {
  PlayMe.EventDispatcher.call(this);

  /**
   * Display area of scenes.
   * @type {!(PIXI.Stage|Object)}
   * @private
   */
  this._stage = stage;
  
  /**
   * Scenes that should be managed.
   * @type {Object.<string, PlayMe.Scene>} 
   * @private
   */
  this._scenes = {};

  /**
   * Current activated scene.
   * @type {?PlayMe.Scene}
   * @private
   */
  this._currentScene = null;

  /**
   * Default preload scene.
   * @type {?PlayMe.Scene}
   */
  this.preloadScene = null;
};
PlayMe.SceneManager.prototype = Object.create(PlayMe.EventDispatcher.prototype);
PlayMe.SceneManager.prototype.constructor = PlayMe.SceneManager;


/**
 * Event types dispatched by the scene manager.
 * @enum {string}
 */
PlayMe.SceneManager.EventType = {
  /** Dispatched when current scene changed. */
  SCENE_CHANGED: 'sceneChanged'
};


/**
 * Scene switch modes.
 * @enum {string}
 */
PlayMe.SceneManager.SwitchMode = {
  PARALLEL: 'parallel',
  SERIAL: 'serial'
};


/**
 * Returns the current activated scene.
 * @return {?PlayMe.Scene}
 */
PlayMe.SceneManager.prototype.getCurrentScene = function() {
  return this._currentScene;
};


/**
 * Returns the scene object.
 * @param {string} name Name of scene.
 * @return {PlayMe.Scene}
 */
PlayMe.SceneManager.prototype.getScene = function(name) {
  if(this._scenes[name]) {
    return this._scenes[name];
  } else {
    throw new Error('The Scene \'' + name + '\' is not exists.');
  }
};


/**
 * Add scene to scene manager.
 * @param {string} name Name of scene.
 * @param {PlayMe.Scene} scene The scene object.
 */
PlayMe.SceneManager.prototype.addScene = function(name, scene) {
  if(this._scenes[name]) {
    throw new Error('The Scene \'' + name + '\' already added.');
  } else {
    this._scenes[name] = scene;
    this._scenes[name].sceneManager = this;
  }
};


/**
 * Remove scene from scene manager.
 * @param {string} name Name of scene.
 */
PlayMe.SceneManager.prototype.removeScene = function(name) {
 if(this._scenes[name]) {
    this._scenes[name].sceneManager = null;
    this._scenes[name] = null;
  } else {
    throw new Error('The Scene \'' + name + '\' is not exists.');
  }
};


/**
 * Show scene on the stage.
 * @param {string} name Name of scene.
 */
PlayMe.SceneManager.prototype.gotoScene = function(name, option) {
  if(this.preloadScene && !this.preloadScene.isLoaded()) {
    throw new Error('The PreloadScene is not loaded.');
    // TODO: 別にここでロードすれば良い？
  }

  if(!this._scenes[name]) {
    throw new Error('The Scene \'' + name + '\' is not exists.');
  }

  if(this._currentScene) {
    this._currentScene.addEventListener(
      PlayMe.Scene.EventType.HIDE_COMPLETE, function(event) {
        this._stage.removeChild(event.target.container);
        console.debug(event);

        // TODO: シーン切り替えタイプの実装

        // 次のシーンがローディング済みの場合
        // 1. シリアル: prev scene hide -> next scene show
        // 2. パラレル: prev scene hide >< next scene show

        // 次のシーンがまだローディングされて無い場合
        // 1. シリアル: prev scene hide -> next scene load -> next scene show
        // 2. パラレル: next scene load -> prev scene hide >< next scene show

        this._currentScene = this._scenes[name];

        this._currentScene.addEventListener(
          PlayMe.Scene.EventType.SHOW_COMPLETE, function(event) {
            console.debug(event);

            this.dispatchEvent(PlayMe.SceneManager.EventType.SCENE_CHANGED);
          }.bind(this), true);

        if(this._currentScene.isLoaded()) {
          this._stage.addChild(this._currentScene.container);
          this._currentScene.show();
        } else {
          // TODO: EventHandler が蓄積されちゃう〜
          this._currentScene.addEventListener(PlayMe.Scene.EventType.LOAD_COMPLETE, function(event) {
            console.debug(event);

             // 消えたら Stage から外す
            this.preloadScene.addEventListener(
              PlayMe.Scene.EventType.HIDE_COMPLETE, function(event) {
                console.debug(event);
                this._stage.removeChild(this.preloadScene.container);
              }.bind(this), true);
            this.preloadScene.hide();

            this._stage.addChild(this._currentScene.container);
            this._currentScene.show();
          }.bind(this));

          // TODO: 規定のローディング表示（ prelaodScene が設定されていれば）
          // また、ロード完了まで瞬時に終わったら表示しない
          // CocoonJS の場合でも時間が掛かる場合は表示した方が良さげ
          this.preloadScene.addEventListener(
            PlayMe.Scene.EventType.SHOW_COMPLETE, function(event) {
              console.debug(event);
            }, true);
          this._stage.addChild(this.preloadScene.container);
          this.preloadScene.show();

          this._currentScene.load();
        }


      }.bind(this), true);

    this._currentScene.hide();
  } else {

    // TODO: シーン切り替えタイプの実装

    // 次のシーンがローディング済みの場合
    // 1. シリアル: prev scene hide -> next scene show
    // 2. パラレル: prev scene hide >< next scene show

    // 次のシーンがまだローディングされて無い場合
    // 1. シリアル: prev scene hide -> next scene load -> next scene show
    // 2. パラレル: next scene load -> prev scene hide >< next scene show

    this._currentScene = this._scenes[name];

    this._currentScene.addEventListener(
      PlayMe.Scene.EventType.SHOW_COMPLETE, function(event) {
        console.debug(event);

        this.dispatchEvent(PlayMe.SceneManager.EventType.SCENE_CHANGED);
      }.bind(this), true);

    if(this._currentScene.isLoaded()) {
      this._stage.addChild(this._currentScene.container);
      this._currentScene.show();
    } else {
      // TODO: EventHandler が蓄積されちゃう〜
      this._currentScene.addEventListener(PlayMe.Scene.EventType.LOAD_COMPLETE, function(event) {
        console.debug(event);

         // 消えたら Stage から外す
        this.preloadScene.addEventListener(
          PlayMe.Scene.EventType.HIDE_COMPLETE, function(event) {
            console.debug(event);
            this._stage.removeChild(this.preloadScene.container);
          }.bind(this), true);
        this.preloadScene.hide();

        this._stage.addChild(this._currentScene.container);
        this._currentScene.show();
      }.bind(this));

      // TODO: 規定のローディング表示（ prelaodScene が設定されていれば）
      // また、ロード完了まで瞬時に終わったら表示しない
      // CocoonJS の場合でも時間が掛かる場合は表示した方が良さげ
      this.preloadScene.addEventListener(
        PlayMe.Scene.EventType.SHOW_COMPLETE, function(event) {
          console.debug(event);
        }, true);
      this._stage.addChild(this.preloadScene.container);
      this.preloadScene.show();

      this._currentScene.load();
    }
  }
};

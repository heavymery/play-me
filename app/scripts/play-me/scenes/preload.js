'use strict';

/**
 * @fileoverview Preload シーン（ローディング画面）を定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * 新しい Preload クラスのインスタンスを生成します。
 * @constructor
 * @extends {PlayMe.Scene}
 */
PlayMe.Scenes.Preload = function() {
  PlayMe.Scene.call(this, new PIXI.DisplayObjectContainer());

  this._loadingCircle;

  this._rotationTween;

  this._showTimeline;
};
PlayMe.Scenes.Preload.prototype = Object.create(PlayMe.Scene.prototype);
PlayMe.Scenes.Preload.prototype.constructor = PlayMe.Scenes.Preload;


/**
 * シーンで表示するデータおよび表示要素を初期化します。
 */
PlayMe.Scenes.Preload.prototype.load = function() {
  if(!this.isLoaded()) {
    this._assetLoader = new PIXI.AssetLoader([
      PlayMe.PIXI.getSuffixedImageUrl('images/loading-circle.png')
    ]);

    this._assetLoader.on('onComplete', function() {
      this._loadingCircle = new PIXI.Sprite(PlayMe.PIXI.getTexture('images/loading-circle.png'));
      this._loadingCircle.anchor.x = 0.5;
      this._loadingCircle.anchor.y = 0.5;
      this._loadingCircle.alpha = 0;

      this.container.addChild(this._loadingCircle);

      this._rotationTween = TweenMax.fromTo(this._loadingCircle, 1, { rotation: 0 }, { 
        rotation: (360) * Math.PI/180, 
        repeat: -1, repeatDelay: 0, ease: Linear.easeNone, 
        paused: true
      });

      this._showTimeline = new TimelineLite({ 
        paused: true,
        onStart: function() {
          this._rotationTween.play();
        }, onStartScope: this,
        onComplete: function() {
          this.dispatchShowCompleteEvent();
        }, onCompleteScope: this,
        onReverseComplete: function() {
          this._rotationTween.pause();
          this.dispatchHideCompleteEvent();
        }, onReverseCompleteScope: this 
      });

      this._showTimeline.add(TweenLite.fromTo(this._loadingCircle, 0.3, { alpha: 0 }, { alpha: 1, delay: 0.1 }), 0);

      this._showTimeline.add(TweenLite.fromTo(this._loadingCircle, 0.4, {
        x: window.innerWidth / 2, 
        y: window.innerHeight
      }, {
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2
      }), 0);

      this.dispatchLoadCompleteEvent();
    }.bind(this));

    this._assetLoader.load();
  }
};


/**
 * シーンの表示要素を表示します。
 */
PlayMe.Scenes.Preload.prototype.show = function() {
  this._showTimeline.play();
};


/**
 * シーンの表示要素を非表示します。
 */
PlayMe.Scenes.Preload.prototype.hide = function() {
  this._showTimeline.reverse();
};


/**
 * シーンの表示要素のレイアウトを更新します。
 */
PlayMe.Scenes.Preload.prototype.updateLayout = function() {

};

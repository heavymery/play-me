'use strict';

/**
 * @fileoverview TopMenu シーン（トップのメニュー画面）を定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * 新しい TopMenu クラスのインスタンスを生成します。
 * @constructor
 * @extends {PlayMe.Scene}
 */
PlayMe.Scenes.TopMenu = function() {
  PlayMe.Scene.call(this, new PIXI.DisplayObjectContainer());

  this._logo;

  this._slogan;

  this._soloButton;

  this._sessionButton;

  this._showTimeline;

};
PlayMe.Scenes.TopMenu.prototype = Object.create(PlayMe.Scene.prototype);
PlayMe.Scenes.TopMenu.prototype.constructor = PlayMe.Scenes.TopMenu;


/**
 * シーンで表示するデータおよび表示要素を初期化します。
 */
PlayMe.Scenes.TopMenu.prototype.load = function() {
  if(!this.isLoaded()) {
    this._assetLoader = new PIXI.AssetLoader([
      PlayMe.PIXI.getSuffixedImageUrl('images/logo.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/slogan.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/solo-button.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/session-button.png')
    ]);

    this._assetLoader.on('onComplete', function() {
      this._logo = new PIXI.Sprite(PlayMe.PIXI.getTexture('images/logo.png'));
      this._logo.anchor.x = 0.5;
      this._logo.anchor.y = 0.5;
      this._logo.alpha = 0;

      this._slogan = new PIXI.Sprite(PlayMe.PIXI.getTexture('images/slogan.png'));
      this._slogan.anchor.x = 0.5;
      this._slogan.anchor.y = 0.5;
      this._slogan.alpha = 0;

      this._soloButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/solo-button.png'));
      this._soloButton.alpha = 0;
      this._soloButton.click = this._soloButton.tap = function() {
        this.sceneManager.gotoScene('selectInstrument');
      }.bind(this);

      this._sessionButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/session-button.png'));
      this._sessionButton.alpha = 0;

      this.container.addChild(this._logo);
      this.container.addChild(this._slogan);
      this.container.addChild(this._soloButton);
      this.container.addChild(this._sessionButton);

      this._showTimeline = new TimelineLite({ 
        paused: true,
        onComplete: function() {
          this.dispatchShowCompleteEvent();
        }, onCompleteScope: this,
        onReverseComplete: function() {
            this.dispatchHideCompleteEvent();
          }, onReverseCompleteScope: this
        });

      this._showTimeline.add(TweenLite.fromTo(this._logo, 0.4, { 
        alpha: 0,
        x: window.innerWidth,
        y: 100
      }, { 
        alpha: 1,
        x: window.innerWidth / 2,
        y: 100,
      }), 'logoShow');

      this._showTimeline.add(TweenLite.fromTo(this._slogan, 0.3, { 
        alpha: 0,
        x: 0,
        y: 130
      }, { 
        alpha: 1,
        x: window.innerWidth / 2,
        y: 130
      }), 'logoShow+=0.3');

      this._showTimeline.add(TweenLite.fromTo(this._soloButton, 0.3, { 
        alpha: 0,
        x: window.innerWidth / 2,
        y: window.innerHeight
      }, { 
        alpha: 1,
        x: window.innerWidth / 2,
        y: window.innerHeight - 150
      }), 'soloButtonShow');

      this._showTimeline.add(TweenLite.fromTo(this._sessionButton, 0.3, { 
        alpha: 0,
        x: window.innerWidth / 2,
        y: window.innerHeight
      }, { 
        alpha: 1,
        x: window.innerWidth / 2,
        y: window.innerHeight - 100
      }),'soloButtonShow+=0.1');

      // 遅延テスト
      setTimeout(function() {
        this.dispatchLoadCompleteEvent();
      }.bind(this), 1000);
    }.bind(this));

    this._assetLoader.load();
  }
};


/**
 * シーンの表示要素を表示します。
 */
PlayMe.Scenes.TopMenu.prototype.show = function() {
  this._showTimeline.play();
};


/**
 * シーンの表示要素を非表示します。
 */
PlayMe.Scenes.TopMenu.prototype.hide = function() {
 this._showTimeline.reverse();
};


/**
 * シーンの表示要素のレイアウトを更新します。
 */
PlayMe.Scenes.TopMenu.prototype.updateLayout = function() {
  this._logo.x = window.innerWidth / 2;
  this._slogan.x = window.innerWidth / 2;
  this._soloButton.x = window.innerWidth / 2;
  this._soloButton.y = window.innerHeight - 150;
  this._sessionButton.x = window.innerWidth / 2;
  this._sessionButton.y = window.innerHeight - 100;
};

'use strict';

/**
 * @fileoverview SelectInstrument シーンを定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * 新しい SelectInstrument クラスのインスタンスを生成します。
 * @constructor
 * @extends {PlayMe.Scene}
 */
PlayMe.Scenes.SelectInstrument = function() {
  PlayMe.Scene.call(this, new PIXI.DisplayObjectContainer());

  this._title;

  this._guitarButton;

  this._bassButton;

  this._drumButton;

  this._keyboardButton;

  this._backButton;

  this._showTimeline;

};
PlayMe.Scenes.SelectInstrument.prototype = Object.create(PlayMe.Scene.prototype);
PlayMe.Scenes.SelectInstrument.prototype.constructor = PlayMe.Scenes.SelectInstrument;


/**
 * シーンで表示するデータおよび表示要素を初期化します。
 */
PlayMe.Scenes.SelectInstrument.prototype.load = function() {
  if(!this.isLoaded()) {
    this._assetLoader = new PIXI.AssetLoader([
      PlayMe.PIXI.getSuffixedImageUrl('images/select-instrument-title.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/select-instrument-guitar.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/select-instrument-bass.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/select-instrument-drum.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/select-instrument-keyboard.png'),
      PlayMe.PIXI.getSuffixedImageUrl('images/back-button.png')
    ]);

    this._assetLoader.on('onComplete', function() {
      this._title = new PIXI.Sprite(PlayMe.PIXI.getTexture('images/select-instrument-title.png'));
      this._title.anchor.x = 0.5;
      this._title.anchor.y = 0.5;
      this._title.alpha = 0;

      this._guitarButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/select-instrument-guitar.png'));
      this._guitarButton.anchor.x = 0.5;
      this._guitarButton.anchor.y = 0.5;
      this._guitarButton.alpha = 0;
      this._guitarButton.click = this._guitarButton.tap = function() {
        this.sceneManager.gotoScene('playGuitar');
      }.bind(this);

      this._bassButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/select-instrument-bass.png'));
      this._bassButton.anchor.x = 0.5;
      this._bassButton.anchor.y = 0.5;
      this._bassButton.alpha = 0;
      this._bassButton.click = this._bassButton.tap = function() {
        this.sceneManager.gotoScene('playBass');
      }.bind(this);

      this._drumButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/select-instrument-drum.png'));
      this._drumButton.anchor.x = 0.5;
      this._drumButton.anchor.y = 0.5;
      this._drumButton.alpha = 0;
      this._drumButton.click = this._drumButton.tap = function() {
        this.sceneManager.gotoScene('playDrum');
      }.bind(this);

      this._keyboardButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/select-instrument-keyboard.png'));
      this._keyboardButton.anchor.x = 0.5;
      this._keyboardButton.anchor.y = 0.5;
      this._keyboardButton.alpha = 0;
      this._keyboardButton.click = this._keyboardButton.tap = function() {
        this.sceneManager.gotoScene('playKeyboard');
      }.bind(this);


      this._backButton = PlayMe.PIXI.getTextureButton(PlayMe.PIXI.getTexture('images/back-button.png'));
      this._backButton.anchor.x = 0.5;
      this._backButton.anchor.y = 0.5;
      this._backButton.alpha = 0;
      this._backButton.click = this._backButton.tap = function() {
        this.sceneManager.gotoScene('topMenu');
      }.bind(this);


      this.container.addChild(this._title);
      this.container.addChild(this._guitarButton);
      this.container.addChild(this._bassButton);
      this.container.addChild(this._drumButton);
      this.container.addChild(this._keyboardButton);
      this.container.addChild(this._backButton);


      this._showTimeline = new TimelineLite({ 
        paused: true,
        onComplete: function() {
          this.dispatchShowCompleteEvent();
        }, onCompleteScope: this,
        onReverseComplete: function() {
            this.dispatchHideCompleteEvent();
          }, onReverseCompleteScope: this
        });

      this._showTimeline.add(TweenLite.fromTo(this._title, 0.4, { 
        alpha: 0,
        x: window.innerWidth / 2,
        y: 25
      }, { 
        alpha: 1,
        x: window.innerWidth / 2,
        y: 50,
      }), 'titleShow');

      this._showTimeline.add(TweenLite.fromTo(this._guitarButton, 0.3, { 
        alpha: 0,
        rotation: 0, 
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }, { 
        alpha: 1,
        rotation: (360 * 4) * Math.PI/180, 
        x: window.innerWidth / 2 - window.innerWidth / 5,
        y: window.innerHeight / 2 - window.innerWidth / 5
      }), 'guitarShow');

      this._showTimeline.add(TweenLite.fromTo(this._bassButton, 0.3, { 
        alpha: 0,
        rotation: 0, 
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }, { 
        alpha: 1,
        rotation: (-360 * 4) * Math.PI/180, 
        x: window.innerWidth / 2 + window.innerWidth / 5,
        y: window.innerHeight / 2 - window.innerWidth / 5
      }), 'guitarShow+=0.1');

      this._showTimeline.add(TweenLite.fromTo(this._drumButton, 0.3, { 
        alpha: 0,
        rotation: 0, 
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }, { 
        alpha: 1,
        rotation: (360 * 4) * Math.PI/180, 
        x: window.innerWidth / 2 - window.innerWidth / 5,
        y: window.innerHeight / 2 + window.innerWidth / 5
      }), 'guitarShow+=0.2');

      this._showTimeline.add(TweenLite.fromTo(this._keyboardButton, 0.3, { 
        alpha: 0,
        rotation: 0, 
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }, { 
        alpha: 1,
        rotation: (-360 * 4) * Math.PI/180, 
        x: window.innerWidth / 2 + window.innerWidth / 5,
        y: window.innerHeight / 2 + window.innerWidth / 5
      }), 'guitarShow+=0.3');

        this._showTimeline.add(TweenLite.fromTo(this._backButton, 0.3, { 
          alpha: 0,
          x: window.innerWidth / 2,
          y: window.innerHeight - 25
        }, { 
          alpha: 1,
          x: window.innerWidth / 2,
          y: window.innerHeight - 50
        }));


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
PlayMe.Scenes.SelectInstrument.prototype.show = function() {
  this._showTimeline.play();
};


/**
 * シーンの表示要素を非表示します。
 */
PlayMe.Scenes.SelectInstrument.prototype.hide = function() {
  this._showTimeline.reverse();
};


/**
 * シーンの表示要素のレイアウトを更新します。
 */
PlayMe.Scenes.SelectInstrument.prototype.updateLayout = function() {
  this._title.x = window.innerWidth / 2;
  this._guitarButton.x = window.innerWidth / 2 - window.innerWidth / 5;
  this._guitarButton.y = window.innerHeight / 2 - window.innerWidth / 5;
  this._bassButton.x = window.innerWidth / 2 + window.innerWidth / 5;
  this._bassButton.y = window.innerHeight / 2 - window.innerWidth / 5;
  this._drumButton.x = window.innerWidth / 2 - window.innerWidth / 5;
  this._drumButton.y = window.innerHeight / 2 + window.innerWidth / 5;
  this._keyboardButton.x = window.innerWidth / 2 + window.innerWidth / 5;
  this._keyboardButton.y = window.innerHeight / 2 + window.innerWidth / 5;
  this._backButton.x = window.innerWidth / 2;
  this._backButton.y = window.innerHeight - 50;
};

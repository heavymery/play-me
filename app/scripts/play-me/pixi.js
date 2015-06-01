'use strict';

/**
 * @fileoverview PixiJS 用のヘルパー関数を定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


/**
 * 指定された画像 URL に、端末のピクセル比から解像度サフィックスを付けて返します。
 * 端末ピクセル比が `2` 以上であれば `@2x` の様にサフィックスが付きます。
 * 端末ピクセル比が `1` の場合は何も付けません。
 * @param {string} imageUrl - 画像 URL (既に解像度サフィックスが付いても変換します)
 * @return {string} imageUrl - 解像度サフィックスが付いた画像 URL
 */
PlayMe.PIXI.getSuffixedImageUrl = function(imageUrl) {
  var match = imageUrl.match(/^([^@]+)(@\dx|)\.(png|jpg)$/);

  if(!match) {
    return imageUrl;
  } else {
    if(window.devicePixelRatio > 1) {
      return match[1] + '@' + window.devicePixelRatio + 'x' + '.' + match[3];
    } else {
      return match[1] + '.' + match[3];
    }
  }
};


/**
 * 指定された画像 URL から、端末のピクセル比に対応した Texture オブジェクトを返します。
 * @param {string} imageUrl - 画像 URL
 * @return {PIXI.Texture} Texture オブジェクト
 */
PlayMe.PIXI.getTexture = function(imageUrl) {
  var texture 
    = PIXI.Texture.fromImage(PlayMe.PIXI.getSuffixedImageUrl(imageUrl));
    
  texture.baseTexture.resolution = window.devicePixelRatio;

  return texture;
};


/**
 * Texture オブジェクトからボタン要素を生成して返します。
 * @param {PIXI.Texture} texture - 通常状態のボタンを表す Texture オブジェクト
 * @return {PIXI.Sprite} ボタン要素として設定された Sprite オブジェクト
 */
PlayMe.PIXI.getTextureButton = function(texture) {
  // TODO: ボタンの各状態を表す Texture も指定できる様にする

  var button = new PIXI.Sprite(texture);
  button.buttonMode = true;
  button.anchor.x = 0.5;
  button.anchor.y = 0.5;

  button.interactive = true;
  button.buttonMode = true;

  var hitWidth = texture.baseTexture.width / texture.baseTexture.resolution;
  var hitHeight = texture.baseTexture.height / texture.baseTexture.resolution;

  button.hitArea = new PIXI.Rectangle(- hitWidth / 2, - hitHeight / 2, hitWidth, hitHeight);

  button.mousedown = button.touchstart = function() {
    TweenLite.to(button.scale, 0.15, { x: 0.95, y: 0.95 });
  };

  button.mouseup = button.touchend = button.mouseupoutside = button.touchendoutside = function() {
    TweenLite.to(button.scale, 0.15, { x: 1, y: 1 });
  };

  button.mouseover = function() {
    TweenLite.to(button.scale, 0.15, { x: 1.05, y: 1.05 });
  };

  button.mouseout = function() {
    TweenLite.to(button.scale, 0.15, { x: 1, y: 1 });
  };

  return button;
};

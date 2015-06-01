'use strict';

/**
 * @fileoverview Web Audio API の良く使う AudioNodes を組み合わせた Player クラスを定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


 /**
 * 新しい Player クラスのインスタンスを生成します。
 * @constructor
 * @extends {PlayMe.EventDispatcher}
 */
PlayMe.WebAudio.Player = function() {

};
PlayMe.WebAudio.Player.prototype = Object.create(PlayMe.EventDispatcher.prototype);
PlayMe.WebAudio.Player.prototype.constructor = PlayMe.WebAudio.Player;

'use strict';

/**
 * @fileoverview Web Audio API を使った Syntehsizer クラスを定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */

 // TODO: シンセサイザーって種類が多いから、まず何系シンセサイザーにするか決めないと...

//------------------------------------------------------------------------------
//
//  Class & Properties
//
//------------------------------------------------------------------------------

 /**
 * 新しい Syntehsizer クラスのインスタンスを生成します。
 * @constructor
 * @extends {PlayMe.EventDispatcher}
 */
PlayMe.WebAudio.Synthesizer = function(audioContext, destination) {

  this.audioContext = audioContext;

  this.destination = null;

  if(destination) {
    this.destination = destination;
  } else {
    this.destination = this.audioContext.destination;
  }

  this._audios = {};
};
PlayMe.WebAudio.Synthesizer.prototype = Object.create(PlayMe.EventDispatcher.prototype);
PlayMe.WebAudio.Synthesizer.prototype.constructor = PlayMe.WebAudio.Synthesizer;

//------------------------------------------------------------------------------
//
//  Methods 
//
//------------------------------------------------------------------------------


PlayMe.WebAudio.Synthesizer.prototype.noteOn = function(note, octave, velocity) {
  if(typeof velocity === 'undefined') { velocity = 1; }
  
  var gain = this.audioContext.createGain();
  gain.gain.value = velocity;
  gain.connect(this.destination);

  var noteNumber = PlayMe.WebAudio.getNoteNumber(note, octave);
  
  if(this._audios[noteNumber]) {
     this._audios[noteNumber].stop(0);
   }

  this._audios[noteNumber] = this.audioContext.createOscillator();
  //this._oscillator.type = 'triangle';
  this._audios[noteNumber].frequency.value = PlayMe.WebAudio.getHertz(note, octave);
  this._audios[noteNumber].connect(gain);

  this._audios[noteNumber].start(0);
};


PlayMe.WebAudio.Synthesizer.prototype.noteOff = function(note, octave) {
  var noteNumber = PlayMe.WebAudio.getNoteNumber(note, octave);
  
  if(this._audios[noteNumber]) {
    this._audios[noteNumber].stop(0);
  }
};

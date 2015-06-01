'use strict';

/**
 * @fileoverview Web Audio API を便利に使う為のヘルパー関数を定義します。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


 /**
 * 指定した音名の周波数を返します。
 * @param {string} note - 音名（A4, A#4, B4 ...）
 * @param {number} octave - オクターブ番号（0, 1, 2 ...）
 * @return {number}
 */
PlayMe.WebAudio.getHertz = function(note, octave) {
  // A4(69) からの距離
  var noteNumber = PlayMe.WebAudio.getNoteNumber(note, octave);
  var distance = noteNumber - 69;

  // A4(440) を基準に周波数を計算;
  var hertz = 440 * Math.pow(2, distance / 12);
  
  return hertz;
};

/**
 * 指定した音名のノート番号を返します。
 * @param {string} note - 音名（A4, A#4, B4 ...）
 * @param {number} octave - オクターブ番号（0, 1, 2 ...）
 * @return {number}
 */
PlayMe.WebAudio.getNoteNumber = function(note, octave) {
  if(typeof octave !== 'number') { octave = parseInt(octave); }
  
  var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // C -1 =  0  C 4 = 60
  // C#-1 =  1  C#4 = 61
  // D -1 =  2  D 4 = 62
  // D#-1 =  3  D#4 = 63
  // E -1 =  4  E 4 = 64
  // F -1 =  5  F 4 = 65
  // F#-1 =  6  F#4 = 66
  // G -1 =  7  G 4 = 67
  // G#-1 =  8  G#4 = 68
  // A -1 =  9  A 4 = 69
  // A#-1 = 10  A#4 = 70
  // B -1 = 11  B 4 = 71
  // C  0 = 12  C 5 = 72

  var noteIndex = notes.indexOf(note.toUpperCase());

  if(noteIndex < 0) {
    throw new Error('\'' + note + '\' is unknown note.');
  }

  var noteNumber = noteIndex + (12 * (octave + 1));

  return noteNumber;
};

/**
 * 指定したコードを構成する音名の配列を返します。
 */
PlayMe.WebAudio.getChordNotes = function(chrod) {

};


/**
 * 指定したスケールを構成する音名の配列を返します。
 */
PlayMe.WebAudio.getScaleNotes = function(scale) {

};

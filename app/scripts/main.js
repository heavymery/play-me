'use strict';

/**
 * @fileoverview PlayMe のメインスクリプト（エントリポイント）です。
 *
 * @author heavymery@gmail.com (Shindeok Kang)
 */


(function() {

  // Canvas を生成
  var canvas = document.createElement('canvas');
  document.getElementById('canvas-container').appendChild(canvas);

  // PixiJS レンダラーを初期化（Canvas のサイズが「スクリーンサイズ x 端末のピクセル比」になる）
  var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {view: canvas, resolution: window.devicePixelRatio});

  // 端末のピクセル比に合わせて Canvas 縮小
  if(navigator.isCocoonJS) {
    // ScreenCanvas（Canvas+ 用の爆速 Canvas）を オン
    canvas.screencanvas = true;
    // CocoonJS ならこれでスクリーンにフィットされる
    canvas.style.cssText = 'idtkscale:ScaleToFill';
  } else {
    // ブラウザでは CSS Transform で縮小させる
    var canvasScale = 1 / window.devicePixelRatio;
    canvas.style.webkitTransform = 'scale3d(' + canvasScale + ',' + canvasScale + ',' + canvasScale + ')';
    canvas.style.webkitTransformOrigin = '0 0';
    canvas.style.transform = 'scale3d(' + canvasScale + ',' + canvasScale + ',' + canvasScale + ')';
    canvas.style.transformOrigin = '0 0';
  }
  
  // PixiJS ステージ生成（ここに追加された要素が画面に表示される）
  var stage = new PIXI.Stage(0x000000);

  // 毎フレームごとに画面を描画
  var animate = function() {
    window.requestAnimFrame(animate);
    renderer.render(stage);
  };
  animate();


//   // シーン管理オブジェクトを生成
//   var sceneManager = new PlayMe.SceneManager(stage);

//   // TODO: PlayMe で使われるシーンを登録
//   sceneManager.addScene('topMenu', new PlayMe.Scenes.TopMenu());
// //   ...

//   // プレローディング用のシーンを設定
//   sceneManager.preloadScene = new PlayMe.Scenes.Preload();
  
//   // デバッグ用（シーンが正常に切り替わったらログが出力される）
//   sceneManager.addEventListener(PlayMe.SceneManager.EventType.SCENE_CHANGED, function(event) {
//     console.debug(event);
//   });

//   // プレローディング用のシーンがロードされたら最初のシーン表示
//   sceneManager.preloadScene.addEventListener(
//    PlayMe.Scene.EventType.LOAD_COMPLETE, function() {

    if(showSplashScreen) {
      // ブラウザで実行される時はスプラッシュスクリーンを非表示してから
      
      var fadeTime = 600; // スプラッシュスクリーンのフェードアウト時間
      var displayTime = 600; // スプラッシュスクリーンを表示させる最低限の時間

      // スクリプトが既にキャッシュされてたらスプラッシュスクリーンが一瞬で消えてしまうのでちょっと待たせる
      var splashDelay = displayTime + fadeTime - (Date.now() - window.splashImageShownTime);

      setTimeout(function() {
        document.getElementById('splash-screen').classList.add('hide');

        setTimeout(function() {
          document.body.removeChild(document.getElementById('splash-screen'));
//           sceneManager.gotoScene('topMenu');
        }, fadeTime);
      }, splashDelay);
    } else {
      sceneManager.gotoScene('topMenu');
    }

//    }.bind(this));

//   // プレローディング用のシーンをロード
//   sceneManager.preloadScene.load();

  var updateLayoutTimer;

  // Window がリサイズされた時の処理
  window.addEventListener('resize', function() {
    console.debug('window.resize');

    // PixiJS のレンダラーをスクリーンサイズにフィット
    renderer.resize(window.innerWidth, window.innerHeight);

    // TODO: SceneManager に持たせて方が良い？
    if(updateLayoutTimer) {
      clearTimeout(updateLayoutTimer);
    }

    updateLayoutTimer = setTimeout(function() {
//       console.debug('updateLayout');
      if(sceneManager.getCurrentScene()) {
        sceneManager.getCurrentScene().updateLayout();
      }
    }, 100);
  }, false);


  // 画面向きが変わった時の処理
  window.addEventListener('window.orientationchange', function() {
    if(90 === window.orientation || -90 === window.orientation) {
      console.debug('window.orientationchange(landscape)');

      // TODO: CocoonJS では Landcape を検知できない？

      // iOS Safari の Landcape バグ対応
      document.body.scrollTop = 0;
    } else {
      console.debug('window.orientationchange(portrait)');
    }

    // PixiJS のレンダラーをスクリーンサイズにフィット
    renderer.resize(window.innerWidth, window.innerHeight);

    // TODO: SceneManager に持たせて方が良い？
    if(updateLayoutTimer) {
      clearTimeout(updateLayoutTimer);
    }

    updateLayoutTimer = setTimeout(function() {
//       console.debug('updateLayout');
      if(sceneManager.getCurrentScene()) {
        sceneManager.getCurrentScene().updateLayout();
      }
    }, 100);

  }, false);

})();

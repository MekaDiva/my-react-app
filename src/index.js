import App from './app';
import gsap from 'gsap';
import config from './config';

export default class Playable {

  constructor() {

    let app = new App();
    config.app = app;


    /////////////////////////
    //    FOR ICE CREAM    //
    /////////////////////////


    if (!window._gameplayEvents || !window._gameplay) {


      window._gameplayEvents = {};
      window._gameplay = {};

      //START
      gsap.delayedCall(.5, app.init);

      //for test
      config.iceCreamApi.ground_color = 0x7d493d;

      gsap.delayedCall(3, app.reset);


    } else {

      // console.log = () => { };
      // console.warn = () => { };

    }


    window._gameplayEvents.initGame = app.init; // 1 just in the first launch
    window._gameplayEvents.startGame = app.reset; // 2 
    window._gameplayEvents.playableResize = app.playableResize;
    window._gameplayEvents.startLevel = app.startLevel; // 3 
    window._gameplayEvents.paused = app.pause;

    ////////////////////////////

  }

}

//Launch
new Playable();
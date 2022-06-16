import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls';
import Stats from '../lib/stats.module';
import { gsap } from 'gsap';
import assets from './assets';
import config from '../config';
import tools from '../tools';

const FPS = 60;
const DEBUG = false;
const INFOR = true;
const GRAVITY_COEF = 2;

export default class App extends THREE.EventDispatcher {

    constructor() {

        super();

        this.init = this.init.bind(this);
        this.reset = this.reset.bind(this);
        this.playableResize = this.playableResize.bind(this);
        this.startLevel = this.startLevel.bind(this);
        this.pause = this.pause.bind(this);
    }

    init() {
        console.log('initGame::init');

        document.backgroundColor = "#000000"

        document.body.style.margin = 0;
        document.body.style.display = "block";
        document.body.style["background-color"] = "#000";
        document.body.style.color = "#fff";
        document.body.style.overflow = "hidden";

        config.fps = FPS;
        config.garvityCoef = GRAVITY_COEF;

        // Needed for assets Equirectangular texture compile 
        config.renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // FOR ICE CREAM
        window._gameplay && (window._gameplay.isInit = true);


    }

    reset() {
        console.log('resetGame::reset');
    }

    playableResize() {
        console.log('playableResize::playableResize');
    }

    startLevel() {
        console.log('startLevel::startLevel');
    }

    pause() {
        console.log('pause::pause');
    }
}
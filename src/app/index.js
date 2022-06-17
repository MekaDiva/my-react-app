import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls';
import Stats from '../lib/stats.module';
import { gsap } from 'gsap';
import assets from './assets';
import config from '../config';
import tools from '../tools';

const FPS = 60;
const DEBUG = true;
const INFOS = true;
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


    /**
     *Initialize the App
     * @memberof App
     */
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

        // Add basic configuration from icCream
        this.updateConfigurableValues();

        // Initialize the 3D scene
        this.init3D();
    }


    /**
     * Add basic configuration from icCream
     * @memberof App
     */
    updateConfigurableValues() {

        console.log("APP::updateConfigurableValues");

        if (!window._gameplay.creative) {

            config.iceCream.ground_color = config.iceCreamApi.ground_color;

            return;
        }

        // add config here
        config.iceCream.ground_color = window._gameplay.creative.ground_color;

    }


    /**
     * Initialize the 3D scene
     * @memberof App
     */
    init3D() {

        console.log("APP::init3D");
        
        // Configurate the renderer
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        // this.renderer.physicallyCorrectLights = true;
        document.body.appendChild(this.renderer.domElement);

        // Add the camera to the scene
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
        config.camera = this.camera;
        config.cameraTarget = this.focusPoint = new THREE.Vector3(0, .75, 0);
        this.camera.position.set(0, .75, 5);
        this.camera.lookAt(this.focusPoint);
        
        // Add the fog to the scene
        config.scene = this.scene = new THREE.Scene();
        this.scene.visible = false;
        this.scene.fog = new THREE.FogExp2(0x70e8ff, 0.02);
        this.scene.add(this.cameraContainer);
    
        // Add the ambientLight to the scene
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.ambientLight.intensity = .2;
        this.scene.add(this.ambientLight);
    
        // Add the directionalLight to the scene
        this.light = new THREE.DirectionalLight();
        this.light.target = this.targeLight;
        this.light.position.set(2, 8, 2);
        this.light.castShadow = true;
        this.light.intensity = .8;
        this.light.shadow.camera.top = 5;
        this.light.shadow.camera.bottom = -5;
        this.light.shadow.camera.left = -5;
        this.light.shadow.camera.right = 5;
        this.light.shadow.camera.near = 0.01;
        this.light.shadow.camera.far = 20;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.radius = 3;
        this.light.shadow.bias = -0.001;
        config.light = this.light;

        // Add the orbit control to the scene
        this._orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this._orbitControls.target = this.focusPoint;
        this._orbitControls.maxPolarAngle = tools.DEG2RAD * 95;
        this._orbitControls.enableDamping = true;
        this._orbitControls.dampingFactor = .2;
        
        if (DEBUG) {
          // this.scene.add(new CameraHelper(this.light.shadow.camera));
        }
    
        if (INFOS) {
          this.stats = new Stats();
          document.body.appendChild(this.stats.dom);
          this.nbpolyDiv = document.createElement("div");
          this.nbpolyDiv.style.position = "absolute";
          this.nbpolyDiv.style.bottom = "20px";
          this.nbpolyDiv.style["font-family"] = "arial";
          this.nbpolyDiv.style["text-shadow"] = "0px 1px black, 1px 0px black, 1px 1px black, 0px 0px black";
          document.body.appendChild(this.nbpolyDiv);
          this.drawDiv = document.createElement("div");
          document.body.appendChild(this.drawDiv);
          this.drawDiv.style.position = "absolute";
          this.drawDiv.style.bottom = "5px";
          this.drawDiv.style["font-family"] = "arial";
          this.drawDiv.style["text-shadow"] = "0px 1px black, 1px 0px black, 1px 1px black, 0px 0px black";
        }
    
    
    
        //START ENGINE
        gsap.ticker.add(this.update);
        gsap.ticker.fps(FPS);
    
    
    }


    /**
     * Reset the App
     * @memberof App
     */
    reset() {
        console.log('resetGame::reset');
    }


    /**
     * Invoke once the user resize the game
     * @memberof App
     */
    playableResize() {
        console.log('playableResize::playableResize');
    }


    /**
     * Start the level of the game
     * @memberof App
     */
    startLevel() {
        console.log('startLevel::startLevel');
    }


    /**
     * Pause the App
     * @memberof App
     */
    pause() {
        console.log('pause::pause');
    }
}
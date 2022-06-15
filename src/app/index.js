

import { Object3D, Vector2, Vector3, PerspectiveCamera, Scene, AmbientLight, DirectionalLight, WebGLRenderer, CameraHelper, FogExp2, EventDispatcher, PCFSoftShadowMap } from 'three';
import { OrbitControls } from 'lib/OrbitControls';
import Stats from 'lib/stats.module';
import { gsap } from 'gsap';
import config from 'config';
import Stage from './modules/levels/stage';
import assets from './assets';
import tools from 'tools';
import * as CANNON from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger'
import UI from 'lib/UI';

const FPS = 60;
const DEBUG = true;
const CANNON_DEBUG = true;
const INFOS = true;
const GRAVITY_COEF = 2;

export default class App extends EventDispatcher {

  constructor() {

    super();

    this.init = this.init.bind(this);
    this.build = this.build.bind(this);
    this.update = this.update.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onMove = this.onMove.bind(this);
    this.playableResize = this.playableResize.bind(this);
    this.initPhysics = this.initPhysics.bind(this);
    this.reset = this.reset.bind(this);
    this.initStage = this.initStage.bind(this);
    this.pause = this.pause.bind(this);


    this.delta = 1;
    this.__appReady = false;
    this.__endGame = false;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.stats = null;
    this.light = null;
    this.hemiLight = null;
    this._isDown = false;
    this.__paused = false;
    this.__width = null;
    this.__height = null;
    this._orbitControls = null;
    this.focusPoint = null;
    this.targeLight = new Object3D();
    this.fixedTimeStep = null;
    this.stage = null;
    this.viewSize = new Vector3();
    this.uiDepth = -10;

    

  }






  init() {


    console.log("initGame::init");

    document.backgroundColor = "#000000"

    document.body.style.margin = 0;
    document.body.style.display = "block";
    document.body.style["background-color"] = "#000";
    document.body.style.color = "#fff";
    document.body.style.overflow = "hidden";

    config.fps = FPS;
    config.garvityCoef = GRAVITY_COEF;

    // Needed for assets Equirectangular texture compile 
    config.renderer = this.renderer = new WebGLRenderer({ antialias: true });

    // FOR ICE CREAM
    window._gameplay && (window._gameplay.isInit = true);

    assets.addEventListener("ready", this.build);
    assets.load();


  }




  build() {

    console.log("APP::BUILD");

    this.updateConfigurableValues();

    this.init3D();

    this.init2D();

    this.initEvents();

    this.initPhysics();

    this.playableResize();

    this.initStage();

  }







  updateConfigurableValues() {

    console.log("APP::updateConfigurableValues");


    if (!window._gameplay.creative) {

      config.iceCream.ground_color = config.iceCreamApi.ground_color;

      return;
    }

    //
    // add config here
    config.iceCream.ground_color = window._gameplay.creative.ground_color;

  }






  init3D() {

    console.log("APP::init3D");
    config.cameraContainer = this.cameraContainer = new Object3D();

    this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    config.camera = this.camera;
    config.cameraTarget = this.focusPoint = new Vector3(0, .75, 0);
    this.camera.position.set(0, .75, 5);
    this.camera.lookAt(this.focusPoint);
    this.cameraContainer.add(this.camera);

    config.scene = this.scene = new Scene();
    this.scene.visible = false;
    this.scene.fog = new FogExp2(0x70e8ff, 0.02);
    this.scene.add(this.cameraContainer);


    this.ambientLight = new AmbientLight(0xffffff);
    this.ambientLight.intensity = .2;
    this.scene.add(this.ambientLight);



    this.light = new DirectionalLight();
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


    this.cameraContainer.add(this.light);
    this.cameraContainer.add(this.light.target);


    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMap.enabled = true;
    // this.renderer.physicallyCorrectLights = true;
    document.body.appendChild(this.renderer.domElement);


    //DEBUG

    if (DEBUG) {

      // this.scene.add(new CameraHelper(this.light.shadow.camera));

      this._orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this._orbitControls.target = this.focusPoint;
      this._orbitControls.maxPolarAngle = tools.DEG2RAD * 95;
      this._orbitControls.enableDamping = true;
      this._orbitControls.dampingFactor = .2;

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




  init2D() {

    config.ui = new UI(this.camera);


  }





  initEvents() {

    console.log("APP::initEvents");

    this.renderer.domElement.addEventListener('touchstart', this.onDown, false);
    this.renderer.domElement.addEventListener('touchend', this.onUp, false);
    this.renderer.domElement.addEventListener('touchmove', this.onMove, false);
    this.renderer.domElement.addEventListener('mousedown', this.onDown, false);
    this.renderer.domElement.addEventListener('mouseup', this.onUp, false);
    this.renderer.domElement.addEventListener('mousemove', this.onMove, false);


    window.addEventListener('resize', this.playableResize, false);
    window.addEventListener("orientationchange", this.playableResize, false);


  }







  setMouse(event) {

    if (event.touches) {
      config.mouse.x = event.touches[0].clientX;
      config.mouse.y = event.touches[0].clientY;

      config.mouse3d.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      config.mouse3d.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    } else {
      config.mouse.x = event.clientX;
      config.mouse.y = event.clientY;

      config.mouse3d.x = (event.clientX / window.innerWidth) * 2 - 1;
      config.mouse3d.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }


  }





  onDown(event) {

    event.preventDefault();
    this.setMouse(event);

    this._isDown = true;
    this.dispatchEvent({ type: "mousedown" });

  }









  onUp(event) {
    //event.preventDefault();

    this._isDown = false;
    this.dispatchEvent({ type: "mouseup" });

  }







  onMove(event) {

    this.setMouse(event);
    this._isDown && this.dispatchEvent({ type: "mousemove" });


  }








  initPhysics() {

    config.physic.world = new CANNON.World();
    config.physic.world.gravity.set(0, -9.82 * GRAVITY_COEF, 0); // m/s²
    // config.physic.world.allowSleep = true;
    this.fixedTimeStep = 1.0 / FPS; // seconds
    this.maxSubSteps = 10;
    // config.physic.world.solver.iterations = 20;

    CANNON_DEBUG && cannonDebugger(this.scene, config.physic.world.bodies);


  }









  playableResize(size) {


    console.log("APP::playableResize");

    this.__width = size && size.width ? size.width : window.innerWidth;
    this.__height = size && size.height ? size.height : window.innerHeight;

    if (this.camera) {
      this.camera.aspect = this.__width / this.__height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.__width, this.__height);
    }

    //Force iOS view resize 
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 500);


  }




  pause(paused) {
    this.__paused = paused;
  }




  initStage() {

    console.log("APP::initStage");

    this.stage = new Stage();

    gsap.delayedCall(.2, () => {


      // Add content

      this.scene.add(this.stage);

      //

      this.__appReady = true;

      gsap.delayedCall(.3, () => {

        this.scene.background = assets.textures.skyMap;
        this.scene.visible = true;
        // FOR ICE CREAM
        document.getElementById('loading') && (document.getElementById('loading').style.display = "none");
      });


    });



  }







  reset() {

    console.log("startGame from api");

    if (!config.firstLaunch) {

      console.log("startGame::reset");

      this.__appReady = false;

      config.ui.dispose();

      if (config.physic.world) {
        //Clean Physics
        while (config.physic.world.bodies.length > 0) {
          config.physic.world.removeBody(config.physic.world.bodies[0]);
        }
        console.log("world.bodies:", config.physic.world.bodies);
      }


      this.updateConfigurableValues();

      this.stage && this.stage.dispose();

      gsap.delayedCall(1.1, () => {
        // REBUILD LEVEL FROM SCRATCH
        this.stage = new Stage();
        this.scene.add(this.stage);
        gsap.delayedCall(.5, this.stage.startGame);

      });

      gsap.delayedCall(.5, () => {
        this.__appReady = true;
        this.__endGame = false;
      });


    } else {


      gsap.delayedCall(.5, () => {
        this.__appReady = true;
        this.stage && this.stage.startGame();
      });

    }

    config.firstLaunch = false;


  }








  update(a, b, c, time) {

    this.delta = b / 17;

    if (!this.__appReady) {
      return;
    }

    // FOR ICE CREAM
    if (this.__paused) {
      return;
    }


    tools.getViewSize(this.uiDepth, this.camera, this.viewSize);
    config.ui.z = this.viewSize.z;

    this.stage && this.stage.update(this.delta, this.viewSize);

    //Debug
    this._orbitControls && this._orbitControls.update();
    this.stats && this.stats.update();
    this.nbpolyDiv && (this.nbpolyDiv.innerText = (this.renderer.info.render.triangles - (this.scene.background != null ? 12 : 0)) + " tri");
    this.drawDiv && (this.drawDiv.innerText = (this.renderer.info.render.calls - (this.scene.background != null ? 1 : 0)) + " call");
    //


    this.renderer && this.renderer.render(this.scene, this.camera);


    // CANNONJS //////////

    if (config.physic.world) {
      let body;

      for (let i = 0; i < config.physic.world.bodies.length; i++) {

        body = config.physic.world.bodies[i];

        if (body.mesh) {
          body.mesh.position.copy(body.position);
          body.mesh.quaternion.copy(body.quaternion);
        }

      }
      config.physic.world.step(this.fixedTimeStep, b / 1000, this.maxSubSteps);
    }
    // END CANNONJS //////////

  }




}


import * as THREE from "three";
import { gsap } from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {Sky} from "three/examples/jsm/objects/Sky";
import Stats from "three/examples/jsm/libs/stats.module.js";
import Objects from "game/objects";
import Ui from "game/ui";

const skyFloorTexture = process.env.PUBLIC_URL + "/img/sky.jpg";



class Game extends THREE.EventDispatcher {
    constructor() {

        super();

        this.FPS = 60;
        this.totalNumberOfObjects = 4;

        this.init = this.init.bind(this);
        this.keypress = this.keypress.bind(this);
        this.update = this.update.bind(this);
        this.playableResize = this.playableResize.bind(this);
        this.reset = this.reset.bind(this);
        this.pause = this.pause.bind(this);

        this.switchLeft = this.switchLeft.bind(this);
        this.switchRight = this.switchRight.bind(this);

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.stats = null;
        this.indexPosition = 0;

        this.objectsGroup = null;
    }

    init() {
        console.log("init");

        // Document configuration
        document.backgroundColor = "#FFFFFF"
        document.body.style.margin = 0;
        document.body.style.display = "block";
        document.body.style["background-color"] = "#FFFFFF";
        document.body.style.color = "#fff";
        document.body.style.overflow = "hidden";

        // Scene configuration
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        // Light configuration
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(- 1, 1.75, 1);
        dirLight.position.multiplyScalar(30);
        this.scene.add(dirLight);

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 10;

        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        dirLight.shadow.camera.far = 2500;
        dirLight.shadow.bias = 0.0001;

        // Renderer configuration
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.LinearToneMapping;
        document.body.appendChild(this.renderer.domElement);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(5, 5, 5);

        const axesHelper = new THREE.AxesHelper(3);
        this.scene.add(axesHelper);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.maxPolarAngle = Math.PI / 2;
        controls.target.set(0, 1, 0);
        controls.update();

        // Sky configuration
        // const skyTexture = new THREE.TextureLoader().load(skyFloorTexture);
        // this.scene.background = skyTexture;
        // this.scene.visible = true;

        // Add Sky
        const sky = new Sky();
        sky.scale.setScalar(450000);
        this.scene.add(sky);

        var sun = new THREE.Vector3();

        const effectController = {
            turbidity: 0.3,
            rayleigh: 0.5,
            mieCoefficient: 0.002,
            mieDirectionalG: 0.7,
            elevation: 45,
            azimuth: 180,
            exposure: 0.5,
        };

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );
        
        this.renderer.toneMappingExposure = effectController.exposure;

        // Add the stats ui
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Add the objectsGroup
        this.objectsGroup = new THREE.Group();

        // Add event handlers for the resize of window
        window.addEventListener('resize', this.playableResize, false);

        // Add event handlers for clicking
        document.addEventListener('keypress', this.keypress, false);

        // Init objects in the scene
        Objects.objectsInit();

        // Init ui in the scene
        Ui.uiInit();

        // Init physics in the scene


        //START ENGINE
        gsap.ticker.add(this.update);
        gsap.ticker.fps(this.FPS);
        //this.update();
    }

    keypress(e) {
        if (e.key == "a") {
            this.switchLeft();
        }

        if (e.key == "d") {
            this.switchRight();
        }
    }

    update() {

        // console.log("update");

        // requestAnimationFrame(this.update);

        this.stats.update();

        // Update objects in the scene
        Objects.objectsUpdate();

        this.renderer.render(this.scene, this.camera);
    }

    playableResize() {

        console.log("playableResize");

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        //Force iOS view resize 
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 500);
    }

    reset() {

        console.log("reset");

    }

    pause() {

        console.log("pause");

    }

    switchLeft() {
        console.log("Switch left");

        this.indexPosition -= 1;
        if (this.indexPosition <= -1) {
            this.indexPosition = 3;
        }
        gsap.to(this.objectsGroup.position, { duration: 0.5, x: (-3 * this.indexPosition), ease: "back" });

        // Add selection animation
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.2, y: 1, ease: "power2" });
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.7, y: 0.5, ease: "bounce" }).delay(0.2);
    }

    switchRight() {
        console.log("Switch right");

        this.indexPosition += 1;
        if (this.indexPosition >= this.totalNumberOfObjects) {
            this.indexPosition = 0;
        }
        gsap.to(this.objectsGroup.position, { duration: 0.5, x: (-3 * this.indexPosition), ease: "back" });

        // Add selection animation
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.2, y: 1, ease: "power2" });
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.7, y: 0.5, ease: "bounce" }).delay(0.2);
    }
}

export default new Game()
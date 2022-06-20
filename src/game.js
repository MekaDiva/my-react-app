import * as three from "three";
import { gsap } from 'gsap';
import { Sky } from "three/examples/jsm/objects/Sky";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default class Game extends three.EventDispatcher {
    constructor() {

        super();

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.playableResize = this.playableResize.bind(this);
        this.reset = this.reset.bind(this);
        this.pause = this.pause.bind(this);

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.stats = null;


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
        this.scene = new three.Scene();
        this.scene.background = new three.Color(0xa0a0a0);
        this.scene.fog = new three.Fog(0xa0a0a0, 10, 50);

        // Light configuration
        const hemiLight = new three.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        const dirLight = new three.DirectionalLight(0xffffff);
        dirLight.position.set(3, 10, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);

        // Ground configuration
        const floorMesh = new three.Mesh(new three.PlaneGeometry(100, 100), new three.MeshPhongMaterial({ color: 0xff0000, depthWrite: false }));
        floorMesh.rotation.x = - Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.scene.add(floorMesh);

        // // Create the skybox
        // const sky = new Sky();
        // sky.scale.setScalar(10000);
        // this.scene.add(sky);
        // // Set up variables to control the look of the sky
        // const skyUniforms = sky.material.uniforms;
        // skyUniforms['turbidity'].value = 10;
        // skyUniforms['rayleigh'].value = 2;
        // skyUniforms['mieCoefficient'].value = 0.005;
        // skyUniforms['mieDirectionalG'].value = 0.8;

        // Renderer configuration
        this.renderer = new three.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = three.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Camera
        this.camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(5, 5, 5);

        const axesHelper = new three.AxesHelper(3);
        this.scene.add(axesHelper);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.maxPolarAngle = Math.PI / 2;
        controls.target.set(0, 1, 0);
        controls.update();
        

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        window.addEventListener('resize', this.playableResize, false);

        const boxGeometry = new three.BoxGeometry(1, 1, 1);
        const material = new three.MeshBasicMaterial({ color: 0x00ffff });
        const mesh = new three.Mesh(boxGeometry, material);
        this.scene.add(mesh);

        //START ENGINE
        gsap.ticker.add(this.update);
        gsap.ticker.fps(60);
        //this.update();
    }

    update() {

        // console.log("update");

        // requestAnimationFrame(this.update);

        this.stats.update();

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

}
import * as THREE from "three";
import { gsap } from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import Objects from "game/objects";
import Ui from "game/ui";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";
const skyFloorTexture = process.env.PUBLIC_URL + "/img/sky.jpg";

const FPS = 60;
const totalNumberOfObjects = 4;

class Game extends THREE.EventDispatcher {
    constructor() {

        super();

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
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        const dirLight = new THREE.DirectionalLight(0xffffff);
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
        const floorTexture = new THREE.TextureLoader().load(pathFloorTexture);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1000, 1000);
        floorTexture.anisotropy = 16;
        floorTexture.encoding = THREE.sRGBEncoding;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture })
        const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), floorMaterial);
        floorMesh.rotation.x = - Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.scene.add(floorMesh);

        // Sky configuration
        const skyTexture = new THREE.TextureLoader().load(skyFloorTexture);
        this.scene.background = skyTexture;
        this.scene.visible = true;

        // Renderer configuration
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
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

        //START ENGINE
        gsap.ticker.add(this.update);
        gsap.ticker.fps(FPS);
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
        if (this.indexPosition >= totalNumberOfObjects) {
            this.indexPosition = 0;
        }
        gsap.to(this.objectsGroup.position, { duration: 0.5, x: (-3 * this.indexPosition), ease: "back" });

        // Add selection animation
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.2, y: 1, ease: "power2" });
        gsap.to(this.objectsGroup.children[this.indexPosition].position, { duration: 0.7, y: 0.5, ease: "bounce" }).delay(0.2);
    }
}

export default new Game()
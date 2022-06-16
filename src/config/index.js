import * as THREE from 'three';

class Config {
    constructor() {
        this.assets = process.env.PUBLIC_URL + "/assets";
        this.app = null;
        this.fps = 60;
        this.scene = null;
        this.renderer = null;
        this.garvityCoef = null;
        this.camera = null;
        this.light = null;
        this.mouse3d = null;
        this.cameraContainer = null;
        this.firstLaunch = true;
        this.physic = {};
        this.iceCreamApi = {};
        this.iceCream = {};
        this.mouse = new THREE.Vector2(-1, -1);
        this.mouse3d = new THREE.Vector2(0, 0);
    }
}

export default new Config();
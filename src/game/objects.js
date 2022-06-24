import * as THREE from "three";
import * as CANNON from 'cannon-es';
import Game from "../game";
import { Object3D } from "three";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";

export default class Objects extends Object3D {

    constructor() {

        super();

        this.removeElements = this.removeElements.bind(this);

        this.world = null;
        this.elementsContainer = new Object3D();
        this.add(this.elementsContainer);
        this.currentElements = [];

        this.init();
    }

    init() {
        console.log("objectsInit");

        // Init physics world
        this.world = new CANNON.World();
        this.world.gravity = new CANNON.Vec3(0, -9.82, 0); // m/s²

        this.fixedTimeStep = 1.0 / Game.FPS; // seconds
        this.maxSubSteps = 10;

        // Add ground
        const floorTexture = new THREE.TextureLoader().load(pathFloorTexture);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1000, 1000);
        floorTexture.anisotrophy = 16;
        floorTexture.encoding = THREE.sRGBEncoding;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture })
        const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), floorMaterial);
        floorMesh.rotation.x = - Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.add(floorMesh);

        // Add physics ground
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        })
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
        groundBody.position = new CANNON.Vec3(0, -0.5, 0);
        this.world.addBody(groundBody)


        // Create a sphere body
        const radius = 1 // m
        this.sphereBody = new CANNON.Body({
            mass: 5, // kg
            shape: new CANNON.Sphere(radius),
        })
        this.sphereBody.position.set(3, 10, 3); // m
        this.world.addBody(this.sphereBody);

        const phySphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
        const phySphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        phySphereMaterial.metalness = 0.5;
        this.phySphereMesh = new THREE.Mesh(phySphereGeometry, phySphereMaterial);
        this.phySphereMesh.castShadow = true;
        this.add(this.phySphereMesh);

        // Create a box body
        const size = 1 // m
        const halfExtents = new CANNON.Vec3(size, size, size);
        this.boxBody = new CANNON.Body({
            mass: 5, // kg
            shape: new CANNON.Box(halfExtents),
        })
        this.boxBody.position.set(3.55, 12, 3.5); // m
        this.world.addBody(this.boxBody);

        const phyBoxGeometry = new THREE.BoxGeometry(size, size, size);
        const phyBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        phyBoxMaterial.metalness = 0.5;
        this.phyBoxMesh = new THREE.Mesh(phyBoxGeometry, phyBoxMaterial);
        this.phyBoxMesh.castShadow = true;
        this.add(this.phyBoxMesh);
    }

    update() {
        // Run the simulation independently of framerate every 1 / 60 ms
        this.world.fixedStep();

        this.relateMeshToBody(this.phySphereMesh, this.sphereBody);
        this.relateMeshToBody(this.phyBoxMesh, this.boxBody);
    }

    relateMeshToBody(mesh, physicsBody) {
        mesh.position.copy(physicsBody.position);
        mesh.quaternion.copy(physicsBody.quaternion);
    }


    addElements(elements) {


        for (let i = 0; i < elements.length; i++) {

            const element = elements[i];

            const material = new THREE.MeshStandardMaterial({ color: element.color });
            material.metalness = 0.5;

            const mesh = new THREE.Mesh(element.geometry, material);
            mesh.position.copy(element.position);
            mesh.castShadow = true;
            this.elementsContainer.add(mesh);
            this.currentElements.push(mesh);

        }



    }



    removeElements() {
        // while (this.children.length > 0) {
        //     console.log(this.children[0])
        //     this.remove(this.children[0]);
        // }

        for (let i = 0; i < this.currentElements.length; i++) {

            this.elementsContainer.remove(this.currentElements[i]);
            // this.currentElements[i].material.dispose();
            // this.currentElements[i].geometry.dispose();
        }

    }




    get container() {
        return this.elementsContainer;
    }


}

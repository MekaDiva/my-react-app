import * as THREE from "three";
import * as CANNON from 'cannon-es';
import Game from "../game";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";

class Objects extends THREE.EventDispatcher {
    constructor() {

        super();

        this.world = null;

        this.objectsInit = this.objectsInit.bind(this);
        this.objectsUpdate = this.objectsUpdate.bind(this);
    }

    objectsInit() {
        console.log("objectsInit");

        // Init physics world
        this.world = new CANNON.World;
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
        Game.scene.add(floorMesh);

        // Add physics ground
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        })
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
        groundBody.position = new CANNON.Vec3(0, -0.5, 0);
        this.world.addBody(groundBody)

        // Add boxGeometry
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xbf2121 });
        boxMaterial.metalness = 0.5;
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(0, 0.5, 0);
        boxMesh.castShadow = true;
        //Game.scene.add(boxMesh);
        Game.objectsGroup.add(boxMesh);

        // Add sphereGeometry
        const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x307337 });
        sphereMaterial.metalness = 0.5;
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.set(3, 0.5, 0);
        sphereMesh.castShadow = true;
        //Game.scene.add(sphereMesh);
        Game.objectsGroup.add(sphereMesh);

        // Add coneGeometry
        const coneGeometry = new THREE.ConeGeometry(0.5, 1, 20);
        const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xbf9319 });
        coneMaterial.metalness = 0.5;
        const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
        coneMesh.position.set(6, 0.5, 0);
        coneMesh.castShadow = true;
        //Game.scene.add(coneMesh);
        Game.objectsGroup.add(coneMesh);

        // Add cylinderGeometry
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);
        const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x2331a8 });
        cylinderMaterial.metalness = 0.5;
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.position.set(9, 0.5, 0);
        cylinderMesh.castShadow = true;
        //Game.scene.add(cylinderMesh);
        Game.objectsGroup.add(cylinderMesh);

        Game.scene.add(Game.objectsGroup);

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
        Game.scene.add(this.phySphereMesh);

        // Create a box body
        const size = 1 // m
        const halfExtents = new CANNON.Vec3(size, size, size);
        this.boxBody = new CANNON.Body({
            mass: 5, // kg
            shape: new CANNON.Box(halfExtents),
        })
        this.boxBody.position.set(3.55 , 12, 3.5); // m
        this.world.addBody(this.boxBody);

        const phyBoxGeometry = new THREE.BoxGeometry(size, size, size);
        const phyBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        phyBoxMaterial.metalness = 0.5;
        this.phyBoxMesh = new THREE.Mesh(phyBoxGeometry, phyBoxMaterial);
        this.phyBoxMesh.castShadow = true;
        Game.scene.add(this.phyBoxMesh);
    }

    objectsUpdate() {
        // Run the simulation independently of framerate every 1 / 60 ms
        this.world.fixedStep();

        this.relateMeshToBody(this.phySphereMesh, this.sphereBody);  
        this.relateMeshToBody(this.phyBoxMesh, this.boxBody);
    }

    relateMeshToBody(mesh, physicsBody) {
        mesh.position.copy(physicsBody.position);
        mesh.quaternion.copy(physicsBody.quaternion);
    }
}

export default new Objects();
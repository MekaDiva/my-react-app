import * as THREE from "three";
import Game from "../game"

class Objects extends THREE.EventDispatcher {
    constructor() {

        super();

        this.objectsInit = this.objectsInit.bind(this);
    }

    objectsInit() {
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
    }
}

export default new Objects();
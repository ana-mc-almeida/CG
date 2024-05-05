import * as THREE from 'three';

var camera, scene, renderer;

var geometry, material, mesh;

function addFoundation(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(6, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLowerMast(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addTurntable(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHigherMast(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addJib(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 39);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, Math.PI/2, 0);
    obj.add(mesh);
}

function addCab(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addCounterweight(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addTowerPeak(obj, x, y, z) {
    'use strict';
    geometry = new THREE.TetrahedronGeometry(2, 0);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRightLoadLine(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(0.1, 0.1, 14.09, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, 0, 0.47*Math.PI);
    obj.add(mesh);
}

function addLeftLoadLine(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(0.1, 0.1, 8.16, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, 0, 0.56*Math.PI);
    obj.add(mesh);
}

function addHoist(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addSteelCable(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32); //1 depende de lambda
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(2, 2, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addHigherHook(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function addLowerHook(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI/2, 0, 0);
    obj.add(mesh);
}

function createLowerCrane(x, y, z) {
    'use strict';

    var lowerCrane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addFoundation(lowerCrane, 0, 3, 0);
    addLowerMast(lowerCrane, 0, 6+(20/2), 0);

    scene.add(lowerCrane);

    lowerCrane.position.x = x;
    lowerCrane.position.y = y;
    lowerCrane.position.z = z;
}

function createRotatingCrane(x, y, z) {
    'use strict';

    var rotatingCrane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTurntable(rotatingCrane, 0, 0.5, 0);
    addHigherMast(rotatingCrane, 0, 1+3, 0);
    addCab(rotatingCrane, 0, 1+3+0.5, 1+1);
    addJib(rotatingCrane, 11.5, 1+6+1, 0);
    addCounterweight(rotatingCrane, -5, 1+6+1-1, 0);
    addTowerPeak(rotatingCrane, 0, 1+6+2+1, 0);
    addRightLoadLine(rotatingCrane, 7, 1+6+2+1, 0);
    addLeftLoadLine(rotatingCrane, -4, 1+6+2+1, 0);

    scene.add(rotatingCrane);

    rotatingCrane.position.x = x;
    rotatingCrane.position.y = y;
    rotatingCrane.position.z = z;
}

function createMovingTrolley(x, y, z) {
    'use strict';

    var movingTrolley = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addHoist(movingTrolley, 0, -0.5, 0);
    addSteelCable(movingTrolley, 0, -1-0.5, 0); //-0.5 depende de lambda
    addHookBlock(movingTrolley, 0, -1-1-0.5, 0); //-1 depende de lambda
    addHigherHook(movingTrolley, 0, -1-1-1-0.5, 0.75);
    addHigherHook(movingTrolley, 0, -1-1-1-0.5, -0.75);
    addHigherHook(movingTrolley, 0.75, -1-1-1-0.5, 0);
    addHigherHook(movingTrolley, -0.75, -1-1-1-0.5, 0);
    addLowerHook(movingTrolley, 0, -1-1-1-1-0.5, 0.75);
    addLowerHook(movingTrolley, 0, -1-1-1-1-0.5, -0.75);
    addLowerHook(movingTrolley, 0.75, -1-1-1-1-0.5, 0);
    addLowerHook(movingTrolley, -0.75, -1-1-1-1-0.5, 0);

    scene.add(movingTrolley);

    movingTrolley.position.x = x;
    movingTrolley.position.y = y;
    movingTrolley.position.z = z;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function onKeyDown(e) {
    'use strict';

    // TODO
}

function onResize() {
    'use strict';

    // TODO
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    createLowerCrane(0, 0, 0);
    createRotatingCrane(0, 6+20, 0);
    createMovingTrolley(29, 6+20+6+1, 0);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    // TODO: fix camera position and add other cameras
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // TODO: update this
}

init();
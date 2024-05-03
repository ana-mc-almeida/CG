import * as THREE from 'three';

var camera, scene, renderer;

var geometry, material, mesh;

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
    // TODO
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
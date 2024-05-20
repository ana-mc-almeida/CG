import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, camera, renderer;

/////////////
/* Colours */
/////////////
var redColor = 0xff0000,
    greenColor = 0x00ff00,
    blueColor = 0x0000ff;

///////////////
/* Materials */
///////////////
var materialBaseCylinder,
    materialFirstRing,
    materialSecondRing,
    materialThirdRing;

/////////////
/* Objects */
/////////////
var baseCylinder; // FIXME - not sure if this is really needed

///////////
/* Sizes */
///////////
var baseCylinderRadius = 1,
    baseCylinderHeight = 10;
var firstRingInnerRadius = baseCylinderRadius,
    firstRingOuterRadius = 3,
    firstRingHeight = 2;
var secondRingInnerRadius = firstRingOuterRadius,
    secondRingOuterRadius = 5,
    secondRingHeight = firstRingHeight;
var thirdRingInnerRadius = secondRingOuterRadius,
    thirdRingOuterRadius = 7,
    thirdRingHeight = secondRingHeight;


////////////////////////
/* CREATE MATERIAL(S) */
////////////////////////
function createMaterial(color) {
    return new THREE.MeshBasicMaterial({ color, wireframe: true });
}

const materials = [
    (materialBaseCylinder = createMaterial(redColor)),
    (materialFirstRing = createMaterial(blueColor)),
    (materialSecondRing = createMaterial(redColor)),
    (materialThirdRing = createMaterial(greenColor)),
]

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    createBaseCylinder(0, 0, 0);
    createFirstRing(0, 0, 0);
    createSecondRing(0, 0, 0);
    createThirdRing(0, 0, 0);
}

function createBaseCylinder(x, y, z) {
    'use strict';

    var baseCylinderGeometry = new THREE.CylinderGeometry(
        baseCylinderRadius,
        baseCylinderRadius,
        baseCylinderHeight
    );
    baseCylinder = new THREE.Mesh(baseCylinderGeometry, materialBaseCylinder);
    baseCylinder.position.set(x, y + baseCylinderHeight / 2, z);
    scene.add(baseCylinder);
}

function createRing(x, y, z, innerRadius, outerRadius, height, material) {
    let shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    let holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    shape.holes.push(holePath);

    let extrudeSettings = {
        depth: height,
        bevelEnabled: false
    };

    let ringGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    let ring = new THREE.Mesh(ringGeometry, material);
    ring.position.set(x, y + height, z);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
}

function createFirstRing(x, y, z) {
    'use strict';

    createRing(x, y, z, firstRingInnerRadius, firstRingOuterRadius, firstRingHeight, materialFirstRing);
}

function createSecondRing(x, y, z) {
    'use strict';

    createRing(x, y, z, secondRingInnerRadius, secondRingOuterRadius, secondRingHeight, materialSecondRing);
}

function createThirdRing(x, y, z) {
    'use strict';

    createRing(x, y, z, thirdRingInnerRadius, thirdRingOuterRadius, thirdRingHeight, materialThirdRing);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';

    // TODO - Implement the camera
    // This is just a test camera
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 15;
    camera.lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict';

}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    checkCollisions();
    handleCollisions();
    update();
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
}

init();
animate();
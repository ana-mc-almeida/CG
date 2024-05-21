import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { ParametricGeometries } from "three/addons/geometries/ParametricGeometries.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let clock = new THREE.Clock();

var scene, camera, renderer;

/////////////
/* Colours */
/////////////
var redColor = 0xff0000,
    greenColor = 0x00ff00,
    blueColor = 0x0000ff,
    yellowColor = 0xffff00;

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
var baseCylinder, // FIXME - not sure if this is really needed
    firstRing,
    secondRing,
    thirdRing;

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

///////////////
/* Movements */
///////////////
var moveFirstRing = true,
    firstRingIsGoingUp = true,
    moveSecondRing = true,
    secondRingIsGoingUp = true,
    moveThirdRing = true,
    thirdRingIsGoingUp = true;

///////////
/* Speed */
///////////
var firstRingHorizontalSpeed = 4,
    secondRingHorizontalSpeed = 3,
    thirdRingHorizontalSpeed = 2,
    baseCylinderVerticalSpeed = 1,
    firstRingVerticalSpeed = 1,
    secondRingVerticalSpeed = 1,
    thirdRingVerticalSpeed = 1;

//////////////////////////
/* Parametric Geometry */
//////////////////////////
var numberOfParametricFunctions = 8;
// FIXME - Implement better parametric functions
// TODO - Maybe move this to a separate file
var parametricFunctions = [
    // Superfície paramétrica 1: Paraboloide hiperbólico
    function (u, v, target) {
        const x = Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const y = Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const z = Math.cos(v * Math.PI);
        target.set(x, y, z)
    },
    // Superfície paramétrica 2: Hiperbolóide de uma folha
    function (u, v, target) {
        const x = Math.cos(u * Math.PI * 2);
        const y = Math.sin(u * Math.PI * 2);
        const z = v * 2 - 1; // v vai de 0 a 1, então mapeamos para -1 a 1
        target.set(x, y, z);
    },
    // Superfície paramétrica 3: Cilindro helicoidal
    function (u, v, target) {
        const radius = 1 - v;
        const x = radius * Math.cos(u * Math.PI * 2);
        const y = radius * Math.sin(u * Math.PI * 2);
        const z = v * 2 - 1;
        target.set(x, y, z);
    },
    // Superfície paramétrica 4: Elipsóide
    function (u, v, target) {
        const x = v * Math.cos(u * Math.PI * 2);
        const y = v * Math.sin(u * Math.PI * 2);
        const z = v * v;
        target.set(x, y, z);
    },
    // Superfície paramétrica 5: Cone
    function (u, v, target) {
        const a = 1;
        const b = 1;
        const c = 1;
        const x = a * Math.cosh(v) * Math.cos(u * Math.PI * 2);
        const y = b * Math.cosh(v) * Math.sin(u * Math.PI * 2);
        const z = c * Math.sinh(v);
        target.set(x, y, z);
    },
    // Superfície paramétrica 6: Faixa de Möbius
    function (u, v, target) {
        const a = 1;
        const b = 0.1;
        const x = a * Math.cos(u * Math.PI * 2);
        const y = a * Math.sin(u * Math.PI * 2);
        const z = b * u;
        target.set(x, y, z);
    },
    // Superfície paramétrica 7: Catenoide
    function (u, v, target) {
        const x = u;
        const y = v * Math.sin(u);
        const z = v * Math.cos(u);
        target.set(x, y, z);
    },
    // Superfície paramétrica 8: Plano torcido
    function (u, v, target) {
        const R = 1; // Raio maior
        const r = 0.3; // Raio menor
        const x = (R + r * Math.cos(v * Math.PI * 2)) * Math.cos(u * Math.PI * 2);
        const y = (R + r * Math.cos(v * Math.PI * 2)) * Math.sin(u * Math.PI * 2);
        const z = r * Math.sin(v * Math.PI * 2);
        target.set(x, y, z);
    }
];
var parametricGeometries = [];

////////////////////////
/* CREATE MATERIAL(S) */
////////////////////////
function createMaterial(color) {
    return new THREE.MeshBasicMaterial({ color, wireframe: true });
}

const materials = [
    (materialBaseCylinder = createMaterial(yellowColor)),
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
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    camera.lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

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
    return ring;
}

function createFirstRing(x, y, z) {
    'use strict';

    firstRing = createRing(x, y, z, firstRingInnerRadius, firstRingOuterRadius, firstRingHeight, materialFirstRing);
    createParametrics(firstRing, firstRingInnerRadius, firstRingOuterRadius, secondRingHeight, parametricFunctions);
}

function createSecondRing(x, y, z) {
    'use strict';

    secondRing = createRing(x, y, z, secondRingInnerRadius, secondRingOuterRadius, secondRingHeight, materialSecondRing);
    createParametrics(secondRing, secondRingInnerRadius, secondRingOuterRadius, secondRingHeight, parametricFunctions);
}

function createThirdRing(x, y, z) {
    'use strict';

    thirdRing = createRing(x, y, z, thirdRingInnerRadius, thirdRingOuterRadius, thirdRingHeight, materialThirdRing);
    createParametrics(thirdRing, thirdRingInnerRadius, thirdRingOuterRadius, thirdRingHeight, parametricFunctions);
}

function createParametrics(ring, innerRadius, outerRadius, height, parametricFunctions) {
    var numberOfParametricFunctions = parametricFunctions.length;

    const radius = innerRadius + (outerRadius - innerRadius) / 2;

    for (var i = 0; i < numberOfParametricFunctions; i++) {
        const angle = i * (Math.PI / 4);
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        // const x = (2 / 3) * radius

        // const parametricFunction = parametricFunctions[i];

        // const geometry = new ParametricGeometry(parametricFunction, 1, 8);
        const cubeSize = 1;
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        const surface = new THREE.Mesh(geometry, material);

        surface.position.set(x, z, -cubeSize / 2);
        ring.add(surface);
        console.log("Added surface ", i, " to ring with angle ", ring.rotation.z);
        ring.rotation.z += (Math.PI / 4);
    }

}

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

    let delta = clock.getDelta();

    moveRings(delta);

    rotateObjects(delta);
}

function moveRings(delta) {
    if (moveFirstRing) {
        if (firstRingIsGoingUp) {
            firstRingIsGoingUp = moveRingUp(firstRing, firstRingHorizontalSpeed, delta);
        }
        else {
            firstRingIsGoingUp = !moveRingDown(firstRing, firstRingHorizontalSpeed, delta, firstRingHeight);
        }
    }

    if (moveSecondRing) {
        if (secondRingIsGoingUp) {
            secondRingIsGoingUp = moveRingUp(secondRing, secondRingHorizontalSpeed, delta);
        }
        else {
            secondRingIsGoingUp = !moveRingDown(secondRing, secondRingHorizontalSpeed, delta, secondRingHeight);
        }
    }

    if (moveThirdRing) {
        if (thirdRingIsGoingUp) {
            thirdRingIsGoingUp = moveRingUp(thirdRing, thirdRingHorizontalSpeed, delta);
        }
        else {
            thirdRingIsGoingUp = !moveRingDown(thirdRing, thirdRingHorizontalSpeed, delta, thirdRingHeight);
        }
    }
}

function rotateObjects(delta) {
    // Rotate base cylinder
    rotateObjectY(baseCylinder, baseCylinderVerticalSpeed, delta);

    // The rings are rotated in the Z axis 
    // because when they are created they are rotated in the X axis
    // Rotate first ring
    rotateObjectZ(firstRing, firstRingVerticalSpeed, delta);
    // Rotate second ring
    rotateObjectZ(secondRing, secondRingVerticalSpeed, delta);
    // Rotate third ring
    rotateObjectZ(thirdRing, thirdRingVerticalSpeed, delta);
}

function moveRingUp(ring, speed, delta) {
    if (ring.position.y >= baseCylinderHeight) {
        return false
    }
    else {
        ring.position.y += delta * speed;
        return true;
    }
}

function moveRingDown(ring, speed, delta, height) {
    if (ring.position.y <= 0 + height) {
        return false
    }
    else {
        ring.position.y -= delta * speed;
        return true;
    }
}

function rotateObjectY(object, speed, delta) {
    object.rotation.y += delta * speed;
}

function rotateObjectZ(object, speed, delta) {
    object.rotation.z += delta * speed;
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

    window.addEventListener("keydown", onKeyDown);

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

    switch (e.keyCode) {
        case 49: // 1
            moveFirstRing = !moveFirstRing;
            break;
        case 50: // 2
            moveSecondRing = !moveSecondRing;
            break;
        case 51: // 3
            moveThirdRing = !moveThirdRing;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';

    // FIXME - Check if this is needed (i don't think so)
}

init();
animate();
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";



//////////////////////
/* GLOBAL CONSTANTS */
//////////////////////

const ORBITAL_CAMERA = createPerspectiveCamera({
  fov: 80,
  near: 1,
  far: 1000,
  x: -10,
  y: 20,
  z: -10,
});
const FIXED_CAMERA = createPerspectiveCamera({
  fov: 60,
  near: 1,
  far: 1500,
  x: 15,
  y: 15,
  z: 10,
});

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let clock = new THREE.Clock();

var scene, camera, renderer;
let activeCamera = FIXED_CAMERA; // starts as the fixed camera, may change afterwards
const NAMED_MESHES = [];
let updateProjectionMatrix = false;
let activeMaterial = "basic"; // starts as basic, may change afterwards
let activeMaterialChanged = false; // starts as basic, may change afterwards

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

////////////////////////
/* CREATE MATERIAL(S) */
////////////////////////

/**
 * registering it in NAMED_MESHES to allow dynamic behavior such as material switching.
 *
 * This should not be used for buffer scene elements, as they are not dynamic.
 * @param {string} name - the mesh's name, per GEOMETRY and MATERIAL_PARAMS
 * @param {THREE.Object3D} parent - the parent to which the props will be added
 * @returns {THREE.Mesh} - the newly created mesh
 */
function createMesh(name, color, geometry) {
  const meshMaterials = {
    basic: new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
    gouraud: new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }),
    phong: new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide }),
    cartoon: new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide }),
    normal: new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
  };
  const mesh = new THREE.Mesh(geometry, meshMaterials[activeMaterial]);
  Object.assign(mesh.userData, { name, meshMaterials });
  NAMED_MESHES.push(mesh);
  return mesh;
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
  "use strict";

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
function createCameras() {
  const controls = new OrbitControls(ORBITAL_CAMERA, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.keys = {
    LEFT: 72, // h
    UP: 75, // k
    RIGHT: 76, // l
    BOTTOM: 74, // j
  };
  controls.update();
}

function createPerspectiveCamera({
  fov,
  near,
  far,
  x = 0,
  y = 0,
  z = 0,
  atX = 0,
  atY = 0,
  atZ = 0,
}) {
  const aspect = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(x, y, z);
  camera.lookAt(atX, atY, atZ);
  return camera;
}

function refreshCameraParameters(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createBaseCylinder(x, y, z) {
  "use strict";

  var baseCylinderGeometry = new THREE.CylinderGeometry(
    baseCylinderRadius,
    baseCylinderRadius,
    baseCylinderHeight
  );
  baseCylinder = createMesh("ring", yellowColor, baseCylinderGeometry);
  baseCylinder.position.set(x, y + baseCylinderHeight / 2, z);
  scene.add(baseCylinder);
}

function createRing(x, y, z, innerRadius, outerRadius, height, color) {
  let shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  let holePath = new THREE.Path();
  holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
  shape.holes.push(holePath);

  let extrudeSettings = {
    depth: height,
    bevelEnabled: false,
  };

  let ringGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  let ring = createMesh("ring", color, ringGeometry);
  ring.position.set(x, y + height, z);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  return ring;
}

function createFirstRing(x, y, z) {
  "use strict";

  firstRing = createRing(
    x,
    y,
    z,
    firstRingInnerRadius,
    firstRingOuterRadius,
    firstRingHeight,
    blueColor
  );
}

function createSecondRing(x, y, z) {
  "use strict";

  secondRing = createRing(
    x,
    y,
    z,
    secondRingInnerRadius,
    secondRingOuterRadius,
    secondRingHeight,
    redColor
  );
}

function createThirdRing(x, y, z) {
  "use strict";

  thirdRing = createRing(
    x,
    y,
    z,
    thirdRingInnerRadius,
    thirdRingOuterRadius,
    thirdRingHeight,
    greenColor
  );
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
  "use strict";
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
  "use strict";
}

////////////
/* UPDATE */
////////////
function update() {
  "use strict";

  let delta = clock.getDelta();

  changeMesh();
  moveRings(delta);

  rotateObjects(delta);

  if (updateProjectionMatrix) {
    const isXrPresenting = renderer.xr.isPresenting;
    renderer.xr.isPresenting = false;
    updateProjectionMatrix = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
      refreshCameraParameters(isXrPresenting ? renderer.xr.getCamera() : activeCamera);
    }
    renderer.xr.isPresenting = isXrPresenting;
  }
}

function moveRings(delta) {
  if (moveFirstRing) {
    if (firstRingIsGoingUp) {
      firstRingIsGoingUp = moveRingUp(
        firstRing,
        firstRingHorizontalSpeed,
        delta
      );
    } else {
      firstRingIsGoingUp = !moveRingDown(
        firstRing,
        firstRingHorizontalSpeed,
        delta,
        firstRingHeight
      );
    }
  }

  if (moveSecondRing) {
    if (secondRingIsGoingUp) {
      secondRingIsGoingUp = moveRingUp(
        secondRing,
        secondRingHorizontalSpeed,
        delta
      );
    } else {
      secondRingIsGoingUp = !moveRingDown(
        secondRing,
        secondRingHorizontalSpeed,
        delta,
        secondRingHeight
      );
    }
  }

  if (moveThirdRing) {
    if (thirdRingIsGoingUp) {
      thirdRingIsGoingUp = moveRingUp(
        thirdRing,
        thirdRingHorizontalSpeed,
        delta
      );
    } else {
      thirdRingIsGoingUp = !moveRingDown(
        thirdRing,
        thirdRingHorizontalSpeed,
        delta,
        thirdRingHeight
      );
    }
  }
}

function changeMesh() {
  if (activeMaterialChanged) {
    NAMED_MESHES.forEach(
      (mesh) => (mesh.material = mesh.userData.meshMaterials[activeMaterial])
    );
  }
}

function changeMeshHandler(material) {
  activeMaterial = material;
  activeMaterialChanged = true;
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
    return false;
  } else {
    ring.position.y += delta * speed;
    return true;
  }
}

function moveRingDown(ring, speed, delta, height) {
  if (ring.position.y <= 0 + height) {
    return false;
  } else {
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
  "use strict";

  renderer.render(scene, activeCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  createScene();
  createCameras();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener('resize', onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";

  checkCollisions();
  handleCollisions();
  update();
  render();

  renderer.setAnimationLoop(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
  updateProjectionMatrix = true;
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";

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
    case 81 || 113: // 'q' 'Q'
      changeMeshHandler("gouraud");
      break;
    case 87 || 119: // 'w' 'W'
      changeMeshHandler("phong");
      break;
    case 69 || 101: // 'e' 'E'
      changeMeshHandler("cartoon");
      break;
    case 82 || 114: // 'r' 'R'
      changeMeshHandler("normal");
      break;
    case 83 || 115: // 's' 'S' //TODO REMOVE THIS
      changeMeshHandler("basic");
      break;
  }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";

  // FIXME - Check if this is needed (i don't think so)
}


init();
animate();

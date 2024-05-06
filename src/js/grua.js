import * as THREE from "three";

var activeCamera, scene, renderer;
var geometry, material, mesh;

// grua materials
const materialFoundation = new THREE.MeshBasicMaterial({ color: 0xf00f00, wireframe: true, });
const materialLowerMast = new THREE.MeshBasicMaterial({ color: 0x0f0ff0, wireframe: true, });
const materialTurntable = new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });
const materialHigherMast = new THREE.MeshBasicMaterial({ color: 0x0f0ff0, wireframe: true, });
const materialCab = new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });
const materialJib = new THREE.MeshBasicMaterial({ color: 0x0f0ff0, wireframe: true, });
const materialCounterWeight = new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });
const materialTowerPeak = new THREE.MeshBasicMaterial({ color: 0x0f0ff0, wireframe: true, });
const materialRightLoadLine = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialLeftLoadLine = new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });

// hook block materials
const materialHoist = new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });
const materialSteelCable = new THREE.MeshBasicMaterial({ color: 0x0f0ff0, wireframe: true, });
const materialHookBlock = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
//const materialHigherHook = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true, });
//const materialLowerHook= new THREE.MeshBasicMaterial({ color: 0xf00f0f, wireframe: true, });

//const BACKGROUND = new THREE.Color(0xeceae4);
const BACKGROUND = new THREE.Color(0xf); //TODO remove this, is just to not hurt the eyes :)

const materialBase = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialWalls = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, });

const materialCube = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });

const materialTorus = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialDodecahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialTorusKnot = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialIcosahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });
const materialParallelpiped = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, });

let wireframeToggle = false;
let previousView = 1;

var container;

var containerWidth = 10;
var containerHeight = 10;
var containerBaseHeight = 1;
var containerLength = 20;

var cubeSide = 2;

var parallelpipedWidth = 2;
var parallelpipedHeight = 5;
var parallelpipedLength = 2;

var torusRadius = 3;
var tubeRadius = 1;

var radius = 5;

function createContainer(x, y, z) {
  "use strict";

  container = new THREE.Object3D();

  // Base
  var baseGeometry = new THREE.BoxGeometry(containerLength, 1, containerWidth);
  var base = new THREE.Mesh(baseGeometry, materialBase);
  base.position.y = containerBaseHeight / 2;
  container.add(base);

  // Walls
  var smallWallGeometry = new THREE.BoxGeometry(
    containerLength,
    containerHeight,
    1
  );
  var bigWallGeometry = new THREE.BoxGeometry(
    1,
    containerHeight,
    containerWidth
  );
  
  // Back wall
  var wallBack = new THREE.Mesh(smallWallGeometry, materialWalls);
  wallBack.position.z = -(containerWidth / 2);
  wallBack.position.y = containerHeight / 2;
  container.add(wallBack);

  // Front wall
  var wallFront = new THREE.Mesh(smallWallGeometry, materialWalls);
  wallFront.position.z = containerWidth / 2;
  wallFront.position.y = containerHeight / 2;
  container.add(wallFront);

  // Left wall
  var wallLeft = new THREE.Mesh(bigWallGeometry, materialWalls);
  wallLeft.position.x = -(containerLength / 2);
  wallLeft.position.y = containerHeight / 2;
  container.add(wallLeft);

  // Right wall
  var wallRight = new THREE.Mesh(bigWallGeometry, materialWalls);
  wallRight.position.x = containerLength / 2;
  wallRight.position.y = containerHeight / 2;
  container.add(wallRight);

  container.position.set(x, y, z);
  scene.add(container);
}

function createCube(x, y, z) {
  "use strict";

  var cubeGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
  var cube = new THREE.Mesh(cubeGeometry, materialCube);
  cube.position.set(x, y + cubeSide / 2, z);
  scene.add(cube);
}

function createTorus(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorus);
  torus.position.set(x, y + torusRadius / 2, z);
  torus.rotation.x = Math.PI / 2;
  scene.add(torus);
}

function createTorusKnot(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusKnotGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(x, y + torusRadius, z);
  scene.add(torus);
}

function createDodecahedron(x, y, z) {
  "use strict";

  var dodecahedronGeometry = new THREE.DodecahedronGeometry(radius);
  var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecahedron);
  dodecahedron.position.set(x, y + radius, z);
  scene.add(dodecahedron);
}

function createIcosahedron(x, y, z) {
  "use strict";

  var icosahedronGeometry = new THREE.IcosahedronGeometry(radius);
  var icosahedron = new THREE.Mesh(icosahedronGeometry, materialIcosahedron);
  icosahedron.position.set(x, y + radius, z);
  scene.add(icosahedron);
}

function createParallelpiped(x, y, z) {
  "use strict";

  var parallelpipedGeometry = new THREE.BoxGeometry(
    parallelpipedWidth,
    parallelpipedHeight,
    parallelpipedLength
  );
  var parallelpiped = new THREE.Mesh(
    parallelpipedGeometry,
    materialParallelpiped
  );
  parallelpiped.position.set(x, y + parallelpipedHeight / 2, z);
  scene.add(parallelpiped);
}

function createLoads() {
  let i = 0;
  while (i < 6) {
    let x = Math.random() * 58 - 29;
    let y = 0;
    let z = Math.random() * 58 - 29;

    console.log(x, y, z);

    switch (i) {
      case 0:
        if (!checkCollision(x, y, z, cubeSide, cubeSide, cubeSide)) {
          createCube(x, y, z);
          i++;
        }
        break;
      case 1:
        if (!checkCollision(x, y, z, torusRadius, tubeRadius, torusRadius)) {
          createTorus(x, y, z);
          i++;
        }
        break;
      case 2:
        if (!checkCollision(x, y, z, torusRadius, tubeRadius, torusRadius)) {
          createTorusKnot(x, y, z);
          i++;
        }
        break;
      case 3:
        if (!checkCollision(x, y, z, radius, radius, radius)) {
          createDodecahedron(x, y, z);
          i++;
        }
        break;
      case 4:
        if (!checkCollision(x, y, z, radius, radius, radius)) {
          createIcosahedron(x, y, z);
          i++;
        }
        break;
      case 5:
        if (
          !checkCollision(
            x,
            y,
            z,
            parallelpipedWidth,
            parallelpipedHeight,
            parallelpipedLength
          )
        ) {
          createParallelpiped(x, y, z);
          i++;
        }
        break;
      default:
        console.log("Error");
    }
  }
}

function checkCollision(x, y, z, width, height, length) {
  let newBoundingBox = new THREE.Box3(
    new THREE.Vector3(x - width, y - height, z - length),
    new THREE.Vector3(x + width, y + height, z + length)
  );

  for (let object of scene.children) {
    let boundingBox = new THREE.Box3().setFromObject(object);
    if (newBoundingBox.intersectsBox(boundingBox)) {
      return true;
    }
  }
  return false;
}

function addFoundation(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(6, 6, 6);
  mesh = new THREE.Mesh(geometry, materialFoundation);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addLowerMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 20);
  mesh = new THREE.Mesh(geometry, materialLowerMast);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTurntable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(2, 2, 1, 32);
  mesh = new THREE.Mesh(geometry, materialTurntable);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHigherMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 6);
  mesh = new THREE.Mesh(geometry, materialHigherMast);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addJib(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 39);
  mesh = new THREE.Mesh(geometry, materialJib);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, Math.PI / 2, 0);
  obj.add(mesh);
}

function addCab(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 3);
  mesh = new THREE.Mesh(geometry, materialCab);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addCounterweight(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 4);
  mesh = new THREE.Mesh(geometry, materialCounterWeight);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTowerPeak(obj, x, y, z) {
  "use strict";
  geometry = new THREE.TetrahedronGeometry(2, 0);
  mesh = new THREE.Mesh(geometry, materialTowerPeak);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addRightLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 14.09, 32);
  mesh = new THREE.Mesh(geometry, materialRightLoadLine);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, 0.47 * Math.PI);
  obj.add(mesh);
}

function addLeftLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 8.16, 32);
  mesh = new THREE.Mesh(geometry, materialLeftLoadLine);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, 0.56 * Math.PI);
  obj.add(mesh);
}

function addHoist(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 1);
  mesh = new THREE.Mesh(geometry, materialHoist);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addSteelCable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32); //1 depende de lambda
  mesh = new THREE.Mesh(geometry, materialSteelCable);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 1);
  mesh = new THREE.Mesh(geometry, materialHookBlock);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addHigherHook(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  mesh = new THREE.Mesh(geometry, materialHookBlock);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addLowerHook(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  mesh = new THREE.Mesh(geometry, materialHookBlock);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function createLowerCrane(x, y, z) {
  "use strict";

  var lowerCrane = new THREE.Object3D();

  addFoundation(lowerCrane, 0, 3, 0);
  addLowerMast(lowerCrane, 0, 6 + 20 / 2, 0);

  scene.add(lowerCrane);

  lowerCrane.position.x = x;
  lowerCrane.position.y = y;
  lowerCrane.position.z = z;
}

function createRotatingCrane(x, y, z) {
  "use strict";

  var rotatingCrane = new THREE.Object3D();

  addTurntable(rotatingCrane, 0, 0.5, 0);
  addHigherMast(rotatingCrane, 0, 1 + 3, 0);
  addCab(rotatingCrane, 0, 1 + 3 + 0.5, 1 + 1);
  addJib(rotatingCrane, 11.5, 1 + 6 + 1, 0);
  addCounterweight(rotatingCrane, -5, 1 + 6 + 1 - 1, 0);
  addTowerPeak(rotatingCrane, 0, 1 + 6 + 2 + 1, 0);
  addRightLoadLine(rotatingCrane, 7, 1 + 6 + 2 + 1, 0);
  addLeftLoadLine(rotatingCrane, -4, 1 + 6 + 2 + 1, 0);

  scene.add(rotatingCrane);

  rotatingCrane.position.x = x;
  rotatingCrane.position.y = y;
  rotatingCrane.position.z = z;
}

function createMovingTrolley(x, y, z) {
  "use strict";

  var movingTrolley = new THREE.Object3D();

  //material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

  addHoist(movingTrolley, 0, -0.5, 0);
  addSteelCable(movingTrolley, 0, -1 - 0.5, 0); //-0.5 depende de lambda
  addHookBlock(movingTrolley, 0, -1 - 1 - 0.5, 0); //-1 depende de lambda
  addHigherHook(movingTrolley, 0, -1 - 1 - 1 - 0.5, 0.75);
  addHigherHook(movingTrolley, 0, -1 - 1 - 1 - 0.5, -0.75);
  addHigherHook(movingTrolley, 0.75, -1 - 1 - 1 - 0.5, 0);
  addHigherHook(movingTrolley, -0.75, -1 - 1 - 1 - 0.5, 0);
  addLowerHook(movingTrolley, 0, -1 - 1 - 1 - 1 - 0.5, 0.75);
  addLowerHook(movingTrolley, 0, -1 - 1 - 1 - 1 - 0.5, -0.75);
  addLowerHook(movingTrolley, 0.75, -1 - 1 - 1 - 1 - 0.5, 0);
  addLowerHook(movingTrolley, -0.75, -1 - 1 - 1 - 1 - 0.5, 0);

  scene.add(movingTrolley);

  movingTrolley.position.x = x;
  movingTrolley.position.y = y;
  movingTrolley.position.z = z;
}

const hudContainer = document.createElement("div");
function createHUD() {
  // Create HUD container
  //const hudContainer = document.createElement("div");
  hudContainer.id = "hud";
  hudContainer.style.position = "fixed";
  hudContainer.style.top = "10px";
  hudContainer.style.right = "10px";
  hudContainer.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  hudContainer.style.padding = "15px";
  hudContainer.style.borderRadius = "10px";
  hudContainer.style.boxShadow = "0 0 12px rgba(0, 0, 0, 0.2)";
  //document represents the HTML doc loaded in the window
  document.body.appendChild(hudContainer);

  // Add initial HUD content
  hudContainer.innerHTML = `
    <div id="title" style="margin-top: -10px;">
      <h2>Key Mappings</h2>
    </div>
    <div id="content" style="margin-top: -10px;">
      <p data-key="0">Press 0: Toggle Wireframes</p>
      <p data-key="1">Press 1: Front View</p>
      <p data-key="2">Press 2: Side View</p>
      <p data-key="3">Press 3: Top View</p>
      <p data-key="4">Press 4: Orthogonal Projection</p>
      <p data-key="5">Press 5: Perspective Projection</p>
      <p data-key="q">Press Q(q): Eixo de Rotação (TODO)</p>
      <p data-key="a">Press A(a): Eixo de Rotação (TODO)</p>
      <p data-key="w">Press W(w): Carrinho (TODO)</p>
      <p data-key="s">Press S(s): Carrinho (TODO)</p>
      <p data-key="e">Press E(e): Bloco garra (TODO)</p>
      <p data-key="d">Press D(d): Bloco garra (TODO)</p>
      <p data-key="r">Praess R(r): Garra (TODO)</p>
      <p data-key="f">Press F(f): Garra (TODO)</p>
    </div>
  `;

  toggleHighlight("1", true);
}

function toggleHighlight(key, add) {
  const element = hudContainer.querySelector(`p[data-key="${key}"]`);
  if (element) {
    if (add) {
      element.classList.add("highlighted");
    } else {
      element.classList.remove("highlighted");
    }
  }
}

function highlightOnKeyDown(key) {
  const element = hudContainer.querySelector(`p[data-key="${key}"]`);
  if (element) {
    element.classList.add("highlighted");
    document.addEventListener("keyup", function (event) {
      if (event.key.toLowerCase() === key) {
        element.classList.remove("highlighted");
      }
    });
  }
}

function updateHUD(key) {
  // updates hud based on key
  if (key == 0) {
    wireframeToggle = !wireframeToggle;
    wireframeToggle ? toggleHighlight("0", true) : toggleHighlight("0", false);
  } else if (/[1-6]/.test(key)) {
    toggleHighlight(previousView, false);
    console.log(key);
    toggleHighlight(key, true);
    previousView = key;
  } else {
    highlightOnKeyDown(key);
  }
}

function render() {
  "use strict";
  renderer.render(scene, activeCamera.camera);
}

function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
    case 48: // '0'
      toggleWireframes();
      updateHUD("0");
      break;
    case 49: // '1'
      changeActiveCamera(cameras.front);
      updateHUD("1");
      break;
    case 50: // '2'
      changeActiveCamera(cameras.side);
      updateHUD("2");
      break;
    case 51: // '3'
      changeActiveCamera(cameras.top);
      updateHUD("3");
      break;
    case 52: // '4'
      changeActiveCamera(cameras.orthogonal);
      updateHUD("4");
      break;
    case 53: // '5'
      changeActiveCamera(cameras.perspective);
      updateHUD("5");
      break;
    case 54: // '6'
      //TODO activeCamera = cameraMovel;
      updateHUD("6");
      break;
    case 65 || 97: // 'a' 'A'
      //TODO activeCamera = cameraMovel;
      updateHUD("a"); // Highlight 'a' key
      break;
    case 81 || 113: // 'q' 'Q'
      //TODO activeCamera = cameraMovel;
      updateHUD("q"); // Highlight 'q' key
      break;
    case 83 || 115: // 's' 'S'
      //TODO activeCamera = cameraMovel;
      updateHUD("s"); // Highlight 's' key
      break;
    case 87 || 119: // 'w' 'W'
      //TODO activeCamera = cameraMovel;
      updateHUD("w"); // Highlight 'w' key
      break;
    case 68 || 100: // 'd' 'D'
      //TODO activeCamera = cameraMovel;
      updateHUD("d"); // Highlight 'd' key
      break;
    case 69 || 101: // 'e' 'E'
      //TODO activeCamera = cameraMovel;
      updateHUD("e"); // Highlight 'e' key
      break;
    case 82 || 114: // 'r' 'R'
      //TODO activeCamera = cameraMovel;
      updateHUD("r"); // Highlight 'r' key
      break;
    case 70 || 102: // 'f' 'F'
      //TODO activeCamera = cameraMovel;
      updateHUD("f"); // Highlight 'f' key
      break;
    default:
      break;
  }
  // TODO
}

function onResize() {
  "use strict";
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (window.innerHeight > 0 && window.innerWidth > 0) {
    activeCamera.camera.aspect = window.innerWidth / window.innerHeight;
    activeCamera.camera.updateProjectionMatrix();
  }
  // TODO
}

function createScene() {
  "use strict";

  scene = new THREE.Scene();

  scene.add(new THREE.AxesHelper(10));
  scene.background = BACKGROUND;

  createLowerCrane(0, 0, 0);
  createRotatingCrane(0, 6 + 20, 0);
  createMovingTrolley(29, 6 + 20 + 6 + 1, 0);

  createContainer(15, 0, 15);
  createLoads();
}

function createCameras() {
  "use strict";
  // set the initial camera
  activeCamera = cameras.front;

  Object.values(cameras).forEach((cameraDescriptor) => {
    refreshCameraParameters(cameraDescriptor);
    cameraDescriptor.camera.lookAt(scene.position);
  });
}

function init() {
  "use strict";
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  createCameras();
  createHUD();

  render();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);

  // TODO: update this
}

function animate() {
  "use strict";

  render();

  requestAnimationFrame(animate);
}

const CAMERA_GEOMETRY = Object.freeze({
  sceneViewAABB: [
    new THREE.Vector3(-10, -1, -30),
    new THREE.Vector3(35, 40, 30),
  ],
  orthogonalDistance: 500, // distance from the camera to the scene in orthogonal projection
  orthogonalNear: 1, // closest distance from the camera at which objects are rendered
  orthogonalFar: 1000, // furthest distance from the camera at which objects are rendered
  perspectiveDistance: 35,
  perspectiveFov: 80, // vertical field of view angle in degrees for the perspective camera
  perspectiveNear: 15,
  perspectiveFar: 1500,
});

const cameras = {
  // front view
  front: createOrthogonalCamera({
    bottomAxisVector: new THREE.Vector3(-1, 0, 0), // X axis
    sideAxisVector: new THREE.Vector3(0, 1, 0), // Y axis
    z: -CAMERA_GEOMETRY.orthogonalDistance,
  }),
  // side view
  side: createOrthogonalCamera({
    bottomAxisVector: new THREE.Vector3(0, 0, 1), // Z axis
    sideAxisVector: new THREE.Vector3(0, 1, 0), // Y axis
    x: -CAMERA_GEOMETRY.orthogonalDistance,
  }),
  // top view
  top: createOrthogonalCamera({
    bottomAxisVector: new THREE.Vector3(1, 0, 0), // X axis
    sideAxisVector: new THREE.Vector3(0, 0, 0), // Z axis
    mirrorView: true,
    y: CAMERA_GEOMETRY.orthogonalDistance,
  }),
  // orthogonal projection: isometric view
  orthogonal: createOrthogonalCamera({
    bottomAxisVector: new THREE.Vector3(0, 0, -1),
    sideAxisVector: new THREE.Vector3(1, 0.1, -0.15).normalize(), // Y axis
    x: CAMERA_GEOMETRY.orthogonalDistance,
    y: CAMERA_GEOMETRY.orthogonalDistance,
    z: -CAMERA_GEOMETRY.orthogonalDistance,
  }),
  // perspective projection: isometric view
  perspective: createPerspectiveCamera({
    x: -CAMERA_GEOMETRY.perspectiveDistance,
    y: CAMERA_GEOMETRY.perspectiveDistance,
    z: -CAMERA_GEOMETRY.perspectiveDistance,
  }),
};

/**
 * Create an orthogonal camera with the given parameters.
 *
 * @param {Object} parameters - The camera parameters.
 * @param {THREE.Vector3} parameters.bottomAxisVector - A normalized vector along the bottom axis.
 * Its direction depends from where the camera is facing.
 * @param {THREE.Vector3} parameters.sideAxisVector - A normalized vector along the side axis.
 * Its direction depends from where the camera is facing.
 * @param {int} parameters.x - The X position of the camera.
 * @param {int} parameters.y - The Y position of the camera.
 * @param {int} parameters.z - The Z position of the camera.
 * @param {boolean} parameters.mirrorView - Whether to mirror the camera vertically and horizontally.
 * @returns {THREE.OrthographicCamera} The created camera.
 */
function createOrthogonalCamera({
  bottomAxisVector,
  sideAxisVector,
  x = 0,
  y = 0,
  z = 0,
  mirrorView = false,
}) {
  const getCameraParameters = () => {
    const { min, max } = {
      min: CAMERA_GEOMETRY.sceneViewAABB[0],
      max: CAMERA_GEOMETRY.sceneViewAABB[1],
    };

    const maxLeft = bottomAxisVector.dot(max);
    const minRight = bottomAxisVector.dot(min);
    const minTop = sideAxisVector.dot(max);
    const maxBottom = sideAxisVector.dot(min);

    const minWidth = Math.abs(minRight - maxLeft);
    const minHeight = Math.abs(minTop - maxBottom);
    const offsetX = (minRight + maxLeft) / 2;
    const offsetY = (minTop + maxBottom) / 2;

    const aspectRatio = window.innerWidth / window.innerHeight;
    let height = minHeight;
    let width = height * aspectRatio;

    // fit to aspect ratio
    if (width < minWidth) {
      width = minWidth;
      height = width / aspectRatio;
    }

    // correctly orient top-down camera
    if (mirrorView) {
      height = -height;
      width = -width;
    }

    const top = height / 2 + offsetY;
    const bottom = -height / 2 + offsetY;
    const left = -width / 2 + offsetX;
    const right = width / 2 + offsetX;

    return { top, bottom, left, right };
  };

  const { top, bottom, left, right } = getCameraParameters();

  const camera = new THREE.OrthographicCamera(
    left,
    right,
    top,
    bottom,
    CAMERA_GEOMETRY.orthogonalNear,
    CAMERA_GEOMETRY.orthogonalFar
  );
  camera.position.set(x, y, z);

  return { getCameraParameters, camera };
}

function createPerspectiveCamera({ x = 0, y = 0, z = 0 }) {
  const getCameraParameters = () => {
    return { aspect: window.innerWidth / window.innerHeight };
  };

  const { aspect } = getCameraParameters();

  const camera = new THREE.PerspectiveCamera(
    CAMERA_GEOMETRY.perspectiveFov,
    aspect,
    CAMERA_GEOMETRY.perspectiveNear,
    CAMERA_GEOMETRY.perspectiveFar
  );
  camera.position.set(x, y, z);

  return { getCameraParameters, camera };
}

/**
 * Given a camera descriptor, calls the `getCameraParameters` function
 * to get the attributes to override on the THREE.Camera object.
 * This function is given by the camera descriptor, from the `createOrthogonalCamera`
 * or the `createPerspectiveCamera` functions.
 *
 * Finally, updates the projection matrix of the camera.
 */
function refreshCameraParameters({ getCameraParameters, camera }) {
  const parameters = getCameraParameters();

  Object.assign(camera, parameters);
  camera.updateProjectionMatrix();
}

function changeActiveCamera(cameraDescriptor) {
  refreshCameraParameters(cameraDescriptor);
  activeCamera = cameraDescriptor;
}

//TODO remove console.log
function toggleWireframes() {
  scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      console.log(node);
      console.log("1->");
      console.log(node.material.wireframe);
      console.log("2->");
      console.log(!node.material.wireframe);
      node.material.wireframe = !node.material.wireframe;
      console.log("3->");
      console.log(node.material.wireframe);
    }
  });
}

init();
animate();
// Call createHUD function after DOM content is loaded
document.addEventListener("DOMContentLoaded", createHUD);

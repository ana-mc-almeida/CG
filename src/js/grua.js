import * as THREE from "three";

var activeCamera, scene, renderer;
var geometry, mesh;

var container;
let clock = new THREE.Clock();
var movingTrolley, lowerCrane, rotatingCrane, movingHook, steelCable, hook1, hook2, hook3, hook4;
let movingTrolley_flagS = false;
let movingTrolley_flagW = false;
let rotatingCrane_flagA = false;
let rotatingCrane_flagQ = false;
let movingHook_flagE = false;
let movingHook_flagD = false;
let rotatingHook_flagR = false;
let rotatingHook_flagF = false;

const BACKGROUND = new THREE.Color(0xeceae4);
// const BACKGROUND = new THREE.Color(0xf); //TODO remove this, is just to not hurt the eyes :)

let wireframeToggle = false;
let previousView = 1;

// Declare materials
//Grua
let materialFoundation,
  materialLowerMast,
  materialTurntable,
  materialHigherMast,
  materialCab,
  materialJib,
  materialCounterWeight,
  materialTowerPeak,
  materialRightLoadLine,
  materialLeftLoadLine;

//Hook block
let materialHoist,
  materialSteelCable,
  materialHookBlock,
  materialHigherHook,
  materialLowerHook;

//Container
let
  materialWalls,
  materialBase;

//Objects
let materialCube,
  materialTorus,
  materialDodecahedron,
  materialTorusKnot,
  materialIcosahedron,
  materialParallelpiped;

// Declare dimensions
// Container dimensions
var containerWidth = 10,
  containerHeight = 10,
  containerBaseHeight = 1,
  containerLength = 20;

// Objects dimensions
// Cube dimensions
var cubeSide = 2;

// Parallelpiped dimensions
var parallelpipedWidth = 2,
  parallelpipedHeight = 5,
  parallelpipedLength = 2;

// Torus dimensions
var torusRadius = 2;

// tube dimensions
var tubeRadius = 1;

//  radius 
var radius = 3;

var objectsOnTheFloor = [];

var collisionSpheres = {};

function createMaterial(color) {
  return new THREE.MeshBasicMaterial({ color, wireframe: true });
}
const materials = [
  // Grua materials
  materialFoundation = createMaterial(0xf00f0),
  materialLowerMast = createMaterial(0x0f0ff0),
  materialTurntable = createMaterial(0xf00f0f),
  materialHigherMast = createMaterial(0x0f0ff0),
  materialCab = createMaterial(0xf00f0f),
  materialJib = createMaterial(0x0f0ff0),
  materialCounterWeight = createMaterial(0xf00f0f),
  materialTowerPeak = createMaterial(0x0f0ff0),
  materialRightLoadLine = createMaterial(0x00ff00),
  materialLeftLoadLine = createMaterial(0xf00f0f),
  // Hook block materials
  materialHoist = createMaterial(0xf00f0f),
  materialSteelCable = createMaterial(0x0f0ff0),
  materialHookBlock = createMaterial(0x00ff00),
  materialHigherHook = createMaterial(0xf55f00),
  materialLowerHook = createMaterial(0x00ffff),
  // Container materials
  materialWalls = createMaterial(0x0000ff),
  materialBase = createMaterial(0x00ff00),
  // Objects materials
  materialCube = createMaterial(0x00ff00),
  materialTorus = createMaterial(0x00ff00),
  materialDodecahedron = createMaterial(0x00ff00),
  materialTorusKnot = createMaterial(0x00ff00),
  materialIcosahedron = createMaterial(0x00ff00),
  materialParallelpiped = createMaterial(0x00ff00),
];

function getPositionY(geometry, y) {
  var size = new THREE.Vector3();

  geometry.computeBoundingBox();
  geometry.boundingBox.getSize(size);

  return y + size.y / 2;
}

function getPositionYRotated(geometry, y) {
  var size = new THREE.Vector3();

  geometry.computeBoundingBox();
  geometry.boundingBox.getSize(size);

  return y + size.z / 2;
}

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
  objectsOnTheFloor.push(container);

  createSphere(container, "container");
}

function createCube(x, y, z) {
  "use strict";

  var cubeGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
  var cube = new THREE.Mesh(cubeGeometry, materialCube);
  cube.position.set(x, y + cubeSide / 2, z);
  scene.add(cube);
  objectsOnTheFloor.push(cube);

  createSphere(cube, "cube");
}

function createTorus(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorus);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(x, getPositionYRotated(torusGeometry, y), z);
  scene.add(torus);
  objectsOnTheFloor.push(torus);

  createSphere(torus, "torus");
}

function createTorusKnot(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusKnotGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(x, getPositionYRotated(torusGeometry, y), z);
  scene.add(torus);
  objectsOnTheFloor.push(torus);

  createSphere(torus, "torusKnot");
}

function createDodecahedron(x, y, z) {
  "use strict";

  var dodecahedronGeometry = new THREE.DodecahedronGeometry(radius);
  var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecahedron);
  dodecahedron.position.set(x, getPositionY(dodecahedronGeometry, y), z);
  scene.add(dodecahedron);
  objectsOnTheFloor.push(dodecahedron);

  createSphere(dodecahedron, "dodecahedron");
}

function createIcosahedron(x, y, z) {
  "use strict";

  var icosahedronGeometry = new THREE.IcosahedronGeometry(radius);
  var icosahedron = new THREE.Mesh(icosahedronGeometry, materialIcosahedron);
  icosahedron.position.set(x, getPositionY(icosahedronGeometry, y), z);
  scene.add(icosahedron);
  objectsOnTheFloor.push(icosahedron);

  createSphere(icosahedron, "icosahedron");
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
  objectsOnTheFloor.push(parallelpiped);

  createSphere(parallelpiped, "parallelpiped");
}

function createLoads() {
  let i = 0;
  while (i < 6) {
    let max = 29 / Math.sqrt(2);
    let doubleMax = 2 * max;
    let x = Math.random() * doubleMax - max;
    let y = 0;
    let z = Math.random() * doubleMax - max;

    // console.log(x, y, z);

    switch (i) {
      case 0:
        if (!willCollide(x, y, z, cubeSide)) {
          createCube(x, y, z);
          i++;
        }
        break;
      case 1:
        if (!willCollide(x, y, z, torusRadius)) {
          createTorus(x, y, z);
          i++;
        }
        break;
      case 2:
        if (!willCollide(x, y, z, torusRadius)) {
          createTorusKnot(x, y, z);
          i++;
        }
        break;
      case 3:
        if (!willCollide(x, y, z, radius)) {
          createDodecahedron(x, y, z);
          i++;
        }
        break;
      case 4:
        if (!willCollide(x, y, z, radius)) {
          createIcosahedron(x, y, z);
          i++;
        }
        break;
      case 5:
        if (!willCollide(x, y, z, parallelpipedHeight)) {
          createParallelpiped(x, y, z);
          i++;
        }
        break;
      default:
        console.log("Error");
    }
  }
}

function willCollide(x, y, z, radius) {
  let newBoundingSphere = new THREE.Sphere(new THREE.Vector3(x, y, z), radius);

  for (let object of scene.children) {
    let boundingSphere = new THREE.Sphere();
    new THREE.Box3().setFromObject(object).getBoundingSphere(boundingSphere);
    if (newBoundingSphere.intersectsSphere(boundingSphere)) {
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
  objectsOnTheFloor.push(mesh);
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
  'use strict';
  const geometry = new THREE.BufferGeometry();
  const sideLength = 2;
  const vertices = new Float32Array([
    -1, 0, -1, // v0
    -1, 0, 1, // v1
    1, 0, 0, // v2
    0, 1.633, 0 // v3 - vertix
  ]);
  const indices = [
    0, 1, 2,
    0, 2, 3,
    2, 1, 3,
    0, 3, 1
  ];
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const mesh = new THREE.Mesh(geometry, materialTowerPeak);
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
  mesh.rotation.set(0, 0, 0.555 * Math.PI);
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
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  var mesh = new THREE.Mesh(geometry, materialHigherHook);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
  // console.log("Added HigherHook to object", obj);
}

function addLowerHook(obj, x, y, z) {
  "use strict";
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  var mesh = new THREE.Mesh(geometry, materialLowerHook);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function createLowerCrane(x, y, z) {
  "use strict";

  lowerCrane = new THREE.Object3D();

  addFoundation(lowerCrane, 0, 3, 0);
  addLowerMast(lowerCrane, 0, 6 + 20 / 2, 0);

  scene.add(lowerCrane);

  lowerCrane.position.x = x;
  lowerCrane.position.y = y;
  lowerCrane.position.z = z;
}

function createRotatingCrane(x, y, z) {
  "use strict";

  rotatingCrane = new THREE.Object3D();

  addTurntable(rotatingCrane, 0, 0.5, 0);
  addHigherMast(rotatingCrane, 0, 1 + 3, 0);
  addCab(rotatingCrane, 0, 1 + 3 + 0.5, 1 + 1);
  addJib(rotatingCrane, 11.5, 1 + 6 + 1, 0);
  addCounterweight(rotatingCrane, -5, 1 + 6 + 1 - 1, 0);
  addTowerPeak(rotatingCrane, 0, 1 + 6 + 2, 0);
  addRightLoadLine(rotatingCrane, 7, 1 + 6 + 2 + 0.811, 0);
  addLeftLoadLine(rotatingCrane, -4, 1 + 6 + 2 + 0.811, 0);

  scene.add(rotatingCrane);

  rotatingCrane.position.x = x;
  rotatingCrane.position.y = y;
  rotatingCrane.position.z = z;

  createMovingTrolley(29, 7, 0);
}

function createMovingTrolley(x, y, z) {
  "use strict";

  movingTrolley = new THREE.Object3D();

  addHoist(movingTrolley, 0, -0.5, 0);

  steelCable = new THREE.Object3D();
  addSteelCable(steelCable, 0, -1 - 0.5, 0);

  movingTrolley.add(steelCable);

  rotatingCrane.add(movingTrolley);

  movingTrolley.position.x = x;
  movingTrolley.position.y = y;
  movingTrolley.position.z = z;

  createMovingHook(0, 0, 0);
}

function createMovingHook(x, y, z) {
  "use strict";

  movingHook = new THREE.Object3D();
  hook2 = new THREE.Object3D();
  hook3 = new THREE.Object3D();
  hook4 = new THREE.Object3D();

  // -1 - 1 - 1 - 1 - 0.5 in new 0 of y
  addHookBlock(movingHook, 0, -2.5, 0);
  addHigherHook(movingHook, 0, -3.5, 0.75);
  addHigherHook(movingHook, 0, -3.5, -0.75);
  addHigherHook(movingHook, 0.75, -3.5, 0);
  addHigherHook(movingHook, -0.75, -3.5, 0);

  movingTrolley.add(movingHook);

  movingHook.position.x = x;
  movingHook.position.y = y;
  movingHook.position.z = z;

  createHook1(0, 0, 0);
  createHook2(0, 0, 0);
  createHook3(0, 0, 0);
  createHook4(0, 0, 0);
}

function createHook1(x, y, z) {
  "use strict";

  hook1 = new THREE.Object3D();

  addLowerHook(hook1, 0, 0, 0);

  movingHook.add(hook1);

  hook1.position.x = x;
  hook1.position.y = y - 4.5;
  hook1.position.z = z + 0.75;
}

function createHook2(x, y, z) {
  "use strict";

  hook2 = new THREE.Object3D();

  addLowerHook(hook2, 0, 0, 0);

  movingHook.add(hook2);

  hook2.position.x = x;
  hook2.position.y = y - 4.5;
  hook2.position.z = z - 0.75;
}

function createHook3(x, y, z) {
  "use strict";

  hook3 = new THREE.Object3D();

  addLowerHook(hook3, 0, 0, 0);

  movingHook.add(hook3);

  hook3.position.x = x + 0.75;
  hook3.position.y = y - 4.5;
  hook3.position.z = z;
}

function createHook4(x, y, z) {
  "use strict";

  hook4 = new THREE.Object3D();

  addLowerHook(hook4, 0, 0, 0);

  movingHook.add(hook4);

  hook4.position.x = x - 0.75;
  hook4.position.y = y - 4.5;
  hook4.position.z = z;
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
      <p data-key="1">Press 1: Front View</p>
      <p data-key="2">Press 2: Side View</p>
      <p data-key="3">Press 3: Top View</p>
      <p data-key="4">Press 4: Orthogonal Projection</p>
      <p data-key="5">Press 5: Perspective Projection</p>
      <p data-key="6">Press 6: Mobile Camera</p>
      <p data-key="7">Press 7: Toggle Wireframes</p>
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

function createSphere(object, name = null) {
  let sphere = new THREE.Sphere();
  new THREE.Box3().setFromObject(object).getBoundingSphere(sphere);

  //Debug
  // let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
  // let sphereGeometry = new THREE.SphereGeometry(sphere.radius);
  // let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // sphereMesh.position.copy(sphere.center);
  // scene.add(sphereMesh);

  if (name) {
    collisionSpheres[name] = sphere;
  }

  return sphere;
}

function checkCraneCollision() {
  let newBoundingSphere = createSphere(movingHook);

  // console.log(collisionSpheres)

  for (let [name, boundingSphere] of Object.entries(collisionSpheres)) {
    // TODO: check if sould use intersectsSphere or radius
    if (newBoundingSphere.intersectsSphere(boundingSphere) && name !== "container") {
      console.log("Collision detected");
      return true;
    }
  }
  console.log("No collision detected");
  return false;
}

function updateHUD(key) {
  // updates hud based on key
  if (key == 7) {
    wireframeToggle = !wireframeToggle;
    wireframeToggle ? toggleHighlight("7", true) : toggleHighlight("7", false);
  } else if (/[1-6]/.test(key)) {
    toggleHighlight(previousView, false);
    // console.log(key);
    toggleHighlight(key, true);
    previousView = key;
  } else {
    highlightOnKeyDown(key);
  }
}

function update() {
  'use strict';
  let delta = clock.getDelta();

  if (movingTrolley_flagS == true && movingTrolley_flagW == false) {
    if (movingTrolley.position.x > 5) {
      var translationMatrix = new THREE.Matrix4().makeTranslation(new THREE.Vector3(-8 * delta, 0, 0));
      movingTrolley.applyMatrix4(translationMatrix);

      checkCraneCollision();
    }
  }
  if (movingTrolley_flagS == false && movingTrolley_flagW == true) {
    if (movingTrolley.position.x < 29) {
      var translationMatrix = new THREE.Matrix4().makeTranslation(new THREE.Vector3(8 * delta, 0, 0));
      movingTrolley.applyMatrix4(translationMatrix);

      checkCraneCollision();
    }
  }
  if (rotatingCrane_flagA == true && rotatingCrane_flagQ == false) {
    var rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, -1, 0), (Math.PI / 10) * delta);
    rotatingCrane.applyMatrix4(rotationMatrix);

    checkCraneCollision();
  }
  if (rotatingCrane_flagA == false && rotatingCrane_flagQ == true) {
    var rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), (Math.PI / 10) * delta);
    rotatingCrane.applyMatrix4(rotationMatrix);

    checkCraneCollision();
  }
  if (movingHook_flagD == true && movingHook_flagE == false) {
    if (movingHook.position.y > -27.5) {
      var translationVector = new THREE.Vector3(0, -8 * delta, 0);
      var translationMatrix = new THREE.Matrix4().makeTranslation(translationVector);
      movingHook.applyMatrix4(translationMatrix);

      var originalPosition = steelCable.position.clone();
      var currentHeight = steelCable.scale.y;
      var scaleFactor = 1 + (-translationVector.y / currentHeight);

      var scaleMatrix = new THREE.Matrix4().makeScale(1, scaleFactor, 1);
      steelCable.applyMatrix4(scaleMatrix);

      var inverseTranslationVector = originalPosition.clone().sub(steelCable.position);

      var inverseTranslationMatrix = new THREE.Matrix4().makeTranslation(0, inverseTranslationVector.y + (8 * delta), 0);
      steelCable.applyMatrix4(inverseTranslationMatrix);

      checkCraneCollision();
    }
  }
  if (movingHook_flagD == false && movingHook_flagE == true) {
    if (movingHook.position.y < 0) {
      var translationVector = new THREE.Vector3(0, 8 * delta, 0);
      var translationMatrix = new THREE.Matrix4().makeTranslation(translationVector);
      movingHook.applyMatrix4(translationMatrix);

      var originalPosition = steelCable.position.clone();
      var currentHeight = steelCable.scale.y;
      var scaleFactor = 1 - (translationVector.y / currentHeight);

      var scaleMatrix = new THREE.Matrix4().makeScale(1, scaleFactor, 1);
      steelCable.applyMatrix4(scaleMatrix);

      var inverseTranslationVector = originalPosition.clone().sub(steelCable.position);

      var inverseTranslationMatrix = new THREE.Matrix4().makeTranslation(0, inverseTranslationVector.y - (8 * delta), 0);
      steelCable.applyMatrix4(inverseTranslationMatrix);

      checkCraneCollision();
    }
  }

  var angle = Math.PI / 8;

  if (rotatingHook_flagF == true && rotatingHook_flagR == false) {
    if (hook3.rotation.z < angle) {
      var axis1 = new THREE.Vector3(-1, 0, 0);
      var axis2 = new THREE.Vector3(1, 0, 0);
      var axis3 = new THREE.Vector3(0, 0, 1);
      var axis4 = new THREE.Vector3(0, 0, -1);
      var angle = (Math.PI / 10) * delta;

      hook1.rotateOnWorldAxis(axis1, angle);
      hook2.rotateOnWorldAxis(axis2, angle);
      hook3.rotateOnWorldAxis(axis3, angle);
      hook4.rotateOnWorldAxis(axis4, angle);

      checkCraneCollision();
    }
  }
  if (rotatingHook_flagF == false && rotatingHook_flagR == true) {
    if (hook3.rotation.z > -angle) {
      var axis1 = new THREE.Vector3(1, 0, 0);
      var axis2 = new THREE.Vector3(-1, 0, 0);
      var axis3 = new THREE.Vector3(0, 0, -1);
      var axis4 = new THREE.Vector3(0, 0, 1);
      var angle = (Math.PI / 10) * delta;

      hook1.rotateOnWorldAxis(axis1, angle);
      hook2.rotateOnWorldAxis(axis2, angle);
      hook3.rotateOnWorldAxis(axis3, angle);
      hook4.rotateOnWorldAxis(axis4, angle);

      checkCraneCollision();
    }
  }
}

function render() {
  "use strict";
  renderer.render(scene, activeCamera.camera);
}

function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
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
      changeActiveCamera(cameras.mobile);
      updateHUD("6");
      break;
    case 55: // '7'
      toggleWireframes();
      updateHUD("7");
      break;
    case 65 || 97: // 'a' 'A'
      //TODO activeCamera = cameraMovel;
      updateHUD("a"); // Highlight 'a' key
      rotatingCrane_flagA = true;
      break;
    case 81 || 113: // 'q' 'Q'
      //TODO activeCamera = cameraMovel;
      updateHUD("q"); // Highlight 'q' key
      rotatingCrane_flagQ = true;
      break;
    case 83 || 115: // 's' 'S'
      //TODO activeCamera = cameraMovel;
      updateHUD("s"); // Highlight 's' key
      movingTrolley_flagS = true;
      break;
    case 87 || 119: // 'w' 'W'
      //TODO activeCamera = cameraMovel;
      updateHUD("w"); // Highlight 'w' key
      movingTrolley_flagW = true;
      break;
    case 68 || 100: // 'd' 'D'
      //TODO activeCamera = cameraMovel;
      updateHUD("d"); // Highlight 'd' key
      movingHook_flagD = true;
      break;
    case 69 || 101: // 'e' 'E'
      //TODO activeCamera = cameraMovel;
      updateHUD("e"); // Highlight 'e' key
      movingHook_flagE = true;
      break;
    case 82 || 114: // 'r' 'R'
      //TODO activeCamera = cameraMovel;
      updateHUD("r"); // Highlight 'r' key
      rotatingHook_flagR = true;
      break;
    case 70 || 102: // 'f' 'F'
      //TODO activeCamera = cameraMovel;
      updateHUD("f"); // Highlight 'f' key
      rotatingHook_flagF = true;
      break;
    default:
      break;
  }
  // TODO
}

function onKeyUp(e) {
  "use strict";
  switch (e.keyCode) {
    case 65 || 97: // 'a' 'A'
      rotatingCrane_flagA = false;
      break;
    case 81 || 113: // 'q' 'Q'
      rotatingCrane_flagQ = false;
      break;
    case 83 || 115: // 's' 'S'
      movingTrolley_flagS = false;
      break;
    case 87 || 119: // 'w' 'W'
      movingTrolley_flagW = false;
      break;
    case 68 || 100: // 'd' 'D'
      movingHook_flagD = false;
      break;
    case 69 || 101: // 'e' 'E'
      movingHook_flagE = false;
      break;
    case 82 || 114: // 'r' 'R'
      rotatingHook_flagR = false;
      break;
    case 70 || 102: // 'f' 'F'
      rotatingHook_flagF = false;
      break;
    default:
      break;
  }
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
    refreshCameraParameters(activeCamera);
  }
}

function createScene() {
  "use strict";

  scene = new THREE.Scene();

  scene.add(new THREE.AxesHelper(10));

  scene.background = BACKGROUND;

  createLowerCrane(0, 0, 0);
  createRotatingCrane(0, 6 + 20, 0);

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

  //adicionar inicializar materiais
  createScene();
  createCameras();
  createHUD();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onResize);

  // TODO: update this
}

function animate() {
  "use strict";
  update();
  render();

  requestAnimationFrame(animate);
}

const CAMERA_GEOMETRY = Object.freeze({
  sceneViewAABB: [
    new THREE.Vector3(-65, -5, -40),
    new THREE.Vector3(65, 40, 40),
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
    x: CAMERA_GEOMETRY.perspectiveDistance,
    y: CAMERA_GEOMETRY.perspectiveDistance,
    z: -CAMERA_GEOMETRY.perspectiveDistance,
  }),
  // perspective projection: mobile view
  mobile: createPerspectiveCamera({
    x: CAMERA_GEOMETRY.perspectiveDistance,
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


function toggleWireframes() {
  Object.values(materials).forEach((material) => (material.wireframe = !material.wireframe));
}


init();
animate();
// Call createHUD function after DOM content is loaded
document.addEventListener("DOMContentLoaded", createHUD);

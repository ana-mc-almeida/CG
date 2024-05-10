import * as THREE from "three";

var activeCamera, scene, renderer;
var geometry, mesh;
var originalHUDContent, showMoreHUDContent, showLessHUDContent;
var showMore = true;
var keys = {};

var container;
let clock = new THREE.Clock();
var movingTrolley,
  lowerCrane,
  rotatingCrane,
  movingHook,
  steelCable,
  hook1,
  hook2,
  hook3,
  hook4;
let movingTrolley_flagS = false;
let movingTrolley_flagW = false;
let rotatingCrane_flagA = false;
let rotatingCrane_flagQ = false;
let movingHook_flagE = false;
let movingHook_flagD = false;
let rotatingHook_flagR = false;
let rotatingHook_flagF = false;

const BACKGROUND = new THREE.Color(0xeceae4);

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
let materialWalls, materialBase;

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
var radiusLoads = 3;

// SpheresDimentions
var torusSphereRadios = 3;
var dodecahedronSphereRadios = radiusLoads;
var icosahedronSphereRadios = radiusLoads;
var torusKnotSphereRadios = 5;

// Foundation Dimensions
var foundationSize = 6;

// Mast Dimensions
var lowerMastHeight = 20;
var squareSideLength = 2;
var higherMastHeight = 6;

// Turntable Dimensions
var turntableHeight = 1;

// Jib Dimensions
var jibLength = 39;
var jibCenterX = 11.5;

// Cab Dimensions
var cabHeight = 3;
var cabDisplacementZ = 1;

// Counterweight Dimensions
var counterweightHeight = 4;
var counterweightDisplacementX = -5;
var counterweightDisplacementY = -1;

// Loadlines Dimensions
var rightLoadLineLength = 14.09;
var leftLoadLineLength = 8.16;
var rightLoadLineAngle = 0.47 * Math.PI;
var leftLoadLineLAngle = 0.555 * Math.PI;
var rightLoadLineX = 7;
var leftLoadLineX = -4;
var cablesRadius = 0.1;

// Hoist Dimensions
var hoistHeight = 1;

// Cable Dimensions
var steelCableLenght = 1;

// Towerpeak Dimensions
var towerPeakHeight = 1.633;

// Hook Dimensions
var hookBlockHeight = 1;
var hookHeight = 1;
var hookSideLenght = 0.5;
var hookDisplacement = 0.75;
var hookMaxY = -27.5;
var trolleyMaxX = 29;
var hookMaxX = 29;
var hookInitialY = 7;
var maxHookAngle = Math.PI / 8;

// Movement Variables
var translationSpeed = 8;
var rotationSpeed = (Math.PI / 10);

// Objects on the floor
var objectsOnTheFloor = [];

// Colisions
var collisionSpheres = {};
var collidingObjects = {};

var collisionAnimationInProgress = false;
var animationPhase = 0;
var collidingObject = null;


function createMaterial(color) {
  return new THREE.MeshBasicMaterial({ color, wireframe: true });
}
const materials = [
  // Grua materials
  (materialFoundation = createMaterial(0x744700)),
  (materialLowerMast = createMaterial(0xbf9000)),
  (materialTurntable = createMaterial(0x990000)),
  (materialHigherMast = createMaterial(0xdaa520)),
  (materialCab = createMaterial(0xb7410e)),
  (materialJib = createMaterial(0xdaa520)),
  (materialCounterWeight = createMaterial(0xb7410e)),
  (materialTowerPeak = createMaterial(0x8b4513)),
  (materialRightLoadLine = createMaterial(0x9c9282)),
  (materialLeftLoadLine = createMaterial(0x9c9282)),
  // Hook block materials
  (materialHoist = createMaterial(0x990000)),
  (materialSteelCable = createMaterial(0x000000)),
  (materialHookBlock = createMaterial(0xb7410e)),
  (materialHigherHook = createMaterial(0x8b4513)),
  (materialLowerHook = createMaterial(0xc04e3a)),
  // Container materials
  (materialWalls = createMaterial(0x2d3142)),
  (materialBase = createMaterial(0x796969)),
  // Objects materials
  (materialCube = createMaterial(0xfb9062)),
  (materialTorus = createMaterial(0x9966cc)),
  (materialDodecahedron = createMaterial(0xce4993)),
  (materialTorusKnot = createMaterial(0x009dff)),
  (materialIcosahedron = createMaterial(0x4eb8b0)),
  (materialParallelpiped = createMaterial(0xef0000)),
];

function createHUDContent(showMore = false, showLess = false) {
  return `
  <div id="title" style="margin-top: -10px;">
  <h2>Key Mappings</h2>
  ${showMore
      ? '<span id="showMore" style="cursor: pointer; font-weight: bold;">show more</span>'
      : ""
    }
  </div>
  ${showMore
      ? ""
      : `
  <div id="content" style="margin-top: -10px;">
  <p data-key="1">Press 1: Front View</p>
  <p data-key="2">Press 2: Side View</p>
  <p data-key="3">Press 3: Top View</p>
  <p data-key="4">Press 4: Orthogonal Projection</p>
  <p data-key="5">Press 5: Perspective Projection</p>
  <p data-key="6">Press 6: Mobile Camera</p>
  <p data-key="7">Press 7: Toggle Wireframes</p>
  <p data-key="a">Press A(a): Rotate Crane clock-wise</p>
  <p data-key="q">Press Q(q): Rotate Crane anti-clockwise</p>
  <p data-key="s">Press S(s): Move trolley backwards</p>
  <p data-key="w">Press W(w): Move trolley onwards</p>
  <p data-key="e">Press E(e): Move claw block up</p>
  <p data-key="d">Press D(d): Move claw block down</p>
  <p data-key="r">Press R(r): Close claw</p>
  <p data-key="f">Press F(f): Open claw</p>
  ${showLess
        ? '<span id="showLess" style="cursor: pointer; font-weight: bold;">show less</span>'
        : ""
      }
  </div>`
    }
  <style>
  ${showMore ? "#showMore:hover { color: blue; }" : ""}
  ${showLess ? "#showLess:hover { color: blue; }" : ""}
  </style>
  `;
}

originalHUDContent = createHUDContent();
showMoreHUDContent = createHUDContent(true);
showLessHUDContent = createHUDContent(false, true);

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

function createSphere({ object, name = null, radius = null }) {
  let sphere;
  if (!radius) {
    sphere = new THREE.Sphere();
    new THREE.Box3().setFromObject(object).getBoundingSphere(sphere);
  }
  else {
    let boundingSphere = new THREE.Sphere();
    new THREE.Box3().setFromObject(object).getBoundingSphere(boundingSphere);
    sphere = new THREE.Sphere(boundingSphere.center, radius);
  }


  //Debug
  // let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
  // let sphereGeometry = new THREE.SphereGeometry(sphere.radius);
  // let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // sphereMesh.position.copy(sphere.center);
  // scene.add(sphereMesh);

  if (name) {
    collisionSpheres[name] = { center: sphere.center, radius: sphere.radius };
    collidingObjects[name] = object;
  }

  return { center: sphere.center, radius: sphere.radius };
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

  createSphere({ object: container, name: "container" });
}

function createCube(x, y, z) {
  "use strict";

  var cubeGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
  var cube = new THREE.Mesh(cubeGeometry, materialCube);
  cube.position.set(x, y + cubeSide / 2, z);
  scene.add(cube);
  objectsOnTheFloor.push(cube);

  createSphere({ object: cube, name: "cube" });
}

function createTorus(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorus);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(x, getPositionYRotated(torusGeometry, y), z);
  scene.add(torus);
  objectsOnTheFloor.push(torus);

  createSphere({ object: torus, name: "torus", radius: torusSphereRadios });
}

function createTorusKnot(x, y, z) {
  "use strict";

  var torusGeometry = new THREE.TorusKnotGeometry(torusRadius, tubeRadius);
  var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
  torus.rotation.x = Math.PI / 2;
  torus.position.set(x, getPositionYRotated(torusGeometry, y), z);
  scene.add(torus);
  objectsOnTheFloor.push(torus);

  createSphere({ object: torus, name: "torusKnot", radius: torusKnotSphereRadios });
}

function createDodecahedron(x, y, z) {
  "use strict";

  var dodecahedronGeometry = new THREE.DodecahedronGeometry(radiusLoads);
  var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecahedron);
  dodecahedron.position.set(x, getPositionY(dodecahedronGeometry, y), z);
  scene.add(dodecahedron);
  objectsOnTheFloor.push(dodecahedron);

  createSphere({ object: dodecahedron, name: "dodecahedron", radius: dodecahedronSphereRadios });
}

function createIcosahedron(x, y, z) {
  "use strict";

  var icosahedronGeometry = new THREE.IcosahedronGeometry(radiusLoads);
  var icosahedron = new THREE.Mesh(icosahedronGeometry, materialIcosahedron);
  icosahedron.position.set(x, getPositionY(icosahedronGeometry, y), z);
  scene.add(icosahedron);
  objectsOnTheFloor.push(icosahedron);

  createSphere({ object: icosahedron, name: "icosahedron", radius: icosahedronSphereRadios });
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

  createSphere({ object: parallelpiped, name: "parallelpiped" });
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
        if (!willCollide(x, y, z, radiusLoads)) {
          createDodecahedron(x, y, z);
          i++;
        }
        break;
      case 4:
        if (!willCollide(x, y, z, radiusLoads)) {
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

  for (let object of objectsOnTheFloor) {
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
  geometry = new THREE.BoxGeometry(foundationSize, foundationSize, foundationSize);
  mesh = new THREE.Mesh(geometry, materialFoundation);
  mesh.position.set(x, y, z);
  obj.add(mesh);
  objectsOnTheFloor.push(mesh);
}

function addLowerMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, lowerMastHeight);
  mesh = new THREE.Mesh(geometry, materialLowerMast);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTurntable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(squareSideLength, squareSideLength, turntableHeight, 32);
  mesh = new THREE.Mesh(geometry, materialTurntable);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHigherMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, higherMastHeight);
  mesh = new THREE.Mesh(geometry, materialHigherMast);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addJib(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, jibLength);
  mesh = new THREE.Mesh(geometry, materialJib);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, Math.PI / 2, 0);
  obj.add(mesh);
}

function addCab(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, cabHeight);
  mesh = new THREE.Mesh(geometry, materialCab);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addCounterweight(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, counterweightHeight);
  mesh = new THREE.Mesh(geometry, materialCounterWeight);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTowerPeak(obj, x, y, z) {
  "use strict";
  const geometry = new THREE.BufferGeometry();
  const sideLength = 2;
  const vertices = new Float32Array([
    -1,
    0,
    -1, // v0
    -1,
    0,
    1, // v1
    1,
    0,
    0, // v2
    0,
    towerPeakHeight,
    0, // v3 - vertix
  ]);
  const indices = [0, 1, 2, 0, 2, 3, 2, 1, 3, 0, 3, 1];
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const mesh = new THREE.Mesh(geometry, materialTowerPeak);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addRightLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(cablesRadius, cablesRadius, rightLoadLineLength, 32);
  mesh = new THREE.Mesh(geometry, materialRightLoadLine);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, rightLoadLineAngle);
  obj.add(mesh);
}

function addLeftLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(cablesRadius, cablesRadius, leftLoadLineLength, 32);
  mesh = new THREE.Mesh(geometry, materialLeftLoadLine);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, leftLoadLineLAngle);
  obj.add(mesh);
}

function addHoist(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, hoistHeight);
  mesh = new THREE.Mesh(geometry, materialHoist);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addSteelCable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(cablesRadius, cablesRadius, steelCableLenght, 32); //1 depende de lambda
  mesh = new THREE.Mesh(geometry, materialSteelCable);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(squareSideLength, squareSideLength, hookBlockHeight);
  mesh = new THREE.Mesh(geometry, materialHookBlock);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addHigherHook(obj, x, y, z) {
  "use strict";
  var geometry = new THREE.BoxGeometry(hookSideLenght, hookSideLenght, hookHeight);
  var mesh = new THREE.Mesh(geometry, materialHigherHook);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
  // console.log("Added HigherHook to object", obj);
}

function addLowerHook(obj, x, y, z) {
  "use strict";
  var geometry = new THREE.BoxGeometry(hookSideLenght, hookSideLenght, hookHeight);
  var mesh = new THREE.Mesh(geometry, materialLowerHook);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function createCrane(x, y, z) {
  "use strict";

  lowerCrane = new THREE.Object3D();

  var cranePivot = new THREE.Object3D();
  cranePivot.position.set(0, 0, 0);
  lowerCrane.add(cranePivot);
  createRotatingCrane(cranePivot, 0, foundationSize + lowerMastHeight, 0);

  addFoundation(lowerCrane, 0, foundationSize/2, 0);
  addLowerMast(lowerCrane, 0, foundationSize + lowerMastHeight/2, 0);

  scene.add(lowerCrane);

  lowerCrane.position.x = x;
  lowerCrane.position.y = y;
  lowerCrane.position.z = z;
}

function createRotatingCrane(parent, x, y, z) {
  "use strict";

  rotatingCrane = new THREE.Object3D();

  addTurntable(rotatingCrane, 0, turntableHeight/2, 0);
  addHigherMast(rotatingCrane, 0, turntableHeight + higherMastHeight/2, 0);
  addCab(rotatingCrane, 0, turntableHeight + higherMastHeight/2 + 0.5, cabDisplacementZ + squareSideLength/2);
  addJib(rotatingCrane, jibCenterX, turntableHeight + higherMastHeight + squareSideLength/2, 0);
  addCounterweight(rotatingCrane, counterweightDisplacementX, turntableHeight + higherMastHeight + squareSideLength/2 + counterweightDisplacementY, 0);
  addTowerPeak(rotatingCrane, 0, turntableHeight + higherMastHeight + squareSideLength, 0);
  addRightLoadLine(rotatingCrane, rightLoadLineX, turntableHeight + higherMastHeight + squareSideLength + towerPeakHeight/2, 0);
  addLeftLoadLine(rotatingCrane, leftLoadLineX, turntableHeight + higherMastHeight + squareSideLength + towerPeakHeight/2, 0);

  parent.add(rotatingCrane);

  rotatingCrane.position.x = x;
  rotatingCrane.position.y = y;
  rotatingCrane.position.z = z;

  createMovingTrolley(rotatingCrane, hookMaxX, hookInitialY, 0);
}

function createMovingTrolley(parent, x, y, z) {
  "use strict";

  movingTrolley = new THREE.Object3D();

  addHoist(movingTrolley, 0, -hoistHeight/2, 0);

  steelCable = new THREE.Object3D();
  addSteelCable(steelCable, 0, -hoistHeight - steelCableLenght/2, 0);

  movingTrolley.add(steelCable);

  parent.add(movingTrolley);

  movingTrolley.position.x = x;
  movingTrolley.position.y = y;
  movingTrolley.position.z = z;

  createMovingHook(movingTrolley, 0, 0, 0);
}

function createMovingHook(parent, x, y, z) {
  "use strict";

  movingHook = new THREE.Object3D();

  hook1 = new THREE.Object3D();
  hook2 = new THREE.Object3D();
  hook3 = new THREE.Object3D();
  hook4 = new THREE.Object3D();

  var lowerHookY = -(hoistHeight+steelCableLenght+hookBlockHeight+hookHeight+hookHeight/2);
  var higherHookY = -(hoistHeight+steelCableLenght+hookBlockHeight+hookHeight/2);

  var hook1Pivot = new THREE.Object3D();
  hook1Pivot.position.set(0, lowerHookY, hookDisplacement);
  movingHook.add(hook1Pivot);
  createHook(hook1, hook1Pivot, 0, 0, 0);

  var hook2Pivot = new THREE.Object3D();
  hook2Pivot.position.set(0, lowerHookY, -hookDisplacement);
  movingHook.add(hook2Pivot);
  createHook(hook2, hook2Pivot, 0, 0, 0);

  var hook3Pivot = new THREE.Object3D();
  hook3Pivot.position.set(hookDisplacement, lowerHookY, 0);
  movingHook.add(hook3Pivot);
  createHook(hook3, hook3Pivot, 0, 0, 0);

  var hook4Pivot = new THREE.Object3D();
  hook4Pivot.position.set(-hookDisplacement, lowerHookY, 0);
  movingHook.add(hook4Pivot);
  createHook(hook4, hook4Pivot, 0, 0, 0);

  addHookBlock(movingHook, 0, -(hoistHeight+steelCableLenght+hookBlockHeight/2), 0);
  addHigherHook(movingHook, 0, higherHookY, hookDisplacement);
  addHigherHook(movingHook, 0, higherHookY, -hookDisplacement);
  addHigherHook(movingHook, hookDisplacement, higherHookY, 0);
  addHigherHook(movingHook, -hookDisplacement, higherHookY, 0);

  parent.add(movingHook);

  movingHook.position.x = x;
  movingHook.position.y = y;
  movingHook.position.z = z;

  var camera = cameras.mobile.camera;

  camera.position.set(0, 0, 0);

  var zAxis = new THREE.Vector3(0, 0, -1);
  // Rotate the camera around the z-axis by 180 degrees
  camera.rotateOnAxis(zAxis, Math.PI);
  // Make the camera look at x0z
  camera.rotation.x = -Math.PI / 2;
  // Attach the camera to the moving hook
  movingHook.add(camera);
}

function createHook(children, parent, x, y, z) {
  "use strict";

  addLowerHook(children, x, y, z);

  parent.add(children);

  children.position.x = x;
  children.position.y = y;
  children.position.z = z;
}

const hudContainer = document.createElement("div");
function createHUD() {
  // Create HUD container
  hudContainer.id = "hud";
  hudContainer.style.position = "fixed";
  hudContainer.style.top = "10px";
  hudContainer.style.right = "10px";
  hudContainer.style.width = "310px";
  hudContainer.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  hudContainer.style.padding = "15px";
  hudContainer.style.borderRadius = "10px";
  hudContainer.style.boxShadow = "0 0 12px rgba(0, 0, 0, 0.2)";
  //document represents the HTML doc loaded in the window
  document.body.appendChild(hudContainer);

  // Add initial HUD content
  hudContainer.innerHTML = originalHUDContent;
}

function updateHUD() {
  // updates hud based on key
  if (activeCamera === cameras.side) {
    hudContainer.innerHTML = showMore ? showMoreHUDContent : showLessHUDContent;
  } else {
    showMore = true;
    hudContainer.innerHTML = originalHUDContent;
  }
}

document.addEventListener("click", function (event) {
  if (event.target.id === "showMore") {
    showMore = false;
    updateHUD();
  } else if (event.target.id === "showLess") {
    showMore = true;
    updateHUD();
  }
});

function updateHighlights() {
  for (var key in keys) {
    const element = hudContainer.querySelector(`p[data-key="${key}"]`);
    if (element) {
      if (keys[key]) {
        element.classList.add("highlighted");
      } else {
        element.classList.remove("highlighted");
      }
    }
  }
}

function checkCraneCollision() {
  let { center, radius } = createSphere({ object: movingHook });

  for (let [name, sphere] of Object.entries(collisionSpheres)) {
    const loadCenter = sphere.center;
    const loadRadius = sphere.radius;

    const sumRadius = radius + loadRadius;
    const powSumRadius = sumRadius * sumRadius;
    const distanceX = center.x - loadCenter.x;
    const distanceY = center.y - loadCenter.y;
    const distanceZ = center.z - loadCenter.z;
    const powDistance = (distanceX * distanceX) + (distanceY * distanceY) + (distanceZ * distanceZ);

    if (powSumRadius >= powDistance && name !== "container") {
      console.log("Collision detected");
      collisionAnimationInProgress = true;
      collidingObject = name;
      return true;
    }
  }
  console.log("No collision detected");
  return false;
}

function moveHookUp(delta) {
  if (movingHook.position.y < 0) {
    var translationVector = new THREE.Vector3(0, translationSpeed * delta, 0);
    var translationMatrix = new THREE.Matrix4().makeTranslation(
      translationVector
    );
    movingHook.applyMatrix4(translationMatrix);

    var originalPosition = steelCable.position.clone();
    var currentHeight = steelCable.scale.y;
    var scaleFactor = 1 - translationVector.y / currentHeight;

    var scaleMatrix = new THREE.Matrix4().makeScale(1, scaleFactor, 1);
    steelCable.applyMatrix4(scaleMatrix);

    var inverseTranslationVector = originalPosition
      .clone()
      .sub(steelCable.position);

    var inverseTranslationMatrix = new THREE.Matrix4().makeTranslation(
      0,
      inverseTranslationVector.y - translationSpeed * delta,
      0
    );
    steelCable.applyMatrix4(inverseTranslationMatrix);

    return delta;
  }
  return 0;
}

function moveHookDown(delta) {
  if (movingHook.position.y > hookMaxY) {
    var translationVector = new THREE.Vector3(0, -translationSpeed * delta, 0);
    var translationMatrix = new THREE.Matrix4().makeTranslation(
      translationVector
    );
    movingHook.applyMatrix4(translationMatrix);

    var originalPosition = steelCable.position.clone();
    var currentHeight = steelCable.scale.y;
    var scaleFactor = 1 + -translationVector.y / currentHeight;

    var scaleMatrix = new THREE.Matrix4().makeScale(1, scaleFactor, 1);
    steelCable.applyMatrix4(scaleMatrix);

    var inverseTranslationVector = originalPosition
      .clone()
      .sub(steelCable.position);

    var inverseTranslationMatrix = new THREE.Matrix4().makeTranslation(
      0,
      inverseTranslationVector.y + translationSpeed * delta,
      0
    );
    steelCable.applyMatrix4(inverseTranslationMatrix);

    return delta;
  }
  return 0;
}

function moveCraneClockwise(delta) {
  var rotationMatrix = new THREE.Matrix4().makeRotationAxis(
    new THREE.Vector3(0, -1, 0),
    rotationSpeed * delta
  );
  rotatingCrane.applyMatrix4(rotationMatrix);
}

function moveCraneAntiClockwise(delta) {
  var rotationMatrix = new THREE.Matrix4().makeRotationAxis(
    new THREE.Vector3(0, 1, 0),
    rotationSpeed * delta
  );
  rotatingCrane.applyMatrix4(rotationMatrix);
}

function moveTrolleyBackward(delta) {
  if (movingTrolley.position.x > 5) {
    var translationMatrix = new THREE.Matrix4().makeTranslation(
      new THREE.Vector3(-translationSpeed * delta, 0, 0)
    );
    movingTrolley.applyMatrix4(translationMatrix);
    return delta;
  }
  return 0;
}

function moveTrolleyForward(delta) {
  if (movingTrolley.position.x < 29) {
    var translationMatrix = new THREE.Matrix4().makeTranslation(
      new THREE.Vector3(translationSpeed * delta, 0, 0)
    );
    movingTrolley.applyMatrix4(translationMatrix);
    return delta;
  }
  return 0;
}

function moveHookIn(delta) {
  if (hook1.rotation.x < maxHookAngle && hook2.rotation.x > -maxHookAngle &&
    hook3.rotation.z > -maxHookAngle && hook4.rotation.z < maxHookAngle) {
    var rotationMatrix1 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      rotationSpeed * delta
    );
    var rotationMatrix2 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(-1, 0, 0),
      rotationSpeed * delta
    );
    var rotationMatrix3 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, -1),
      rotationSpeed * delta
    );
    var rotationMatrix4 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      rotationSpeed * delta
    );
    hook1.applyMatrix4(rotationMatrix1);
    hook2.applyMatrix4(rotationMatrix2);
    hook3.applyMatrix4(rotationMatrix3);
    hook4.applyMatrix4(rotationMatrix4);
  }
}

function moveHookOut(delta) {
  if (hook1.rotation.x > -maxHookAngle && hook2.rotation.x < maxHookAngle &&
    hook3.rotation.z < maxHookAngle && hook4.rotation.z > -maxHookAngle) {
    var rotationMatrix1 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(-1, 0, 0),
      rotationSpeed * delta
    );
    var rotationMatrix2 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      rotationSpeed * delta
    );
    var rotationMatrix3 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      rotationSpeed * delta
    );
    var rotationMatrix4 = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, -1),
      rotationSpeed * delta
    );
    hook1.applyMatrix4(rotationMatrix1);
    hook2.applyMatrix4(rotationMatrix2);
    hook3.applyMatrix4(rotationMatrix3);
    hook4.applyMatrix4(rotationMatrix4);
  }
}

function update() {
  "use strict";
  let delta = clock.getDelta();

  if (collisionAnimationInProgress) {
    var object = collidingObjects[collidingObject];

    switch (animationPhase) {
      case 0: // posicionar o objecto na garra
        let boundingBox = new THREE.Box3().setFromObject(object);
        let size = new THREE.Vector3();
        boundingBox.getSize(size);

        object.position.set(0, -5 - size.y / 2, 0);
        movingHook.add(object);

        animationPhase++;
        break;
      case 1: // fechar a garra
        if (hook3.rotation.z > -maxHookAngle) {
          moveHookIn(delta);
          return;
        }
        animationPhase++;
        break;
      case 2: // levantar a garra
        if (movingHook.position.y < 0) {
          moveHookUp(delta);
          // moveObjectUp(delta, object)
          return;
        }
        animationPhase++;
        break;
      case 3: // movimentar o carrinho
        if (movingTrolley.position.x < trolleyMaxX) {
          moveTrolleyForward(delta);
          return;
        }
        animationPhase++;
        break;
      case 4: // rodar a grua
        if (rotatingCrane.rotation.y < 0) {
          moveCraneAntiClockwise(delta);
          if (rotatingCrane.rotation.y > 0) animationPhase++;
          return;
        }
        if (rotatingCrane.rotation.y > 0) {
          moveCraneClockwise(delta);
          if (rotatingCrane.rotation.y < 0) animationPhase++;
          return;
        }
        animationPhase++;
        break;
      case 5: // baixar a garra
        if (movingHook.position.y > hookMaxY * 0.7) {
          moveHookDown(delta);
          return;
        }
        animationPhase++;
        break;
      case 6: // largar a carga
        if (hook3.rotation.z < 0) {
          moveHookOut(delta);
          return;
        }
        animationPhase++;
        break;
      case 7: // fazer a carga desapaecer
        movingHook.remove(object);
        scene.remove(collidingObjects[collidingObject]);
        delete collidingObjects[collidingObject];
        delete collisionSpheres[collidingObject];
        animationPhase++;
        break;
      case 8: // levantar a garra
        if (movingHook.position.y < hookMaxY / 2) {
          moveHookUp(delta);
          return;
        }
        animationPhase++;
        break;
      default:
        animationPhase = 0;
        collisionAnimationInProgress = false;
        return;
    }
  } else {
    if (movingTrolley_flagS == true && movingTrolley_flagW == false) {
      moveTrolleyBackward(delta);
    }
    if (movingTrolley_flagS == false && movingTrolley_flagW == true) {
      moveTrolleyForward(delta);
    }
    if (rotatingCrane_flagA == true && rotatingCrane_flagQ == false) {
      moveCraneClockwise(delta);
    }
    if (rotatingCrane_flagA == false && rotatingCrane_flagQ == true) {
      moveCraneAntiClockwise(delta);
    }
    if (movingHook_flagD == true && movingHook_flagE == false) {
      moveHookDown(delta);
    }
    if (movingHook_flagD == false && movingHook_flagE == true) {
      moveHookUp(delta);
    }
    if (rotatingHook_flagF == true && rotatingHook_flagR == false) {
      moveHookOut(delta);
    }
    if (rotatingHook_flagF == false && rotatingHook_flagR == true) {
      moveHookIn(delta);
    }
  }
}

function render() {
  "use strict";
  renderer.render(scene, activeCamera.camera);
}

function getKeyValue(e) {
  if (e.keyCode >= 48 && e.keyCode <= 57) {
    return String(e.keyCode - 48);
  } else {
    return String.fromCharCode(e.keyCode).toLowerCase();
  }
}

function onKeyDown(e) {
  "use strict";
  var key = getKeyValue(e);
  keys[key] = true;
  console.log("Key pressed: " + key);
  switch (e.keyCode) {
    case 49: // '1'
      changeActiveCamera(cameras.front);
      updateHUD();
      break;
    case 50: // '2'
      changeActiveCamera(cameras.side);
      updateHUD();
      break;
    case 51: // '3'
      changeActiveCamera(cameras.top);
      updateHUD();
      break;
    case 52: // '4'
      changeActiveCamera(cameras.orthogonal);
      updateHUD();
      break;
    case 53: // '5'
      changeActiveCamera(cameras.perspective);
      updateHUD();
      break;
    case 54: // '6'
      //TODO activeCamera = cameraMovel;
      changeActiveCamera(cameras.mobile);
      updateHUD();
      break;
    case 55: // '7'
      toggleWireframes();
      break;
    case 65 || 97: // 'a' 'A'
      rotatingCrane_flagA = true;
      break;
    case 81 || 113: // 'q' 'Q'
      rotatingCrane_flagQ = true;
      break;
    case 83 || 115: // 's' 'S'
      movingTrolley_flagS = true;
      break;
    case 87 || 119: // 'w' 'W'
      movingTrolley_flagW = true;
      break;
    case 68 || 100: // 'd' 'D'
      movingHook_flagD = true;
      break;
    case 69 || 101: // 'e' 'E'
      movingHook_flagE = true;
      break;
    case 82 || 114: // 'r' 'R'
      rotatingHook_flagR = true;
      break;
    case 70 || 102: // 'f' 'F'
      rotatingHook_flagF = true;
      break;
    default:
      break;
  }
  updateHighlights();
}

function onKeyUp(e) {
  "use strict";
  var key = getKeyValue(e);
  keys[key] = false;
  switch (e.keyCode) {
    case 49: // '1'
      updateHUD();
      break;
    case 50: // '2'
      updateHUD();
      break;
    case 51: // '3'
      updateHUD();
      break;
    case 52: // '4'
      updateHUD();
      break;
    case 53: // '5'
      updateHUD();
      break;
    case 54: // '6'
      updateHUD();
      break;
    case 55: // '7'
      updateHUD();
      break;
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
  updateHighlights();
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

  createCrane(0, 0, 0);

  createContainer(trolleyMaxX, 0, 0);
  createLoads();
}

function createCameras() {
  "use strict";
  // set the initial camera
  activeCamera = cameras.front;

  const cameraDescriptors = Object.values(cameras);
  const firstFiveCameraDescriptors = cameraDescriptors.slice(0, 5);

  firstFiveCameraDescriptors.forEach((cameraDescriptor) => {
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
  checkCraneCollision();
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
  perspectiveNear: 5.1,
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
    x: 0,
    y: 0,
    z: 0,
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
  Object.values(materials).forEach(
    (material) => (material.wireframe = !material.wireframe)
  );
}

init();
animate();
// Call createHUD function after DOM content is loaded
document.addEventListener("DOMContentLoaded", createHUD);

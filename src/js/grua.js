import * as THREE from "three";

var activeCamera, scene, renderer;

var geometry, material, mesh;

const BACKGROUND = new THREE.Color(0xeceae4);

var materialBase, materialWalls;
var materialCube, materialTorus, materialDodecahedron, materialTorusKnot, materialIcosahedron, materialParallelpiped;

var container;

var containerWidth = 10;
var containerHeight = 10;
var containerLength = 20;

var cubeSide = 2;

var parallelpipedWidth = 2;
var parallelpipedHeight = 5;
var parallelpipedLength = 2;

var torusRadius = 3;
var tubeRadius = 1;

var radius = 5

function createContainer(x, y, z) {
    'use strict';

    container = new THREE.Object3D();

    materialBase = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    materialWalls = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    // Base
    var baseGeometry = new THREE.BoxGeometry(containerLength, 1, containerWidth);
    var base = new THREE.Mesh(baseGeometry, materialBase);
    container.add(base);

    // Walls
    // Back wall
    var wallGeometry1 = new THREE.BoxGeometry(containerLength, containerHeight, 1);
    var wall1 = new THREE.Mesh(wallGeometry1, materialWalls);
    wall1.position.z = -(containerWidth / 2);
    wall1.position.y = containerHeight / 2;
    container.add(wall1);
    // Front wall
    var wallGeometry2 = new THREE.BoxGeometry(containerLength, containerHeight, 1);
    var wall2 = new THREE.Mesh(wallGeometry2, materialWalls);
    wall2.position.z = containerWidth / 2;
    wall2.position.y = containerHeight / 2;
    container.add(wall2);
    // Left wall
    var wallGeometry3 = new THREE.BoxGeometry(1, containerHeight, containerWidth);
    var wall3 = new THREE.Mesh(wallGeometry3, materialWalls);
    wall3.position.x = -(containerLength / 2);
    wall3.position.y = containerHeight / 2;
    container.add(wall3);
    // Right wall
    var wallGeometry4 = new THREE.BoxGeometry(1, containerHeight, containerWidth);
    var wall4 = new THREE.Mesh(wallGeometry4, materialWalls);
    wall4.position.x = (containerLength / 2);
    wall4.position.y = containerHeight / 2;
    container.add(wall4);

    container.position.set(x, y, z);
    scene.add(container);
}

function createCube(x, y, z) {
    'use strict';

    materialCube = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var cubeGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
    var cube = new THREE.Mesh(cubeGeometry, materialCube);
    cube.position.set(x, y + cubeSide / 2, z);
    scene.add(cube);
}

function createTorus(x, y, z) {
    'use strict';

    materialTorus = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius);
    var torus = new THREE.Mesh(torusGeometry, materialTorus);
    torus.position.set(x, y + torusRadius / 2, z);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

}

function createTorusKnot(x, y, z) {
    'use strict';

    materialTorusKnot = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusKnotGeometry(torusRadius, tubeRadius);
    var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(x, y + torusRadius / 2, z);
    scene.add(torus);
}

function createDodecahedron(x, y, z) {
    'use strict';

    materialDodecahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var dodecahedronGeometry = new THREE.DodecahedronGeometry(radius);
    var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecahedron);
    dodecahedron.position.set(x, y + radius / 2, z);
    scene.add(dodecahedron);
}

function createIcosahedron(x, y, z) {
    'use strict';

    materialIcosahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var icosahedronGeometry = new THREE.IcosahedronGeometry(radius);
    var icosahedron = new THREE.Mesh(icosahedronGeometry, materialIcosahedron);
    icosahedron.position.set(x, y + radius / 2, z);
    scene.add(icosahedron);

}

function createParallelpiped(x, y, z) {
    'use strict';

    materialParallelpiped = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var parallelpipedGeometry = new THREE.BoxGeometry(parallelpipedWidth, parallelpipedHeight, parallelpipedLength);
    var parallelpiped = new THREE.Mesh(parallelpipedGeometry, materialParallelpiped);
    parallelpiped.position.set(x, y + parallelpipedHeight / 2, z);
    scene.add(parallelpiped);
}

function createLoads() {
    let i = 0;
    while (i < 6) {
        let x = Math.random() * 100 - 50;
        let y = 0;
        let z = Math.random() * 100 - 50;

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
                if (!checkCollision(x, y, z, parallelpipedWidth, parallelpipedHeight, parallelpipedLength)) {
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
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addLowerMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 20);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTurntable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(2, 2, 1, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHigherMast(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 6);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addJib(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 39);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, Math.PI / 2, 0);
  obj.add(mesh);
}

function addCab(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 3);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addCounterweight(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 4);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addTowerPeak(obj, x, y, z) {
  "use strict";
  geometry = new THREE.TetrahedronGeometry(2, 0);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addRightLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 14.09, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, 0.47 * Math.PI);
  obj.add(mesh);
}

function addLeftLoadLine(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 8.16, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, 0.56 * Math.PI);
  obj.add(mesh);
}

function addHoist(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addSteelCable(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32); //1 depende de lambda
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(2, 2, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addHigherHook(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function addLowerHook(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  obj.add(mesh);
}

function createLowerCrane(x, y, z) {
  "use strict";

  var lowerCrane = new THREE.Object3D();

  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

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

  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

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

  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

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

function render() {
  "use strict";
  renderer.render(scene, activeCamera.camera);
}

function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: // '1'
      changeActiveCamera(cameras.front);
      break;
    case 50: // '2'
      changeActiveCamera(cameras.side);
      break;
    case 51: // '3'
      changeActiveCamera(cameras.top);
      break;
    case 52: // '4'
      changeActiveCamera(cameras.orthogonal);
      break;
    case 53: // '5'
      changeActiveCamera(cameras.perspective);
      break;
    case 54: // '6'
      //TODO activeCamera = cameraMovel;
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
}

function createCameras() {
  "use strict";
  // set the initial camera
  activeCamera = cameras.front;
  
  Object.values(cameras).forEach((cameraDescriptor) => {
    refreshCameraParameters(cameraDescriptor);
    cameraDescriptor.camera.lookAt(scene.position);
  });

    scene.add(new THREE.AxesHelper(10));

    createContainer(15, 0, 15);
    createLoads();
  
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

init();
animate();

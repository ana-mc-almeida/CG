import * as THREE from 'three';

var camera, scene, renderer;

var geometry, material, mesh;

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
    cube.position.set(x, y, z);
    scene.add(cube);
}

function createTorus(x, y, z) {
    'use strict';

    materialTorus = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius);
    var torus = new THREE.Mesh(torusGeometry, materialTorus);
    torus.position.set(x, y, z);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

}

function createTorusKnot(x, y, z) {
    'use strict';

    materialTorusKnot = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusKnotGeometry(torusRadius, tubeRadius);
    var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
    torus.position.set(x, y, z);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);
}

function createDodecahedron(x, y, z) {
    'use strict';

    materialDodecahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var dodecahedronGeometry = new THREE.DodecahedronGeometry(radius);
    var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecahedron);
    dodecahedron.position.set(x, y, z);
    scene.add(dodecahedron);
}

function createIcosahedron(x, y, z) {
    'use strict';

    materialIcosahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var icosahedronGeometry = new THREE.IcosahedronGeometry(radius);
    var icosahedron = new THREE.Mesh(icosahedronGeometry, materialIcosahedron);
    icosahedron.position.set(x, y, z);
    scene.add(icosahedron);

}

function createParallelpiped(x, y, z) {
    'use strict';

    materialParallelpiped = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var parallelpipedGeometry = new THREE.BoxGeometry(parallelpipedWidth, parallelpipedHeight, parallelpipedLength);
    var parallelpiped = new THREE.Mesh(parallelpipedGeometry, materialParallelpiped);
    parallelpiped.position.set(x, y, z);
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

    createContainer(15, 0, 15);
    createLoads();
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

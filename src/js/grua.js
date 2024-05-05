import * as THREE from 'three';

var camera, scene, renderer;

var geometry, material, mesh;

var materialBase, materialParedes, materialCube, materialTorus, materialDodecaedro, materialTorusKnot, materialIsocahedron, materialParallelpiped;

var container;

var larguraContainer = 10;
var alturaContainer = 10;
var comprimentoContainer = 20;

var ladoCubo = 2;

var larguraParallelpiped = 2;
var alturaParallelpiped = 5;
var comprimentoParallelpiped = 2;

var raioTorus = 3;
var raioTubo = 1;

var raio = 5

function createContainer(x, y, z) {
    'use strict';

    container = new THREE.Object3D();

    materialBase = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    materialParedes = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    // Base
    var baseGeometry = new THREE.BoxGeometry(comprimentoContainer, 1, larguraContainer);
    var base = new THREE.Mesh(baseGeometry, materialBase);
    container.add(base);

    // Paredes
    // Parede fundo
    var wallGeometry1 = new THREE.BoxGeometry(comprimentoContainer, alturaContainer, 1);
    var wall1 = new THREE.Mesh(wallGeometry1, materialParedes);
    wall1.position.z = -(larguraContainer / 2);
    wall1.position.y = alturaContainer / 2;
    container.add(wall1);
    // Parede frente
    var wallGeometry2 = new THREE.BoxGeometry(comprimentoContainer, alturaContainer, 1);
    var wall2 = new THREE.Mesh(wallGeometry2, materialParedes);
    wall2.position.z = larguraContainer / 2;
    wall2.position.y = alturaContainer / 2;
    container.add(wall2);
    // Parede esquerda
    var wallGeometry3 = new THREE.BoxGeometry(1, alturaContainer, larguraContainer);
    var wall3 = new THREE.Mesh(wallGeometry3, materialParedes);
    wall3.position.x = -(comprimentoContainer / 2);
    wall3.position.y = alturaContainer / 2;
    container.add(wall3);
    // Parede direita
    var wallGeometry4 = new THREE.BoxGeometry(1, alturaContainer, larguraContainer);
    var wall4 = new THREE.Mesh(wallGeometry4, materialParedes);
    wall4.position.x = (comprimentoContainer / 2);
    wall4.position.y = alturaContainer / 2;
    container.add(wall4);

    container.position.set(x, y, z);
    scene.add(container);
}

function createCube(x, y, z) {
    'use strict';

    materialCube = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var cubeGeometry = new THREE.BoxGeometry(ladoCubo, ladoCubo, ladoCubo);
    var cube = new THREE.Mesh(cubeGeometry, materialCube);
    cube.position.set(x, y, z);
    scene.add(cube);
}

function createTorus(x, y, z) {
    'use strict';

    materialTorus = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusGeometry(raioTorus, raioTubo);
    var torus = new THREE.Mesh(torusGeometry, materialTorus);
    torus.position.set(x, y, z);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

}

function createTorusKnot(x, y, z) {
    'use strict';

    materialTorusKnot = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var torusGeometry = new THREE.TorusKnotGeometry(raioTorus, raioTubo);
    var torus = new THREE.Mesh(torusGeometry, materialTorusKnot);
    torus.position.set(x, y, z);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);
}

function createDodecahedron(x, y, z) {
    'use strict';

    materialDodecaedro = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var dodecahedronGeometry = new THREE.DodecahedronGeometry(raio);
    var dodecahedron = new THREE.Mesh(dodecahedronGeometry, materialDodecaedro);
    dodecahedron.position.set(x, y, z);
    scene.add(dodecahedron);
}

function createIsocahedron(x, y, z) {
    'use strict';

    materialIsocahedron = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var isocahedronGeometry = new THREE.IcosahedronGeometry(raio);
    var isocahedron = new THREE.Mesh(isocahedronGeometry, materialIsocahedron);
    isocahedron.position.set(x, y, z);
    scene.add(isocahedron);

}

function createParallelpiped(x, y, z) {
    'use strict';

    materialParallelpiped = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var parallelpipedGeometry = new THREE.BoxGeometry(larguraParallelpiped, alturaParallelpiped, comprimentoParallelpiped);
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
                if (!verificarColisao(x, y, z, ladoCubo, ladoCubo, ladoCubo)) {
                    createCube(x, y, z);
                    i++;
                }
                break;
            case 1:
                if (!verificarColisao(x, y, z, raioTorus, raioTubo, raioTorus)) {
                    createTorus(x, y, z);
                    i++;
                }
                break;
            case 2:
                if (!verificarColisao(x, y, z, raioTorus, raioTubo, raioTorus)) {
                    createTorusKnot(x, y, z);
                    i++;
                }
                break;
            case 3:
                if (!verificarColisao(x, y, z, raio, raio, raio)) {
                    createDodecahedron(x, y, z);
                    i++;
                }
                break;
            case 4:
                if (!verificarColisao(x, y, z, raio, raio, raio)) {
                    createIsocahedron(x, y, z);
                    i++;
                }
                break;
            case 5:
                if (!verificarColisao(x, y, z, larguraParallelpiped, alturaParallelpiped, comprimentoParallelpiped)) {
                    createParallelpiped(x, y, z);
                    i++;
                }
                break;
            default:
                console.log("Erro");
        }
    }
}

function verificarColisao(x, y, z, largura, altura, comprimento) {

    let novaBoundingBox = new THREE.Box3(
        new THREE.Vector3(x - largura, y - altura, z - comprimento),
        new THREE.Vector3(x + largura, y + altura, z + comprimento)
    );

    for (let objeto of scene.children) {
        let boundingBox = new THREE.Box3().setFromObject(objeto, true);
        if (novaBoundingBox.intersectsBox(boundingBox)) {
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
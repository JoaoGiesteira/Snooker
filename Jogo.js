var renderer = null,
    scene = null,
    camera = null,
    camera2 = null,
    ground;

var bolas = [];
var bola;
var mesa;
var mira = null,
    Traco = null;

var friction = 0.3;
var restitution = 0.8;
var forca = 100;
var encr = 1;
var encg = 5;

var ang = 0;
var ang_camera = 0;

var pontos = 0;
var start = 0;

var d = 0;
var a = 0;
var c = 0;

var txt;


window.onload = function init() {
    Physijs.scripts.worker = './libs/physijs_worker.js';

    // criar o render
    var canvas = document.getElementById("webglcanvas");
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    var W = canvas.width;
    var H = canvas.height;

    // vista
    renderer.setSize(W, H);
    renderer.setClearColor("#000000");
    renderer.shadowMap.enabled = true;

    // criar cena physis
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -50, 0));

    scene.addEventListener('update',
        function () {
            scene.simulate();
        }
    );

    // adicionar camaras para ver a cena
    camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.set(0, 100, 0);
    camera.lookAt(scene.position);
    scene.add(camera);

    camera2 = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera2.lookAt(scene.position);
    scene.add(camera2);

    //Luzes
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // criação do ambiente

    //chao
    var ground_material = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0 });

    var ground_PhysiMat = Physijs.createMaterial(
        ground_material,
        0.3,  
        0); 
    ground = new Physijs.BoxMesh(
        new THREE.PlaneBufferGeometry(200, 100, 20, 20),
        ground_PhysiMat,
        0      
    );
    ground.rotation.x = -0.5 * Math.PI;
    ground.position.y = 2.4;
    ground.scale.set(1, 1, 1);
    ground.receiveShadow = true;
    scene.add(ground);

    //mesa
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/SnookerOBJ/snookertable.mtl', function (materials) {
        materials.preload();
        var loader = new THREE.OBJLoader();
        loader.setMaterials(materials);
        loader.load('./models/SnookerOBJ/snookertable.obj', function (object) {
            loader.setMaterials(materials);
            mesa = object;
            mesa.scale.set(0.5, 0.5, 0.5);
            scene.add(mesa);
        });
    });

    addparedes();
    addBolas();
    addMira();
    imp_text(); // impressao de dados no html

    render();

    scene.simulate();
}

function addparedes() {
    // parede norte (-z));
    var material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.5 }),
        0,
        restitution, 10
    );

    var paredeNorte = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 78.5),
        material
    );
    paredeNorte.position.set(-95.5, 3, 0);
    scene.add(paredeNorte);

    // parede oestecima (-z,-x)
    var paredeOestecima = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 85),
        material
    );
    paredeOestecima.position.set(-45.5, 3, -45.5);
    paredeOestecima.rotation.y = Math.PI / 2;
    scene.add(paredeOestecima);

    // parede oestebaixo (-z,x)
    var paredeOestebaixo = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 85),
        material
    );
    paredeOestebaixo.position.set(45.5, 3, -45.5);
    paredeOestebaixo.rotation.y = Math.PI / 2;
    scene.add(paredeOestebaixo);

    // parede estecima (z,-x)
    var paredeEstecima = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 85),
        material
    );
    paredeEstecima.position.set(-45.5, 3, 45.5);
    paredeEstecima.rotation.y = Math.PI / 2;
    scene.add(paredeEstecima);

    // parede estebaixo (z,x)
    var paredeEstebaixo = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 85),
        material
    );
    paredeEstebaixo.position.set(45.5, 3, 45.5);
    paredeEstebaixo.rotation.y = Math.PI / 2;
    scene.add(paredeEstebaixo);

    var paredeSul = new Physijs.BoxMesh(
        new THREE.CubeGeometry(5, 2, 78.5),
        material
    );
    paredeSul.position.set(95.5, 3, 0);
    scene.add(paredeSul);
}

function addBolas() {
    var bola_material2 = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0xFFFFFF }),
        friction, 
        restitution); 

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        2 
    );
    bola.position.set(0, 3.8, 0);
    bola.castShadow = true;
    bola.name = 'branca';
    scene.add(bola);
    bolas.push(bola);

    // add vermelha linha 1
    var bola_material2 = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0xFF0000 }),
        friction,
        restitution);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
    bola.position.set(50, 3.9, 0);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    // add vermelha linha 2
    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1
    );
    bola.position.set(53, 3.9, 1.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
    bola.position.set(53, 3.9, -1.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    // add vermelha linha 3
    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
    bola.position.set(56, 3.9, -3);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1
    );
    bola.position.set(56, 3.9, 0);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1
    );
    bola.position.set(56, 3.9, 3);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    // add vermelha linha 4
    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
    bola.position.set(59, 3.9, -4.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1  
    );
    bola.position.set(59, 3.9, -1.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
    bola.position.set(59, 3.9, 1.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1  
    );
    bola.position.set(59, 3.9, 4.5);
    bola.castShadow = true;
    bola.name = 'vermelha';
    scene.add(bola);
    bolas.push(bola);

    var bola = new Physijs.BoxMesh(
        new THREE.SphereGeometry(1.5, 50, 50),
        bola_material2,
        1 
    );
}

function addMira() {
    mira = new THREE.Object3D();

    // criar ponto referencia
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    Ref = new THREE.Mesh(geometry, material);
    Ref.position = bolas[0].position;
    mira.add(Ref);

    // criar ponto traço
    var geometry = new THREE.BoxGeometry(10, 0.5, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.7 });
    Traco = new THREE.Mesh(geometry, material)
    Traco.position.x = Ref.position.x + 0.5 + 5;
    Traco.position.z = Ref.position.z;
    Traco.position.y = 3.9;
    Ref.add(Traco);
    scene.add(mira);
}

function actualizar_mira() {
    mira.position.x = bolas[0].position.x;
    mira.position.z = bolas[0].position.z;
}

function render() {

    if (c == 0) {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    if (c == 1) {
        renderer.render(scene, camera2);
        requestAnimationFrame(render);
        up_camera2();
    }

    detetar_buracos();
    detetar_mov_mira();

    if (bolas[0]._physijs.linearVelocity.x == 0 && bolas[0]._physijs.linearVelocity.z == 0 && mira == null) {
        addMira();
        actualizar_mira();
        start = 0;
    }
    if (start == 1) {
        scene.remove(mira);
        mira = null;
    }
    if (bolas.length == 1) {
        alert("Parabéns completaste o desafio, e acabaste com " + pontos + " pontos, por favor faça refresh na página");
        window.setTimeout(refresh(), 3000);
    }
}

function detetar_buracos() {
    for (var i = 0; i < bolas.length; i++) {
        if (bolas[i].position.x >= 92.5 || bolas[i].position.x < -92.5 || bolas[i].position.z >= 43.5 || bolas[i].position.z < -43.5) {
            console.log(bolas.length);
            if (bolas[i].name == "vermelha") {
                console.log(bolas[i].name);
                scene.remove(bolas[i]);
                bolas.splice(i, 1);
                pontos += 5;
                document.getElementById("pontos").innerHTML = pontos;
            }

            if (bolas[i].name == "branca") {
                console.log(bolas[i].name);
                scene.remove(bolas[i]);
                bolas.splice(i, 1);
                alert("Perdeste por meter a bola branca, e acabaste com " + pontos + " pontos!!!");
                window.setTimeout(refresh(), 3000);
            }
        }
    }
}

function refresh() {
    location.reload();
}

function detetar_mov_mira() {
    if (d == 1) {
        ang -= encr;
        mira.rotation.y -= encr * Math.PI / 180;
    }
    if (a == 1) {
        ang += encr;
        mira.rotation.y += encr * Math.PI / 180;
    }
}

function up_camera2() {
    ang_camera += 0.5;
    camera2.position.set(200 * Math.cos(ang_camera * Math.PI / 180), 100, 200 * Math.sin(ang_camera * Math.PI / 180));
    camera2.lookAt(scene.position);
}

function imp_text() {
    txt = forca / 2 + "%"
    document.getElementById("forca").style.width = txt;
}

document.onkeydown = function handleKeyDown(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == "D" && start == 0) {
        d = 1;
    }
    if (key == "A" && start == 0) {
        a = 1;
    }
    if (key == "C") {
        c = 1;
    }
}
document.onkeyup = function handleKeyUp(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == " " && start == 0) {
        bolas[0].applyCentralImpulse(new THREE.Vector3(forca * Math.cos(ang * Math.PI / 180), 0, -forca * Math.sin(ang * Math.PI / 180)));
        ang = 0;
        start = 1;
    }
    if (key == "D") {
        d = 0;
    }
    if (key == "A") {
        a = 0;
    }
    if (key == "C") {
        c = 0;
    }
    if (key == "W") {
        if (forca < 200) {
            forca += encg;
            imp_text();
        }
        forca += encg;
    }
    if (key == "S") {
        if (forca > 0) {
            forca -= encg;
            imp_text();
        }
    }
}

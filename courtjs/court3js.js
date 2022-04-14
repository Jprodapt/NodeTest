import * as THREE from 'three';
import { OrbitControls } from '/OrbitControls.js'
import { GUI } from '/lil-gui.module.min.js';
import { DragControls } from '/DragControls.js';

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var uuidCookie = getCookie('uuidCookie');
console.log(uuidCookie);

var courtCacheCookie = getCookie('courtCacheCookie');
console.log(courtCacheCookie);

var allProperties = {};


var socket = io();
socket.on('propChanges', function (msg) {
    //console.log(msg);
    const obj = JSON.parse(msg);
    //console.log(eval(obj.meshName));
    var meshobj = eval(obj.meshName);
    if (obj.meshName === "centerCircleMesh") {
        centerCircleMesh.material.map = new THREE.TextureLoader().load(obj.value);
    } else
        meshobj.material.color = new THREE.Color(obj.value);
});



const renderControls = new function () {
    const gui = new GUI();
    this.addControls = function () {
        var obj = {
            "Left half color": '#00ff00',
            "Court color": '#00ff00',
            "Right half color": '#156289',
            "Border color": '#ffffff',
            "Keys color": "#f53259",
            "Line color": "#ff0000",
        }

        gui.addColor(obj, 'Left half color').onChange(value => {
            plane1Mesh.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "plane1Mesh", "value": value });
        });;

        gui.addColor(obj, 'Right half color').onChange(value => {
            plane2Mesh.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "plane2Mesh", "value": value });
        });;

        gui.addColor(obj, 'Court color').onChange(value => {
            plane1Mesh.material.color = new THREE.Color(value);
            plane2Mesh.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "plane2Mesh", "value": value });
            socket.emit('propChanges', { "meshName": "plane1Mesh", "value": value });
        });;

        gui.addColor(obj, 'Border color').onChange(value => {
            borderupPlane1Mesh.material.color = new THREE.Color(value);
            borderbottomPlane1Mesh.material.color = new THREE.Color(value);
            borderleftPlane1Mesh.material.color = new THREE.Color(value);
            borderrightPlane1Mesh.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "borderupPlane1Mesh", "value": value });
            socket.emit('propChanges', { "meshName": "borderbottomPlane1Mesh", "value": value });
            socket.emit('propChanges', { "meshName": "borderleftPlane1Mesh", "value": value });
            socket.emit('propChanges', { "meshName": "borderrightPlane1Mesh", "value": value });

        });;
        gui.addColor(obj, 'Keys color').onChange(value => {
            keysrightPlane1Mesh.material.color = new THREE.Color(value);
            keysleftPlane1Mesh.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "keysrightPlane1Mesh", "value": value });
            socket.emit('propChanges', { "meshName": "keysleftPlane1Mesh", "value": value });
        });;
        gui.addColor(obj, 'Line color').onChange(value => {
            ellipseRight.material.color = new THREE.Color(value);
            ellipseLeft.material.color = new THREE.Color(value);
            ellipseLeftBig.material.color = new THREE.Color(value);
            ellipseRightBig.material.color = new THREE.Color(value);
            renderer.render(scene, camera);
            socket.emit('propChanges', { "meshName": "ellipseRight", "value": value });
            socket.emit('propChanges', { "meshName": "ellipseLeft", "value": value });
            socket.emit('propChanges', { "meshName": "ellipseLeftBig", "value": value });
            socket.emit('propChanges', { "meshName": "ellipseRightBig", "value": value });

        });;
        const teamLogoFolder = gui.addFolder('Team Logo')
        var team = { "Pick a team": '' }
        gui.add(team, 'Pick a team', { 'Boston': 'A', 'Golden State': 'B', 'Detroit': 'C' }).onChange(value => {
            if (value == 'A') {
                centerCircleMesh.material.map = new THREE.TextureLoader().load('boston.png')
                socket.emit('propChanges', { "meshName": "centerCircleMesh", "value": "boston.png" });
            }
            if (value == 'B') {
                centerCircleMesh.material.map = new THREE.TextureLoader().load('warriors.png')
                socket.emit('propChanges', { "meshName": "centerCircleMesh", "value": "warriors.png" });
            }
            if (value == 'C') {
                centerCircleMesh.material.map = new THREE.TextureLoader().load('detroit.png')
                socket.emit('propChanges', { "meshName": "centerCircleMesh", "value": "detroit.png" });
            }


        });
        teamLogoFolder.close()

        const textureBorderFolder = gui.addFolder('Center court Texture')
        var centerCourt = { "Pick texture for Center court": '' }
        gui.add(centerCourt, 'Pick texture for Center court', { 'Texture1': 'A', 'Texture2': 'B', 'Texture3': 'C' }).onChange(value => {
            plane1Mesh.material.color = null;
            if (value == 'A') {
                plane1Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture1.jpg')
                plane2Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture1.jpg')
                //socket.emit('propChanges', {"meshName":"borderupPlane1Mesh", "value":"woodtexture1.jpg"});
            }
            if (value == 'B') {
                plane1Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture2.jpg')
                plane2Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture2.jpg')
                //socket.emit('propChanges', {"meshName":"borderupPlane1Mesh", "value":"woodtexture2.jpg"});
            }
            if (value == 'C') {
                plane1Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture3.jpg')
                plane2Mesh.material.map = new THREE.TextureLoader().load('courtTexture/woodtexture3.jpg')
                //socket.emit('propChanges', {"meshName":"borderupPlane1Mesh", "value":"woodtexture3.jpg"});
            }

            renderer.render(scene, camera);

        });
        textureBorderFolder.close();

    }
}


//Have mesh attributes outside for manuipulation throught controls. 
//Center court divided into two halves
var plane1Mesh, plane2Mesh;
//Border divided into 4 planes
var borderupPlane1Mesh, borderbottomPlane1Mesh, borderleftPlane1Mesh, borderrightPlane1Mesh;
//Lines 
var lineplane2Mesh, ellipseRight, ellipseLeft, ellipseLeftBig, ellipseRightBig;
//Goal variables
var poleLcylinder, poleRcylinder;
//Center Circle and Keys
var centerCircleMesh, keysrightPlane1Mesh, keysleftPlane1Mesh;
//Hoops
var hoopLeftPlane1Mesh, hoopRightPlane1Mesh;



const createCenterCourt = function () {
    var geometry1 = new THREE.PlaneGeometry(10, 10);
    //var material1 = new THREE.MeshBasicMaterial({ color: 0x2c9fd8, side: THREE.DoubleSide });
    const material1 = new THREE.MeshBasicMaterial({
        //
        side: THREE.DoubleSide,
        depthWrite: true,
        map: new THREE.TextureLoader().load('courtTexture/woodtexture1.jpg')

    });
    plane1Mesh = new THREE.Mesh(geometry1, material1);
    plane1Mesh.position.set(0, 0, 0);
    var geometry2 = new THREE.PlaneGeometry(10, 10);
    //var material2 = new THREE.MeshBasicMaterial({ color: 0x2c9fd8, side: THREE.DoubleSide });
    const material2 = new THREE.MeshBasicMaterial({
        //
        side: THREE.DoubleSide,
        depthWrite: true,
        map: new THREE.TextureLoader().load('courtTexture/woodtexture1.jpg')

    });
    plane2Mesh = new THREE.Mesh(geometry2, material2);
    plane2Mesh.position.set(10, 0, 0);

    plane2Mesh.castShadow = true;
    plane2Mesh.receiveShadow = true;
    plane1Mesh.castShadow = true;
    plane1Mesh.receiveShadow = true;

    group.add(plane1Mesh);
    group.add(plane2Mesh);
    

}

var createBorder = function () {
    var borderupGeometry = new THREE.PlaneGeometry(22, 1.2);
    var borderupMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    borderupPlane1Mesh = new THREE.Mesh(borderupGeometry, borderupMaterial);
    borderupPlane1Mesh.name='borderupPlane1Mesh';
    borderupPlane1Mesh.position.set(5, 5.6, 0);

    var borderbottomGeometry = new THREE.PlaneGeometry(22, 1.2);
    var borderbottomMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    borderbottomPlane1Mesh = new THREE.Mesh(borderbottomGeometry, borderbottomMaterial);
    borderbottomPlane1Mesh.name='borderbottomPlane1Mesh';
    borderbottomPlane1Mesh.position.set(5, -5.6, 0);

    var borderleftGeometry = new THREE.PlaneGeometry(1, 12);
    var borderleftMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    borderleftPlane1Mesh = new THREE.Mesh(borderleftGeometry, borderleftMaterial);
    borderleftPlane1Mesh.name='borderleftPlane1Mesh';
    borderleftPlane1Mesh.position.set(-5.5, 0, 0);

    var borderrightGeometry = new THREE.PlaneGeometry(1, 12);
    var borderrightMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    borderrightPlane1Mesh = new THREE.Mesh(borderrightGeometry, borderrightMaterial);
    borderrightPlane1Mesh.name='borderrightPlane1Mesh';
    borderrightPlane1Mesh.position.set(15.5, 0, 0);

    group.add(borderupPlane1Mesh);
    group.add(borderbottomPlane1Mesh);
    group.add(borderleftPlane1Mesh);
    group.add(borderrightPlane1Mesh);

    

}

const createAllLines = function () {
    //Centerline made it a plane 
    var linegeometry2 = new THREE.PlaneGeometry(0.05, 10);
    var linematerial2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    lineplane2Mesh = new THREE.Mesh(linegeometry2, linematerial2);
    lineplane2Mesh.position.set(5, 0, 0.025);

    //Left small curve
    const curveLeft = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        1.5, 1.5,           // xRadius, yRadius
        1.5 * Math.PI, 0.5 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const curveLPoints = curveLeft.getPoints(50);
    const curveLGeometry = new THREE.BufferGeometry().setFromPoints(curveLPoints);
    const curveLMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    // Create the final object to add to the scene
    ellipseLeft = new THREE.Line(curveLGeometry, curveLMaterial);

    //Right small curve
    const curveRight = new THREE.EllipseCurve(
        10, 0,            // ax, aY
        1.5, 1.5,           // xRadius, yRadius
        0.5 * Math.PI, 1.5 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const curveRPoints = curveRight.getPoints(50);
    const curveRGeometry = new THREE.BufferGeometry().setFromPoints(curveRPoints);
    const curveRMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    // Create the final object to add to the scene
    ellipseRight = new THREE.Line(curveRGeometry, curveRMaterial);

    //Left big curve
    const curveLeftBig = new THREE.EllipseCurve(
        -5, 0,            // ax, aY
        6.57, 5,           // xRadius, yRadius
        1.5 * Math.PI, 0.5 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const curveLPointsBig = curveLeftBig.getPoints(100);
    const curveLGeometryBig = new THREE.BufferGeometry().setFromPoints(curveLPointsBig);
    const curveLMaterialBig = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 100 });
    // Create the final object to add to the scene
    ellipseLeftBig = new THREE.Line(curveLGeometryBig, curveLMaterialBig);

    //Right big curve
    const curveRightBig = new THREE.EllipseCurve(
        15, 0,            // ax, aY
        6.57, 5,           // xRadius, yRadius
        0.5 * Math.PI, 1.5 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const curveRPointsBig = curveRightBig.getPoints(50);
    const curveRGeometryBig = new THREE.BufferGeometry().setFromPoints(curveRPointsBig);
    const curveRMaterialBig = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    // Create the final object to add to the scene
    ellipseRightBig = new THREE.Line(curveRGeometryBig, curveRMaterialBig);



    //Add to the group
    group.add(lineplane2Mesh);
    group.add(ellipseLeft);
    group.add(ellipseRight);
    group.add(ellipseLeftBig);
    group.add(ellipseRightBig);

}

var createPoles = function () {

    //Pole left
    const poleLgeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 5);
    const poleLmaterial = new THREE.MeshBasicMaterial({ color: 0x465962 });
    poleLcylinder = new THREE.Mesh(poleLgeometry, poleLmaterial);
    poleLcylinder.position.set(-5, 0, 1.5);
    poleLcylinder.rotation.x = Math.PI / 2;


    //Pole right
    const poleRgeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 5);
    const poleRmaterial = new THREE.MeshBasicMaterial({ color: 0x465962 });
    poleRcylinder = new THREE.Mesh(poleRgeometry, poleRmaterial);
    poleRcylinder.position.set(15, 0, 1.5);
    poleRcylinder.rotation.x = Math.PI / 2;

    //Add to group
    group.add(poleRcylinder);
    group.add(poleLcylinder);
}

var createHoops = function () {
    //Hoop left
    var hoopLeftGeometry = new THREE.PlaneGeometry(2.5, 1.5);
    var hoopLeftMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('hoop3.jpg')
    });
    hoopLeftPlane1Mesh = new THREE.Mesh(hoopLeftGeometry, hoopLeftMaterial);
    hoopLeftPlane1Mesh.position.set(-4.85, 0, 2.5);
    hoopLeftPlane1Mesh.rotation.y = Math.PI / 2;
    hoopLeftPlane1Mesh.rotation.z = Math.PI / 2;

    //Hoop right
    var hoopRightGeometry = new THREE.PlaneGeometry(2.5, 1.5);
    var hoopRightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('hoop3.jpg')
    });
    hoopRightPlane1Mesh = new THREE.Mesh(hoopRightGeometry, hoopRightMaterial);
    hoopRightPlane1Mesh.position.set(14.85, 0, 2.5);
    hoopRightPlane1Mesh.rotation.y = Math.PI / 2;
    hoopRightPlane1Mesh.rotation.z = Math.PI / 2;

    group.add(hoopRightPlane1Mesh);
    group.add(hoopLeftPlane1Mesh);
}


var createCenterCircle = function () {
    const centerCircleGeometry = new THREE.CircleGeometry(2, 50);
    const centerCircleMaterial = new THREE.MeshBasicMaterial({
        //
        side: THREE.DoubleSide,
        depthWrite: true,
        map: new THREE.TextureLoader().load('basketball1.jpg')

    });
    centerCircleMesh = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
    centerCircleMesh.position.set(5, 0, 0.025);
    group.add(centerCircleMesh);
}


var createKeys = function () {
    var keysrightGeometry = new THREE.PlaneGeometry(5, 3);
    var keysrightMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    keysrightPlane1Mesh = new THREE.Mesh(keysrightGeometry, keysrightMaterial);
    keysrightPlane1Mesh.position.set(12.5, 0, 0.025);

    var keysleftGeometry = new THREE.PlaneGeometry(5, 3);
    var keysleftMaterial = new THREE.MeshBasicMaterial({ color: 0x9b1c1c, side: THREE.DoubleSide });
    keysleftPlane1Mesh = new THREE.Mesh(keysleftGeometry, keysleftMaterial);
    keysleftPlane1Mesh.position.set(-2.5, 0, 0.025);
    group.add(keysrightPlane1Mesh);
    group.add(keysleftPlane1Mesh);
}

var  printAllObjects = function(){
    scene.traverse( function( object ) {
        if ( object.isMesh ) console.log( object );
    } );
}



// init renderer
var renderer = new THREE.WebGLRenderer({ canvas: artifactCanvas });

//document.getElementById('viewport').appendChild(renderer.domElement);

let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
renderer.setSize(WIDTH * 0.75, HEIGHT * 0.75);
//renderer.setSize(1024, 800);

// Create the scene
var scene = new THREE.Scene();

scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
//scene.background = new THREE.Color("#fff");

// Create the camera
var aspectRatio = WIDTH / HEIGHT;
var fieldOfView = 10;
var nearPlane = 5;
var farPlane = 1000;
var camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
);

// Set the position of the camera
camera.position.x = 0;
camera.position.z = 80;
camera.position.y = -180;


var controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = true;


//create a group and all objects to the group
//All meshes can now be rotated / scaled etc as a group
const group = new THREE.Group();
group.position.set(-7.5, -28.5, 0);
group.scale.set(2.0, 1.2, 1.5);
scene.add(group);

const lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(- 100, - 200, - 100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

// Load the background texture
var backgroundTexture = new THREE.TextureLoader().load('background/Beach.jpg ')
var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
        map: backgroundTexture
    }));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);

//render
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);

    //document.getElementById('artifactCanvas').appendChild(renderer.domElement);
})

function createCourtComponents() {
    renderControls.addControls();
    createCenterCourt();
    createBorder();
    createAllLines();
    createPoles();
    createHoops();
    createKeys();
    createCenterCircle();
    printAllObjects();
}

createCourtComponents();



const allCarouselImages = document.querySelectorAll('.carousel-item');
allCarouselImages.forEach(function (carouselItem) {
    const image = carouselItem.children[0];
    //console.log(image);
    image.onclick = changeBackground;
});


function changeBackground() {
    //console.log("Changing to this image:::   "+this);
    //console.log("Changint to this image:::   "+this.currentSrc);
    let name = this.currentSrc;
    let nameSplit = name.split("/");
    let lastSplit = nameSplit[nameSplit.length - 1];
    //console.log(lastSplit);
    if (name.includes("carouselImages"))
        backgroundMesh.material.map = new THREE.TextureLoader().load("carouselImages/" + lastSplit)
    else {
        //console.log("change to court")
        plane1Mesh.material.map = new THREE.TextureLoader().load('courtTexture/' + lastSplit);
        plane2Mesh.material.map = new THREE.TextureLoader().load('courtTexture/' + lastSplit);
    }

}



export { backgroundMesh };


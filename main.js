import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Define elements: scene (required), renderder (required), camera (required), a model loader (filetype specific), lights, controls (for mouse and keyboard interaction)
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const controls = new OrbitControls( camera, renderer.domElement );
let loadedModel;
function setScene() {
    //Enable shadows on renderer
    renderer.shadowMap.enabled = true;

    //Set renderer size to window size, could be a number if you want it in x pixels
    renderer.setSize( window.innerWidth, window.innerHeight );

    //Add the two lights we defined to the scene, set position of directional light
    scene.add(light);
    scene.add(directionalLight);


    //Add a background color
    scene.background = new THREE.Color( 'skyblue' );


    //Set camera position
    camera.position.set(2, 2, 2);
    //Set orbitcontrols target
    controls.target.set(0, 0, 0);

    //Set directional light position
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
}

function addPlane() {
    //Add a plane 
    const geometry = new THREE.PlaneGeometry( 10, 10 );
    const material = new THREE.MeshStandardMaterial({ color: 'blue', side: THREE.DoubleSide, roughness: 0, metalness: 0 });
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add( plane );
}

function addModel() {
    //Load our model
    loader.load( 'model.glb', function ( gltf ) {
        loadedModel = gltf.scene;
        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
}

function addSphere(){
    // Create sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Radius 0.5, 32 segments
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'red' }); // Shadow-capable material
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Enable shadows for the sphere
    sphere.castShadow = true;

    // Position the sphere above the plane
    sphere.position.set(0, 0.5, 0); // X = 0, Y = 1 (above plane), Z = 0

    // Add the sphere to the scene
    scene.add(sphere);
}
setScene();
addPlane();
addSphere();
//addModel();
function animate() {
    requestAnimationFrame(animate);
    if (loadedModel) {
        loadedModel.rotation.y += 0.01; // Rotate around the Y-axis
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

document.body.appendChild( renderer.domElement );

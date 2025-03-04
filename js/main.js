//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'man_in_suit';
let objVar = objToRender

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);

    // Center the model
    object.position.set(0, -object.children[0].position.y, 0);
    object.rotation.x = -100;
    // Compute the bounding box of the model
    const bbox = new THREE.Box3().setFromObject(object);
    const center = bbox.getCenter(new THREE.Vector3()); // Model center
    const size = bbox.getSize(new THREE.Vector3()); // Model size

    // Adjust the camera position based on model size
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    let cameraDistance = maxDim / (2 * Math.tan(fov / 2)); // Distance formula

    camera.position.set(center.x, center.y + maxDim * 0.5, center.z + cameraDistance); // Positioning camera
    camera.lookAt(center); // Focus on model center

    // console.log("Camera repositioned to:", camera.position);
  },
  function (xhr) {
    //While it is loading, log the progress
    // console.log(objToRender)
    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);


document.getElementById("container3D").appendChild(renderer.domElement);



const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500)
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);


function animate() {
  requestAnimationFrame(animate);
  if (object) {
    // Calculate desired rotation
    let targetRotationY = -1.5 + (mouseX / window.innerWidth) * 3;
    let targetRotationX = -1.2 + (mouseY * 2.5) / window.innerHeight;
    object.rotation.y = Math.max(-0.5, Math.min(0.5, targetRotationY)); // Limit Y rotation
    object.rotation.x = Math.max(-0.5, Math.min(0.5, targetRotationX)); // Limit X rotation


    // console.log(`FROM: ${object.rotation.x} ${object.rotation.y}`);
    // console.log(`TO: ${object.rotation.x} ${object.rotation.y} ${object.rotation.z}`);
  }
  renderer.render(scene, camera);
}


window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
const canvas = renderer.domElement;

canvas.addEventListener("mouseenter", () => {
  canvas.addEventListener("mousemove", onMouseMove);
});

canvas.addEventListener("mouseleave", () => {
  canvas.removeEventListener("mousemove", onMouseMove);
});

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;


}



animate();
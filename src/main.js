import * as THREE from "three";
//console.log(THREE);
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";




//scene
const scene = new THREE.Scene(); //create new scene

//camera
const camera = new THREE.PerspectiveCamera(
  75, //field of view
  window.innerWidth / window.innerHeight, //aspect ratio

  0.1, //near
  100 //far
);
scene.add(camera);
camera.position.z = 5; //move the camera back 5 unit


//render
const renderer = new THREE.WebGLRenderer({ antialias: true }); //for smooth egde
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffff, 1); //background clr
document.body.appendChild(renderer.domElement); //add render to html

//ambient lights
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color,intencity,distance,decay
//ambientLight.position = camera.position; //lights follow camera
scene.add(ambientLight);

//directional lights
let sunlight = new THREE.DirectionalLight(0xddddd, 1.0); //color,intencity
sunlight.position.y = 15;
scene.add(sunlight);

let geometry = new THREE.BoxGeometry(1, 1, 1); //create 3D box obj
let metirial = new THREE.MeshBasicMaterial({ color: 0xff000 }); //colored obj
let cube = new THREE.Mesh(geometry, metirial);
//scene.add(cube);

//controlls
//event lisent for when press keys
document.addEventListener("keydown", onkeydown, false);

//texcure of the floor
let floorTexture = new THREE.TextureLoader().load("/src/img/floor.png");

const material = new THREE.MeshBasicMaterial({ map: floorTexture });

//create floor
let planeGeometry = new THREE.PlaneGeometry(50, 50); //boxgeometry is the shape of the object
let planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floorplane = new THREE.Mesh(planeGeometry, planeMaterial);
floorplane.rotation.x = Math.PI / 2;
floorplane.position.y = -Math.PI;

scene.add(floorplane);

//create walls
let wallGroup = new THREE.Group();
scene.add(wallGroup);

//frontwalle
const frontwall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "rgb(100, 95, 92)" })
);
frontwall.position.z = -20;

//leftwall
const leftwall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "rgb(100, 95, 92)" })
);
leftwall.rotation.y = Math.PI / 2;
leftwall.position.x = -20;

//rightwall
const rightwall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "rgb(100, 95, 92)" })
);
rightwall.rotation.y = Math.PI / 2;
rightwall.position.x = 20;

// backwall
const backwall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "rgb(100, 95, 92)" })
);
backwall.position.z = 20; // Placing it opposite to the front wall

wallGroup.add(frontwall, leftwall, rightwall, backwall);

//loop through the each wall and create bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].Bbox = new THREE.Box3();
  wallGroup.children[i].Bbox.setFromObject(wallGroup.children[i]);
}
function checkCollision() {
  // Create player's bounding box
  const playerBoundingBox = new THREE.Box3();
  const cameraworldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraworldPosition); // Get the player's position in world space
  playerBoundingBox.setFromCenterAndSize(
    cameraworldPosition,
    new THREE.Vector3(1, 1, 1)
  ); // Set the player's bounding box (size is 1x1x1)

  // Loop through each wall and check for collisions
  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];

    // Create the wall's bounding box
    const wallBoundingBox = new THREE.Box3().setFromObject(wall); // Set the bounding box based on the wall's mesh

    // Check if player's bounding box intersects with the wall's bounding box
    if (playerBoundingBox.intersectsBox(wallBoundingBox)) {
      return true; // Collision detected
    }
  }

  return false; // No collision
}

// // Create Ceiling
//texcure of the floor
let ceilingTexture = new THREE.TextureLoader().load("/src/img/ceiling.png");

const materialceiling = new THREE.MeshBasicMaterial({ map: ceilingTexture });

//create floor
let ceilingGeometry = new THREE.PlaneGeometry(50, 50); //boxgeometry is the shape of the object
let ceilingMaterial = new THREE.MeshBasicMaterial({
  map: ceilingTexture,
  side: THREE.DoubleSide,
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = Math.PI / 2;
ceilingPlane.position.y = Math.PI;

scene.add(ceilingPlane);

// Function to create paintings
function createPainting(imageurl, width, height, position, rotationY = 0) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageurl);
  const paintingMaterial = new THREE.MeshBasicMaterial({ map: paintingTexture });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  
  painting.position.set(position.x, position.y, position.z);
  painting.rotation.y = rotationY;
  
  return painting;
}

// Front Wall Paintings
const frontPaintings = [
  createPainting("/src/img/wizarex.jpg", 5, 5, new THREE.Vector3(-13, 0, -19.99)),
  createPainting("/src/img/paint2.jpg", 5,5, new THREE.Vector3(-4, 0, -19.99)),
  createPainting("/src/img/3.jpg", 8, 3, new THREE.Vector3(5, 0, -19.99)),
  createPainting("/src/img/4.jpg", 8, 3, new THREE.Vector3(15, 0, -19.99))
];
//back wall paings
const backPaintings = [
  createPainting("/src/img/10.jpg", 8, 3, new THREE.Vector3(-15, 0, 19.5), Math.PI),
  createPainting("/src/img/19.jpg", 5, 5, new THREE.Vector3(-4, 0, 19.5), Math.PI),
  createPainting("/src/img/0.jpg", 8, 3, new THREE.Vector3(6, 0, 19.5), Math.PI),
  createPainting("/src/img/23.jpg", 8, 3, new THREE.Vector3(15, 0, 19.5), Math.PI)
];


// Left Wall Paintings (Rotated 90°)
const leftPaintings = [
  createPainting("/src/img/api.jpg", 6, 3, new THREE.Vector3(-19.99, 0, -15), Math.PI / 2),
  createPainting("/src/img/1.jpg", 8, 3, new THREE.Vector3(-19.99, 0, -5), Math.PI / 2),
  createPainting("/src/img/11.jpg", 8, 3, new THREE.Vector3(-19.99, 0, 5), Math.PI / 2),
  createPainting("/src/img/12.jpg", 8, 3, new THREE.Vector3(-19.99, 0, 15), Math.PI / 2)
];

// Right Wall Paintings (Rotated -90°)
const rightPaintings = [
  createPainting("/src/img/13.jpg", 8, 3, new THREE.Vector3(19.99, 0, -15), -Math.PI / 2),
  createPainting("/src/img/14.jpg", 8, 3, new THREE.Vector3(19.99, 0, -5), -Math.PI / 2),
  createPainting("/src/img/15.jpg", 8, 3, new THREE.Vector3(19.99, 0, 5), -Math.PI / 2),
  createPainting("/src/img/16.jpg", 8, 3, new THREE.Vector3(19.99, 0, 15), -Math.PI / 2)
];

// Add all paintings to the scene
scene.add(
  ...frontPaintings,
  ...backPaintings,
  ...leftPaintings,
  ...rightPaintings
);




//controlls
const controls = new PointerLockControls(camera, document.body);

//lock the pointer (controls are activeted)and hide the menue when the expieriance starts
function startExpirience() {
  //lock the pointer
  controls.lock();
  startAudio();
  //hide the menue
  hidemenue();
}

const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExpirience);

//hide menue
function hidemenue() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
}

//show menue
function showMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
}

//function when a key pressed ,excute this func
function onkeydown(event) {
  let keyCode = event.which;

  //right arrow key
  if (keyCode === 39 || keyCode === 68) {
    controls.moveRight(0.08);
    //left key
  } else if (keyCode === 37 || keyCode === 65) {
    controls.moveRight(-0.08);
    ///up
  } else if (keyCode === 38 || keyCode === 87) {
    controls.moveForward(0.08);
    //down
  } else if (keyCode === 40 || keyCode === 83) {
    controls.moveForward(-0.08);
  }
}


let sound;
let bufferLoaded = false;

// Setup Audio inside a function
const setupAudio = (camera) => {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("/src/sound/music.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    bufferLoaded = true;
  });
};

// Function to start audio on user interaction
const startAudio = () => {
  if (sound && bufferLoaded) {
    if (THREE.AudioContext) {
      THREE.AudioContext.getContext().resume().then(() => {
        sound.play();
        console.log("Audio started");
      });
    } else {
      sound.play();
    }
  }
};

// Initialize audio but don’t play it yet
setupAudio(camera);

let renderLoop = function () {
  if (checkCollision()) {
    console.log("Collision Detected!");
  }
  cube.rotation.x = cube.rotation.x + 0.01;
  cube.rotation.y = cube.rotation.y + 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(renderLoop);
};
renderLoop();

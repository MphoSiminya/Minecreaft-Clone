
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from './world';
import { setupUI } from './ui';

// =========================
// Renderer setup
// =========================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Sky colour
renderer.setClearColor(0x9bc9ed);

// Better colour rendering
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

// =========================
// Camera setup
// =========================

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-32, 38, 45);

const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(32, 8, 32);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.02;

controls.update();

// =========================
// Scene setup
// =========================

const scene = new THREE.Scene();

// Light blue sky atmosphere
scene.background = new THREE.Color(0x9bc9ed);

// Soft atmospheric fog
scene.fog = new THREE.Fog(0x9bc9ed, 100, 240);

const world = new World();

world.generate();
scene.add(world);

// =========================
// Lighting setup
// =========================

function setupLighting() {

  // Soft overall light
  const hemisphereLight = new THREE.HemisphereLight(
    0xb8d8f0, // Sky
    0x59634d, // Ground
    0.7
  );

  scene.add(hemisphereLight);


  // Main sunlight
  const sun = new THREE.DirectionalLight(
    0xfff2d6,
    1.2
  );

  sun.position.set(80, 100, 50);

  sun.target.position.set(32, 0, 32);

  scene.add(sun);
  scene.add(sun.target);


  // Shadows
  sun.castShadow = true;

  sun.shadow.mapSize.set(2048, 2048);

  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;

  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 220;

  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
}

setupLighting();

// =========================
// Window resizing
// =========================

window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

// =========================
// UI and performance stats
// =========================

const stats = new Stats();
document.body.appendChild(stats.dom);

setupUI(world);

// =========================
// Render loop
// =========================

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
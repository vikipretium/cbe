import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f19);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 3, 5);

// 2. Renderer
const canvas = document.querySelector('#sim-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 3. Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 4. Lighting & Grid Helper
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
scene.add(gridHelper);

// 5. Simulation Object (Placeholder)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
scene.add(cube);

// 6. Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 7. Simulation Loop
const clock = new THREE.Clock();

function updateSimulation(dt) {
  // Add physics or state updates here
  cube.rotation.y += 1.0 * dt;
}

function animate() {
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  updateSimulation(dt);

  controls.update();
  renderer.render(scene, camera);
}

animate();

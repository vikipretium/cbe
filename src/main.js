import * as THREE from 'three';
import { SECTOR_1_DATA } from './data/sectorCoimbatore.js';

const container = document.querySelector('#canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0b1320);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b1320, 0.0017);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2400);
camera.position.set(0, 360, 520);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0x91c5d8, 0x18202b, 1.8));
const sun = new THREE.DirectionalLight(0xffe1bd, 2.2);
sun.position.set(-260, 480, 220);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1500, 1100),
  new THREE.MeshStandardMaterial({ color: 0x18202a, roughness: 0.92 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x252c35, roughness: 0.8 });
const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xb7c2c8, transparent: true, opacity: 0.42 });

for (const road of SECTOR_1_DATA.roads) {
  const dx = road.x2 - road.x1;
  const dz = road.z2 - road.z1;
  const length = Math.hypot(dx, dz);
  const roadMesh = new THREE.Mesh(new THREE.BoxGeometry(length, 1, road.width), roadMaterial);
  roadMesh.position.set((road.x1 + road.x2) / 2, 1, (road.z1 + road.z2) / 2);
  roadMesh.rotation.y = -Math.atan2(dz, dx);
  roadMesh.receiveShadow = true;
  scene.add(roadMesh);

  if (Math.abs(dx) > Math.abs(dz)) {
    for (let x = road.x1 + 22; x < road.x2; x += 55) {
      const lane = new THREE.Mesh(new THREE.BoxGeometry(18, 1.2, 1.5), laneMaterial);
      lane.position.set(x, 2.2, (road.z1 + road.z2) / 2);
      scene.add(lane);
    }
  }
}

SECTOR_1_DATA.landmarks.forEach((landmark, index) => {
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 12, 24),
    new THREE.MeshStandardMaterial({ color: landmark.color, emissive: landmark.color, emissiveIntensity: 0.45 })
  );
  marker.position.set(landmark.x, 9, landmark.z);
  marker.castShadow = true;
  scene.add(marker);

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(34 + index * 4, 38 + (index % 3) * 24, 34),
    new THREE.MeshStandardMaterial({ color: index % 2 ? 0x384858 : 0x303d49, roughness: 0.7 })
  );
  building.position.set(landmark.x + 70, building.geometry.parameters.height / 2 + 2, landmark.z - 45);
  building.castShadow = true;
  scene.add(building);
});

const car = new THREE.Group();
const carBody = new THREE.Mesh(
  new THREE.BoxGeometry(28, 12, 58),
  new THREE.MeshStandardMaterial({ color: 0xf0b84c, metalness: 0.35, roughness: 0.28 })
);
carBody.position.y = 10;
carBody.castShadow = true;
car.add(carBody);

const carRoof = new THREE.Mesh(
  new THREE.BoxGeometry(24, 10, 30),
  new THREE.MeshStandardMaterial({ color: 0x1d2a35, metalness: 0.2, roughness: 0.32 })
);
carRoof.position.set(0, 21, -4);
carRoof.castShadow = true;
car.add(carRoof);

const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: 0.8 });
for (const x of [-15, 15]) {
  for (const z of [-18, 18]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 5, 16), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 7, z);
    wheel.castShadow = true;
    car.add(wheel);
  }
}

const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xf9edbd });
for (const x of [-9, 9]) {
  const headlight = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 1), headlightMaterial);
  headlight.position.set(x, 11, -30);
  car.add(headlight);
}

const character = new THREE.Group();
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xc89267, roughness: 0.75 });
const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x36a6a8, roughness: 0.75 });
const trouserMaterial = new THREE.MeshStandardMaterial({ color: 0x172333, roughness: 0.8 });

const torso = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 7), shirtMaterial);
torso.position.y = 24;
torso.castShadow = true;
character.add(torso);

const head = new THREE.Mesh(new THREE.SphereGeometry(5.5, 16, 12), skinMaterial);
head.position.y = 38;
head.castShadow = true;
character.add(head);

const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(4, 15, 4), trouserMaterial);
leftLeg.position.set(-3.2, 8, 0);
leftLeg.castShadow = true;
character.add(leftLeg);
const rightLeg = leftLeg.clone();
rightLeg.position.x = 3.2;
character.add(rightLeg);

for (const side of [-1, 1]) {
  const arm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 14, 4), skinMaterial);
  arm.position.set(side * 7, 23, 0);
  arm.rotation.z = side * -0.12;
  arm.castShadow = true;
  character.add(arm);
}

car.position.set(0, 0, 60);
character.position.set(0, 0, 60);
character.visible = false;
scene.add(car);
scene.add(character);

let playerMode = 'car';
let player = car;

const minimap = document.querySelector('#minimap');
const mapContext = minimap.getContext('2d');

function drawMap(context, width, height, scale, playerPosition) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#091522';
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(width / 2 - playerPosition.x * scale, height / 2 - playerPosition.z * scale);

  context.strokeStyle = '#313f4d';
  context.lineWidth = scale * 24;
  context.lineCap = 'round';
  for (const road of SECTOR_1_DATA.roads) {
    context.beginPath();
    context.moveTo(road.x1 * scale, road.z1 * scale);
    context.lineTo(road.x2 * scale, road.z2 * scale);
    context.stroke();
  }

  context.strokeStyle = 'rgba(88,228,239,.5)';
  context.lineWidth = Math.max(1, scale * 2);
  for (const road of SECTOR_1_DATA.roads) {
    context.beginPath();
    context.moveTo(road.x1 * scale, road.z1 * scale);
    context.lineTo(road.x2 * scale, road.z2 * scale);
    context.stroke();
  }

  for (const landmark of SECTOR_1_DATA.landmarks) {
    context.beginPath();
    context.fillStyle = landmark.color;
    context.arc(landmark.x * scale, landmark.z * scale, Math.max(3, scale * 8), 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(-player.rotation.y);
  context.fillStyle = '#f6dd62';
  context.beginPath();
  context.moveTo(0, -10);
  context.lineTo(7, 8);
  context.lineTo(0, 5);
  context.lineTo(-7, 8);
  context.closePath();
  context.fill();
  context.restore();
}

function drawMinimap() {
  drawMap(mapContext, minimap.width, minimap.height, 0.16, player.position);
}

const fullmapCanvas = document.querySelector('#fullmap-canvas');
const fullmapContext = fullmapCanvas.getContext('2d');

function drawFullmap() {
  const width = fullmapCanvas.width;
  const height = fullmapCanvas.height;
  const scale = 0.78;

  fullmapContext.fillStyle = '#091522';
  fullmapContext.fillRect(0, 0, width, height);

  fullmapContext.save();
  fullmapContext.translate(width / 2 - player.position.x * scale, height / 2 - player.position.z * scale);

  for (const road of SECTOR_1_DATA.roads) {
    fullmapContext.strokeStyle = '#303e4c';
    fullmapContext.lineWidth = road.width * scale;
    fullmapContext.lineCap = 'round';
    fullmapContext.beginPath();
    fullmapContext.moveTo(road.x1 * scale, road.z1 * scale);
    fullmapContext.lineTo(road.x2 * scale, road.z2 * scale);
    fullmapContext.stroke();

    fullmapContext.strokeStyle = 'rgba(88,228,239,.46)';
    fullmapContext.lineWidth = 1.5;
    fullmapContext.setLineDash([10, 9]);
    fullmapContext.beginPath();
    fullmapContext.moveTo(road.x1 * scale, road.z1 * scale);
    fullmapContext.lineTo(road.x2 * scale, road.z2 * scale);
    fullmapContext.stroke();
    fullmapContext.setLineDash([]);
  }

  SECTOR_1_DATA.landmarks.forEach((landmark) => {
    const x = landmark.x * scale;
    const z = landmark.z * scale;
    fullmapContext.beginPath();
    fullmapContext.fillStyle = `${landmark.color}22`;
    fullmapContext.arc(x, z, landmark.radius * scale, 0, Math.PI * 2);
    fullmapContext.fill();

    fullmapContext.beginPath();
    fullmapContext.fillStyle = landmark.color;
    fullmapContext.arc(x, z, 7, 0, Math.PI * 2);
    fullmapContext.fill();

    fullmapContext.fillStyle = '#edf6f8';
    fullmapContext.font = '10px monospace';
    fullmapContext.fillText(landmark.name, x + 11, z - 9);
  });
  fullmapContext.restore();

  fullmapContext.save();
  fullmapContext.translate(width / 2, height / 2);
  fullmapContext.rotate(-player.rotation.y);
  fullmapContext.beginPath();
  fullmapContext.fillStyle = '#f6dd62';
  fullmapContext.moveTo(0, -13);
  fullmapContext.lineTo(9, 10);
  fullmapContext.lineTo(0, 6);
  fullmapContext.lineTo(-9, 10);
  fullmapContext.closePath();
  fullmapContext.fill();
  fullmapContext.restore();

  fullmapContext.fillStyle = 'rgba(9,21,34,.82)';
  fullmapContext.fillRect(18, 18, 190, 34);
  fullmapContext.fillStyle = '#58e4ef';
  fullmapContext.font = '600 12px monospace';
  fullmapContext.fillText('SECTOR 1 • CENTRAL COIMBATORE', 30, 39);
}

const keys = new Set();
window.addEventListener('keydown', (event) => {
  keys.add(event.code);
  if (event.code === 'KeyM') toggleMap();
  if (event.code === 'Escape') closeMap();
  if (event.code === 'KeyN') scene.fog.color.set(document.body.dataset.neon === 'true' ? 0x0b1320 : 0x061020);
  if (event.code === 'KeyF') togglePlayerMode();
  if (event.code === 'KeyP' && !document.fullscreenElement) document.documentElement.requestFullscreen?.();
});
window.addEventListener('keyup', (event) => keys.delete(event.code));

function toggleMap() {
  const overlay = document.querySelector('#map-overlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) drawFullmap();
}

function closeMap() {
  document.querySelector('#map-overlay').classList.remove('open');
}

document.querySelector('#minimap-click').addEventListener('click', toggleMap);
document.querySelector('#btn-map').addEventListener('click', toggleMap);
document.querySelector('#btn-close-map').addEventListener('click', closeMap);
document.querySelector('#btn-mode').addEventListener('click', togglePlayerMode);
document.querySelector('#btn-neon').addEventListener('click', () => {
  document.body.dataset.neon = document.body.dataset.neon === 'true' ? 'false' : 'true';
  scene.fog.color.set(document.body.dataset.neon === 'true' ? 0x08111f : 0x0b1320);
});
document.querySelector('#btn-fs').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

let lastTime = performance.now();
let speed = 0;

function togglePlayerMode() {
  const activePosition = player.position.clone();
  const activeRotation = player.rotation.y;
  playerMode = playerMode === 'car' ? 'character' : 'car';
  car.visible = playerMode === 'car';
  character.visible = playerMode === 'character';
  player = playerMode === 'car' ? car : character;
  player.position.copy(activePosition);
  player.rotation.y = activeRotation;
  speed = 0;
  document.querySelector('#mode-label').textContent = playerMode === 'car'
    ? 'KM/H • SPORTS COUPE'
    : 'ON FOOT • CENTRAL COIMBATORE';
  document.querySelector('#btn-mode').textContent = playerMode === 'car'
    ? '🚶 Exit Car [F]'
    : '🚗 Enter Car [F]';
}

function animate(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  const forward = keys.has('KeyW') || keys.has('ArrowUp');
  const backward = keys.has('KeyS') || keys.has('ArrowDown');
  const left = keys.has('KeyA') || keys.has('ArrowLeft');
  const right = keys.has('KeyD') || keys.has('ArrowRight');

  if (left) player.rotation.y += 1.25 * delta;
  if (right) player.rotation.y -= 1.25 * delta;

  const targetSpeed = forward
    ? (playerMode === 'car' ? 150 : 38)
    : backward
      ? (playerMode === 'car' ? -75 : -22)
      : 0;
  speed += (targetSpeed - speed) * Math.min(delta * 3, 1);
  player.position.x += Math.sin(player.rotation.y) * speed * delta;
  player.position.z += Math.cos(player.rotation.y) * speed * delta;

  camera.position.x += (player.position.x - camera.position.x) * 0.025;
  camera.position.z += (player.position.z + 420 - camera.position.z) * 0.025;
  camera.lookAt(player.position.x, 10, player.position.z);

  document.querySelector('#speed-val').textContent = Math.round(Math.abs(speed));

  let nearestLandmark = null;
  let nearestDistance = Infinity;
  for (const landmark of SECTOR_1_DATA.landmarks) {
    const distance = Math.hypot(player.position.x - landmark.x, player.position.z - landmark.z);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLandmark = landmark;
    }
  }
  document.querySelector('#zone-name').textContent = nearestDistance < 180
    ? `📍 ${nearestLandmark.name}`
    : '📍 Central Coimbatore';

  drawMinimap();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const toast = document.querySelector('#toast');
toast.classList.add('visible');
setTimeout(() => toast.classList.remove('visible'), 2200);
requestAnimationFrame(animate);

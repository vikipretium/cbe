import * as THREE from 'three';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const player = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.BoxGeometry(28, 12, 58),
  new THREE.MeshStandardMaterial({ color: 0xf0b84c, metalness: 0.25, roughness: 0.35 })
);
body.position.y = 10;
body.castShadow = true;
player.add(body);
const roof = new THREE.Mesh(
  new THREE.BoxGeometry(24, 10, 30),
  new THREE.MeshStandardMaterial({ color: 0x1d2a35, metalness: 0.15 })
);
roof.position.set(0, 21, -4);
player.add(roof);
player.position.set(0, 0, 60);
scene.add(player);

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

const realMapLocations = {
  gandhipuram: [11.0178, 76.9664],
  brookefields: [11.0093, 76.9717],
  rspuram: [11.0101, 76.9504],
  vocpark: [11.0030, 76.9770],
  junction: [10.9972, 76.9585],
  avinashi: [11.0244, 76.9921],
  ukkadam: [10.9789, 76.9558]
};

let realMap;
let realPlayerMarker;

function initializeRealMap() {
  if (realMap) return;

  realMap = L.map('fullmap-canvas', {
    center: [10.9980, 76.9610],
    zoom: 11,
    zoomControl: true
  });

  const cartoTileUrl = import.meta.env.VITE_CARTO_TILE_URL;
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;

  if (cartoTileUrl) {
    if (!cartoTileUrl.includes('{z}') || !cartoTileUrl.includes('{x}') || !cartoTileUrl.includes('{y}')) {
      const warning = L.control({ position: 'topright' });
      warning.onAdd = () => {
        const element = L.DomUtil.create('div', 'leaflet-bar carto-config-warning');
        element.innerHTML = 'CARTO URL needs {z}/{x}/{y} tile placeholders';
        return element;
      };
      warning.addTo(realMap);
    } else {
      let tileUrl = cartoTileUrl;
    if (tileUrl.includes('{api_key}')) {
      tileUrl = tileUrl.replace('{api_key}', encodeURIComponent(cartoApiKey || ''));
    } else if (cartoApiKey) {
      const separator = tileUrl.includes('?') ? '&' : '?';
      tileUrl = `${tileUrl}${separator}api_key=${encodeURIComponent(cartoApiKey)}`;
    }

      L.tileLayer(tileUrl, {
        maxZoom: 20,
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors'
      }).addTo(realMap);
    }
  } else {
    const warning = L.control({ position: 'topright' });
    warning.onAdd = () => {
      const element = L.DomUtil.create('div', 'leaflet-bar carto-config-warning');
      element.innerHTML = 'CARTO tile URL not configured';
      return element;
    };
    warning.addTo(realMap);
  }

  const playerIcon = L.divIcon({
    className: 'gps-marker',
    html: '<div></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  realPlayerMarker = L.marker(realMapLocations.gandhipuram, {
    icon: playerIcon,
    zIndexOffset: 1000
  }).addTo(realMap).bindTooltip('Live position', { permanent: false });

  SECTOR_1_DATA.landmarks.forEach((landmark) => {
    const position = realMapLocations[landmark.id];
    if (!position) return;
    L.circleMarker(position, {
      radius: 6,
      color: landmark.color,
      fillColor: landmark.color,
      fillOpacity: 0.9,
      weight: 2
    }).addTo(realMap).bindPopup(`<b>${landmark.name}</b>`);
  });

  L.rectangle([[10.35, 76.40], [11.25, 77.25]], {
    color: '#58e4ef',
    weight: 2,
    fillOpacity: 0.05,
    dashArray: '8 6'
  }).addTo(realMap);
}

function refreshRealMap() {
  if (!realMap) return;
  realMap.invalidateSize();
}

const keys = new Set();
window.addEventListener('keydown', (event) => {
  keys.add(event.code);
  if (event.code === 'KeyM') toggleMap();
  if (event.code === 'Escape') closeMap();
  if (event.code === 'KeyN') scene.fog.color.set(document.body.dataset.neon === 'true' ? 0x0b1320 : 0x061020);
  if (event.code === 'KeyF') document.querySelector('#mode-label').textContent = 'WALKING • CENTRAL COIMBATORE';
  if (event.code === 'KeyP' && !document.fullscreenElement) document.documentElement.requestFullscreen?.();
});
window.addEventListener('keyup', (event) => keys.delete(event.code));

function toggleMap() {
  const overlay = document.querySelector('#map-overlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) {
    initializeRealMap();
    requestAnimationFrame(refreshRealMap);
  }
}

function closeMap() {
  document.querySelector('#map-overlay').classList.remove('open');
}

document.querySelector('#minimap-click').addEventListener('click', toggleMap);
document.querySelector('#btn-map').addEventListener('click', toggleMap);
document.querySelector('#btn-close-map').addEventListener('click', closeMap);
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
function animate(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  const forward = keys.has('KeyW') || keys.has('ArrowUp');
  const backward = keys.has('KeyS') || keys.has('ArrowDown');
  const left = keys.has('KeyA') || keys.has('ArrowLeft');
  const right = keys.has('KeyD') || keys.has('ArrowRight');

  if (left) player.rotation.y += 1.25 * delta;
  if (right) player.rotation.y -= 1.25 * delta;

  const targetSpeed = forward ? 150 : backward ? -75 : 0;
  speed += (targetSpeed - speed) * Math.min(delta * 3, 1);
  player.position.x += Math.sin(player.rotation.y) * speed * delta;
  player.position.z += Math.cos(player.rotation.y) * speed * delta;

  camera.position.x += (player.position.x - camera.position.x) * 0.025;
  camera.position.z += (player.position.z + 420 - camera.position.z) * 0.025;
  camera.lookAt(player.position.x, 10, player.position.z);

  document.querySelector('#speed-val').textContent = Math.round(Math.abs(speed));
  drawMinimap();
  if (realPlayerMarker && realMap) {
    const latitude = 10.9980 + player.position.z * -0.000018;
    const longitude = 76.9610 + player.position.x * 0.000018;
    realPlayerMarker.setLatLng([latitude, longitude]);
  }
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

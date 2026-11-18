import * as THREE from 'three';

// Center of Coimbatore (Gandhipuram / Town Hall area)
const CENTER_LAT = 11.0168;
const CENTER_LON = 76.9558;
const METERS_PER_DEG_LAT = 111320;
const METERS_PER_DEG_LON = 111320 * Math.cos((CENTER_LAT * Math.PI) / 180);

export class CoimbatoreMap {
  constructor(scene) {
    this.scene = scene;
    this.mapGroup = new THREE.Group();
    this.scene.add(this.mapGroup);
    this.roads = []; // Stored for future traffic/agent simulation
  }

  // Convert GPS (lat, lon) to Three.js world coordinates (x, z) in meters
  latLonToXZ(lat, lon) {
    const x = (lon - CENTER_LON) * METERS_PER_DEG_LON;
    const z = -(lat - CENTER_LAT) * METERS_PER_DEG_LAT;
    return new THREE.Vector2(x, z);
  }

  async loadArea(radiusMeters = 800) {
    const query = `
      [out:json][timeout:25];
      (
        way["building"](around:${radiusMeters},${CENTER_LAT},${CENTER_LON});
        way["highway"~"motorway|trunk|primary|secondary|tertiary|residential"](around:${radiusMeters},${CENTER_LAT},${CENTER_LON});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de', {
      method: 'POST',
      body: query,
    });
    const data = await response.json();
    this.#buildFromOSM(data.elements);
  }

  #buildFromOSM(elements) {
    const nodes = new Map();
    const ways = [];

    for (const el of elements) {
      if (el.type === 'node') {
        nodes.set(el.id, this.latLonToXZ(el.lat, el.lon));
      } else if (el.type === 'way') {
        ways.push(el);
      }
    }

    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.2,
    });

    const roadMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8 });

    for (const way of ways) {
      const points = way.nodes
        .map((id) => nodes.get(id))
        .filter(Boolean);

      if (points.length < 2) continue;

      if (way.tags?.building) {
        this.#createBuilding(points, way.tags, buildingMaterial);
      } else if (way.tags?.highway) {
        this.#createRoad(points, roadMaterial);
      }
    }
  }

  #createBuilding(points, tags, material) {
    const shape = new THREE.Shape();
    shape.moveTo(points[0].x, -points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, -points[i].y);
    }

    const levels = parseInt(tags['building:levels'], 10) || Math.floor(Math.random() * 4) + 2;
    const height = levels * 3.5;

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
    });

    // Rotate from XY plane to XZ ground plane
    geometry.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(geometry, material);
    this.mapGroup.add(mesh);
  }

  #createRoad(points, material) {
    const vectors = points.map((p) => new THREE.Vector3(p.x, 0.2, p.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
    const line = new THREE.Line(geometry, material);
    this.mapGroup.add(line);
    this.roads.push(vectors);
  }
}

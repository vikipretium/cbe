import './style.css';
import * as THREE from 'three';
import { SceneManager } from './world/SceneManager.js';
import { SimEntity } from './entities/SimEntity.js';
import { SimulationEngine } from './systems/SimulationEngine.js';
import { ControlsUI } from './ui/ControlsUI.js';

const canvas = document.querySelector('#sim-canvas');
const world = new SceneManager(canvas);
const engine = new SimulationEngine();
const ui = new ControlsUI(engine);

// Spawn initial entity
const starterCube = new SimEntity({
  position: new THREE.Vector3(0, 0.5, 0),
  color: 0x38bdf8,
});
engine.addEntity(starterCube, world.scene);

// Main Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);
  engine.step(dt);
  world.render();
}

animate();

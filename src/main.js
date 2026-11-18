import './style.css';
import { SceneManager } from './world/SceneManager.js';
import { CoimbatoreMap } from './world/CoimbatoreMap.js';
import { SimulationEngine } from './systems/SimulationEngine.js';
import { ControlsUI } from './ui/ControlsUI.js';
import * as THREE from 'three';

const canvas = document.querySelector('#sim-canvas');
const world = new SceneManager(canvas);
const engine = new SimulationEngine();
const ui = new ControlsUI(engine);

const cbeMap = new CoimbatoreMap(world.scene);
cbeMap.loadArea(800).then(() => {
  console.log(`Loaded ${cbeMap.roads.length} Coimbatore road segments.`);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);
  engine.step(dt);
  world.render();
}

animate();

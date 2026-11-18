export class SimulationEngine {
  constructor() {
    this.entities = [];
    this.params = {
      paused: false,
      timeScale: 1.0,
      rotationSpeed: 1.0,
    };
  }

  addEntity(entity, scene) {
    this.entities.push(entity);
    scene.add(entity.mesh);
  }

  step(dt) {
    if (this.params.paused) return;

    const scaledDt = dt * this.params.timeScale;

    for (const entity of this.entities) {
      // Replace or expand this with your simulation rules
      entity.mesh.rotation.y += this.params.rotationSpeed * scaledDt;
      entity.syncMesh();
    }
  }
}

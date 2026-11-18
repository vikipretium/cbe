import GUI from 'lil-gui';

export class ControlsUI {
  constructor(engine) {
    this.gui = new GUI({ title: 'Simulation Controls' });
    this.gui.add(engine.params, 'paused').name('Pause');
    this.gui.add(engine.params, 'timeScale', 0, 3, 0.1).name('Time Scale');
    this.gui.add(engine.params, 'rotationSpeed', 0, 5, 0.1).name('Speed');
  }
}

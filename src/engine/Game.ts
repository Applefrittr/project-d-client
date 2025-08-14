import FPSController from "./classes/FPSController";
import Minion from "./classes/Minion";
import spawnWave from "./functions/spawnWave";
import initializeMinionPool from "./functions/intializeMinionPool";
import settings from "./settings.json";
import Fortress from "./classes/Fortress";

export default class Game {
  ctx: CanvasRenderingContext2D | null = null;
  canvasWidth: number;
  canvasHeight: number;
  fortressRed: Fortress | null = null;
  fortressBlue: Fortress | null = null;
  frame: number = 0;
  fpsController = new FPSController();
  prevWaveTime: number = 0;
  minionPool: Minion[] = [];
  renderRate = 1000 / settings["fps"];

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCanvasContext(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
  }

  // intialize creates intial gamestate and creates object pools
  initialize() {
    this.fortressRed = new Fortress("red");
    this.fortressBlue = new Fortress("blue");
    this.minionPool = initializeMinionPool(this.minionPool, 100);

    this.prevWaveTime = performance.now();
    spawnWave(this.minionPool, {
      red: this.fortressRed,
      blue: this.fortressBlue,
    });
  }

  // render function loops through all game assets (class instances) and calls their respective update()
  render() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.minionPool.forEach((minion) => {
        if (minion.team === null) return;
        minion.detectTarget(this.minionPool);
        minion.update(this.ctx);
      });
    }
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.minionPool = [];
  }

  // main game loop -> loop is executed via requestAnimationFrame, checks game state, keeps track of game time, checks for win/lose conditions and calls render function
  loop = (msNow: number) => {
    this.frame = window.requestAnimationFrame(this.loop);
    //console.log(msNow, this.prevWaveTime);

    // fpsController ensures render and game state checks are locked to specific FPS
    if (!this.fpsController.renderFrame(msNow)) return;

    // spawn new wave if difference between the current time and the prev wave time is more than x seconds
    if (
      msNow - this.prevWaveTime >= settings["time-between-waves"] &&
      this.minionPool &&
      this.fortressRed &&
      this.fortressBlue
    ) {
      spawnWave(this.minionPool, {
        red: this.fortressRed,
        blue: this.fortressBlue,
      });
      this.prevWaveTime = msNow;
    }

    this.render();
  };
}

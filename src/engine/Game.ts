import FPSController from "./classes/FPSController";
import Minion from "./classes/Minion";
import spawnWave from "./functions/spawnWave";
import initializeMinionPool from "./functions/intializeMinionPool";
import settings from "./settings.json";
import Fortress from "./classes/Fortress";
import GameObject from "./classes/GameObject";

export default class Game {
  ctx: CanvasRenderingContext2D | null = null;
  canvasWidth: number;
  canvasHeight: number;
  frame: number = 0;
  fpsController = new FPSController();
  prevWaveTime: number = 0;
  minionPool: Minion[] = [];
  renderRate = 1000 / settings["fps"];
  blueTeam: Set<GameObject> = new Set();
  redTeam: Set<GameObject> = new Set();
  isPaused: boolean = false;

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCanvasContext(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
  }

  // intialize creates intial gamestate and creates object pools
  initialize() {
    this.blueTeam.add(new Fortress("blue"));
    this.redTeam.add(new Fortress("red"));
    this.minionPool = initializeMinionPool(this.minionPool, 100);

    this.prevWaveTime = performance.now();
    spawnWave(this.minionPool, this.redTeam, this.blueTeam);
  }

  // render function loops through all game assets (class instances) and calls their respective update()
  render() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.minionPool.forEach((minion) => {
        if (minion.team === null) return;
        if (minion.team === "blue") {
          if (minion.inCombat) {
            setTimeout(() => {
              minion.destroy(this.blueTeam);
              return;
            }, 10000);
          }
          minion.detectTeamCollision(this.blueTeam);
          minion.detectTarget(this.redTeam);
        } else {
          if (minion.inCombat) {
            setTimeout(() => {
              minion.destroy(this.redTeam);
              return;
            }, 10000);
          }
          minion.detectTeamCollision(this.redTeam);
          minion.detectTarget(this.blueTeam);
        }
        minion.update(this.ctx);
      });
    }
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.minionPool = [];
    this.redTeam = new Set();
    this.blueTeam = new Set();
  }

  pause() {
    if (!this.isPaused) {
      cancelAnimationFrame(this.frame);
      this.isPaused = true;
    } else {
      this.frame = window.requestAnimationFrame(this.loop);
      this.isPaused = false;
    }
    console.log("minons: ", this.minionPool);
    console.log("blue team: ", this.blueTeam);
    console.log("red team: ", this.redTeam);
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
      this.minionPool
    ) {
      spawnWave(this.minionPool, this.redTeam, this.blueTeam);
      this.prevWaveTime = msNow;
    }

    this.render();
  };
}

import BaseEngine from "./BaseEngine";
import GameObject from "./classes/GameObject";
import Minion from "./classes/Minion";
import Vector from "./classes/Vector";
import vectorLerp from "./utils/vectorLerp";

type GameObjectData = {
  id: number;
  position: Vector;
  velocity: Vector;
  hitPoints: number;
  team: string;
  radius: number;
};

type GameObjectMap = {
  [id: string]: GameObjectData;
};

export type GameState = {
  id: number;
  objMap: GameObjectMap;
  gameTime: number;
  frame: number;
};

// Renders GameObjects recieved from the server.  Store recieved game states in a buffer queue to be rendering via linear interpolation behind the server's current state.
// Will ideally create a smooth experience and hide any jittering/teleportation in rendering due to network instability

export default class MultiplayerEngine extends BaseEngine {
  gameObjects: GameObjectMap = {};
  startTime: number = 0;
  pausedTime: number = 0;
  currState: GameState | undefined = undefined;
  newState: GameState | undefined = undefined;
  bufferQueue: GameState[] = [];
  bufferDelay: number = 200;

  constructor(width: number, height: number) {
    super(width, height);
  }

  appendBufferQueue(state: GameState) {
    this.bufferQueue.push(state);
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.gameObjects = {};
    this.startTime = 0;
    this.pausedTime = 0;
  }

  renderObject(obj: GameObjectData) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.fillStyle = obj.team;
      this.ctx.arc(obj.position.x, obj.position.y, obj.radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.fillStyle = "black";
      this.ctx.font = "16px serif";
      this.ctx.fillText(
        obj.hitPoints.toString(),
        obj.position.x,
        obj.position.y
      );
      this.ctx.fillText(
        JSON.stringify(obj.velocity),
        obj.position.x,
        obj.position.y + 16
      );
      this.ctx.fillText(obj.id.toString(), obj.position.x, obj.position.y + 32);
    }
  }

  // Main Game loop, checks FPSController before calling updateAndRender server recieved GameObjects
  loop = (msNow: number) => {
    // set intial start time of game loop
    if (!this.startTime) this.startTime = msNow;

    // Current in game time -> used for gamestate checks and rendering
    // Ensures game continues at a consistance pace, even when game is paused/resumed
    const currTime = msNow - this.startTime - this.pausedTime;

    this.frame = window.requestAnimationFrame(this.loop);

    // buffer delay to delay rendering behind the current server state -> ideal for state interpolation
    if (currTime < this.bufferDelay) return;

    // fpsController ensures render and game state checks are locked to specific FPS
    if (!this.fpsController.renderFrame(currTime)) return;

    const gameTime = performance.now() - (this.startTime + this.bufferDelay);

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      console.log(this.bufferQueue);
      // set current state and new state from buffer queue
      this.currState = this.bufferQueue.shift();
      console.log(
        "serverT: ",
        this.bufferQueue[0].gameTime,
        "clientT: ",
        gameTime
      );

      if (this.currState) {
        this.gameObjects = { ...this.currState.objMap };
      }
      for (const obj of Object.values(this.gameObjects)) {
        this.renderObject(obj);
      }
    }
  };
}

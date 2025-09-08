import BaseEngine from "./BaseEngine";
import GameObject from "./classes/GameObject";
import Vector from "./classes/Vector";

type GameObjectData = {
  id: number;
  position: Vector;
  velocity: Vector;
  hitPoints: number;
  team: string;
  radius: number;
};

export type GameState = {
  id: number;
  gameObjects: GameObject[];
  gameTime: number;
  frame: number;
};

// Renders GameObjects recieved from the server.  Store recieved game states in a buffer queue to be rendering via linear interpolation behind the server's current state.
// Will ideally create a smooth experience and hide any jittering/teleportation in rendering due to network instability

export default class MultiplayerEngine extends BaseEngine {
  gameObjects: GameObject[] = [];
  startTime: number = 0;
  pausedTime: number = 0;
  currState: GameState | undefined = undefined;
  bufferQueue: GameState[] = [];
  bufferDelay: number = 50;

  constructor(width: number, height: number) {
    super(width, height);
  }

  setGameObjects(data: GameObjectData[]) {
    this.gameObjects = [];
    for (const obj of data) {
      const gameObject = new GameObject();
      gameObject.id = obj.id;
      gameObject.position = new Vector(obj.position.x, obj.position.y);
      gameObject.velocity = new Vector(obj.velocity.x, obj.velocity.y);
      gameObject.hitPoints = obj.hitPoints;
      gameObject.team = obj.team;
      gameObject.radius = obj.radius;

      this.gameObjects.push(gameObject);
    }
    // console.log("gameObjects: ", this.gameObjects);
  }

  updateAndRenderObjects() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (const obj of this.gameObjects) {
        // obj.position.update(
        //   roundHundrethPercision(obj.position.x + obj.velocity.x),
        //   roundHundrethPercision(obj.position.y + obj.velocity.y)
        // );
        obj.draw(this.ctx);
      }
    }
  }

  appendBufferQueue(state: GameState) {
    this.bufferQueue.push(state);
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.gameObjects = [];
    this.startTime = 0;
    this.pausedTime = 0;
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
    console.log(this.bufferQueue);
    // set current state from buffer queue
    this.currState = this.bufferQueue.shift();

    if (this.currState) {
      this.setGameObjects(this.currState.gameObjects);
      this.updateAndRenderObjects();
    }
  };
}

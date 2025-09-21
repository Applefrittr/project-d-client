import BaseEngine from "./BaseEngine";
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
  serverTime: number;
  frame: number;
};

// Renders GameObjects recieved from the server.  Store recieved game states in a buffer queue to be rendering via linear interpolation behind the server's current state.
// Will ideally create a smooth experience and hide any jittering/teleportation in rendering due to network instability

export default class MultiplayerEngine extends BaseEngine {
  gameObjects: GameObjectMap = {};
  startTime: number = 0;
  pausedTime: number = 0;
  currState: GameState | undefined = undefined;
  nextState: GameState | undefined = undefined;
  bufferQueue: GameState[] = [];
  bufferDelay: number = 1000;

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

  // Interpolation w/ spawn and despawn detection
  interpolateObjects(stateA: GameState, stateB: GameState, time: number) {
    // Find our interpolation alpha based on where time falls between stateA and stateB times
    const alpha =
      (time - stateA.serverTime) / (stateB.serverTime - stateA.serverTime);

    // aggregate all IDs between stateA and stateB object maps and create a new Set
    const allObjIDs = new Set([
      ...Object.keys(stateA.objMap),
      ...Object.keys(stateB.objMap),
    ]);

    // iterate through the Set and spawn/despawn/interpolate as needed on our Game gameObjects map
    for (const id of allObjIDs) {
      const oldObj = stateA.objMap[id];
      const newObj = stateB.objMap[id];

      // spawn in Obj
      if (!oldObj && newObj) {
        this.gameObjects[id] = { ...newObj };
      }
      // despawn/destroy Obj
      else if (oldObj && !newObj) {
        delete this.gameObjects[id];
      }
      // interpolate
      else if (oldObj && newObj) {
        if (!this.gameObjects[id]) this.gameObjects[id] = { ...oldObj }; // spawn if somehow an obj is in both states but not yet in gameObjects map
        this.gameObjects[id].position = vectorLerp(
          oldObj.position,
          newObj.position,
          alpha
        );
      }
    }
  }

  // Render the gameObjects map
  renderObjects() {
    console.log("render!", this.ctx);
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (const obj of Object.values(this.gameObjects)) {
        this.ctx.beginPath();
        this.ctx.fillStyle = obj.team;
        this.ctx.arc(
          obj.position.x,
          obj.position.y,
          obj.radius,
          0,
          2 * Math.PI
        );
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  // Main Game loop, checks FPSController before main render functions
  loop = (msNow: number) => {
    // set intial start time of game loop
    if (!this.startTime) this.startTime = msNow;

    const currTime = msNow - this.startTime - this.pausedTime;

    this.frame = window.requestAnimationFrame(this.loop);

    // buffer delay to delay rendering behind the current server state -> ideal for state interpolation
    if (currTime < this.bufferDelay) return;

    // fpsController ensures render and game state checks are locked to specific FPS
    if (!this.fpsController.renderFrame(currTime)) return;

    const renderTime = performance.now() - (this.startTime + this.bufferDelay);
    console.log(renderTime, this.gameObjects);

    // sort buffer queue in ascending order by server time
    this.bufferQueue.sort(
      (stateA, stateB) => stateA.serverTime - stateB.serverTime
    );

    // find our bounding frames according to render time
    let frame = 0;

    while (renderTime > this.bufferQueue[frame + 1].serverTime) {
      frame++;
    }

    const oldState = this.bufferQueue[frame];
    const newState = this.bufferQueue[frame + 1];

    // possible extrapolation logic if oldState or newState doesn't exist here
    // this.extrapolateObjects(...)

    this.interpolateObjects(oldState, newState, renderTime);
    this.renderObjects();

    // remove all stale server states
    this.bufferQueue.splice(0, frame);
  };
}

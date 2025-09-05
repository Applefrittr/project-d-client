import BaseEngine from "./BaseEngine";
import GameObject from "./classes/GameObject";

import Vector from "./classes/Vector";
import roundHundrethPercision from "./utils/roundHundrethPercision";

type GameObjectData = {
  id: number;
  position: Vector;
  velocity: Vector;
  hitPoints: number;
  team: string;
  radius: number;
};

export default class MultiplayerEngine extends BaseEngine {
  gameObjects: GameObject[] = [];
  startTime: number = 0;
  pausedTime: number = 0;

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
        obj.position.update(
          roundHundrethPercision(obj.position.x + obj.velocity.x),
          roundHundrethPercision(obj.position.y + obj.velocity.y)
        );
        obj.draw(this.ctx);
      }
    }
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.gameObjects = [];
    this.startTime = 0;
    this.pausedTime = 0;
  }

  loop = (msNow: number) => {
    // set intial start time of game loop
    if (!this.startTime) this.startTime = msNow;

    // Current in game time -> used for gamestate checks and rendering
    // Ensures game continues at a consistance pace, even when game is paused/resumed
    const gameTime = msNow - this.startTime - this.pausedTime;

    this.frame = window.requestAnimationFrame(this.loop);

    // fpsController ensures render and game state checks are locked to specific FPS
    if (!this.fpsController.renderFrame(gameTime)) return;

    this.updateAndRenderObjects();
  };
}

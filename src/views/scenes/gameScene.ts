import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class GameScene extends Scene {
  private logo: PIXI.Sprite;

  constructor() {
    super();

    console.log("GAME_SCENE LOADED!!!!!");
  }

  // public renderByFrame(delta: number): void {
  // }
}

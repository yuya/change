import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { splashScene } from "../views/secenes/splashScene";

export class SceneController {
  public static instance: SceneController;

  public app!: PIXI.Application;
  public scene: PIXI.Container;
  // public static currentScene: string;

  constructor(app: PIXI.Application) {
    if (SceneController.instance) {
      throw new Error("SceneController can be instantiate only once");
    }

    this.app = app;
  }

  public static init(app: PIXI.Application) {
    const instance = new SceneController(app);
    SceneController.instance = instance;
  }

  public static assign(sceneName: string) {
    let scene: PIXI.Container;

    switch (sceneName.toUpperCase()) {
      case "SPLASH":
        return scene = new splashScene(this.instance.app);
      default:
        throw new Error("The scene name cannot be found");
    }
  }
}

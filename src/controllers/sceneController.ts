import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "../views/scenes/scene";
import { BootScene } from "../views/scenes/bootScene";
import { SplashScene } from "../views/scenes/splashScene";
import { TitleScene } from "../views/scenes/titleScene";
import { GameScene } from "../views/scenes/gameScene";

export class SceneController {
  public static instance: SceneController;
  public static loader: PIXI.Loader = PIXI.Loader.shared;

  public app!: PIXI.Application;
  public currentScene: Scene;

  constructor(app: PIXI.Application) {
    if (SceneController.instance) {
      throw new Error("SceneController can be instantiate only once");
    }

    this.app = app;
  }

  public static init(app: PIXI.Application) {
    const instance: SceneController = new SceneController(app);
    SceneController.instance = instance;

    document.body.appendChild(app.view);
    app.ticker.add((delta: number) => {
      instance.currentScene.renderByFrame(delta);
    });
  }

  public static assign(sceneName: string) {
    if (this.instance.currentScene) {
      this.instance.currentScene.destroy();
    }

    console.log(sceneName);
    // TODO: 404.html 用意して #! なくす
    history.pushState(null, sceneName, `#!${sceneName}`);

    switch (sceneName) {
      case "boot":
        return this.instance.currentScene = new BootScene();
      case "splash":
        return this.instance.currentScene = new SplashScene();
      case "title":
        return this.instance.currentScene = new TitleScene();
      case "game":
        return this.instance.currentScene = new GameScene();
      default:
        throw new Error("The scene name cannot be found"); 
        return
    }
  }
}

import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "../views/scenes/scene";
import { BootScene } from "../views/scenes/bootScene";
import { SplashScene } from "../views/scenes/splashScene";
// import { TitleScene } from "../views/secenes/titleScene";
// import { FugaScene } from "../views/scenes/fugaScene";

export class SceneController {
  public static instance: SceneController;

  public app!: PIXI.Application;
  // public currentScene: PIXI.Container;
  public currentScene: Scene;

  constructor(app: PIXI.Application) {
    if (SceneController.instance) {
      throw new Error("SceneController can be instantiate only once");
    }

    this.app = app;
  }

  public static init(app: PIXI.Application) {
    // app.ticker.add((delta: number) => {
    //   // console.log(delta);
    //   app.render();
    // });

    const instance: SceneController = new SceneController(app);
    SceneController.instance = instance;

    document.body.appendChild(app.view);
    app.ticker.add((delta: number) => {
      instance.currentScene.renderByFrame(delta);
    });
  }

  public static assign(sceneName: string) {
    sceneName = sceneName.toUpperCase();

    if (this.instance.currentScene) {
      this.instance.currentScene.destroy();
    }

    switch (sceneName) {
      case "BOOT":
        return this.instance.currentScene = new BootScene();
      case "SPLASH":
        return this.instance.currentScene = new SplashScene();
      default:
        throw new Error("The scene name cannot be found"); 
        return
    }
  
    // sceneName = sceneName.toUpperCase();
    // let scene: PIXI.Container;

    // switch (sceneName) {
    //   case "SPLASH":
    //     if (scene) {
    //       scene.destroy();
    //     }

    //     scene = new SplashScene(this.instance.app);
    //     this.instance.currentScene = scene;
    //     this.instance.currentScene.name = sceneName;
    //     return;
    //   case "TITLE":
    //     if (scene) {
    //       scene.destroy();
    //     }

    //     scene = new TitleScene(this.instance.app);
    //     this.instance.currentScene = scene;
    //     this.instance.currentScene.name = sceneName;
    //     return;
    //   default:
    //     throw new Error("The scene name cannot be found");
    // }
  }
}

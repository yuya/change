import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "../views/scenes/scene";
import { BootScene } from "../views/scenes/bootScene";
import { SplashScene } from "../views/scenes/splashScene";
import { TitleScene } from "../views/scenes/titleScene";
import { GameScene } from "../views/scenes/gameScene";
import { MockScene } from "../views/scenes/mockScene";

export class SceneController {
  public static instance : SceneController;
  public static loader   : PIXI.Loader = PIXI.Loader.shared;

  public renderer!    : PIXI.Renderer;
  public ticker!      : PIXI.Ticker;
  public stage!       : PIXI.Container;
  public currentScene : Scene;

  constructor(renderer: PIXI.Renderer) {
    this.renderer = renderer;
    this.stage    = new PIXI.Container();
    this.ticker   = PIXI.Ticker.shared;

    this.ticker.add((delta: number) => {
      console.log(delta);
      // SceneController.instance.currentScene.renderByFrame(delta);
      this.currentScene.onUpdate(delta);
    });


    document.body.appendChild(renderer.view);
  }

  public static init(renderer: PIXI.Renderer) {
    const instance: SceneController = new SceneController(renderer);
    // const ticker: PIXI.Ticker = PIXI.Ticker.shared;
    SceneController.instance = instance;

    console.log(instance);
    
    // this.ticker.add((delta: number) => {
    //   instance.currentScene.renderByFrame(delta);
    // });
  }

  public static assign(sceneName: string) {
    if (this.instance.currentScene) {
      this.instance.currentScene.destroy();
    }

    return;

    // TODO: 404.html 用意して #! なくす
    history.pushState(null, sceneName, `#!${sceneName}`);

    switch (sceneName) {
      case "":
      case "boot":
        return this.instance.currentScene = new BootScene("splash");
      case "splash":
        return this.instance.currentScene = new SplashScene("title");
      case "title":
        return this.instance.currentScene = new TitleScene("game");
      case "game":
        return this.instance.currentScene = new GameScene();
      case "mock":
        return this.instance.currentScene = new MockScene();
      default:
        throw new Error("The scene name cannot be found"); 
        return
    }
  }
}

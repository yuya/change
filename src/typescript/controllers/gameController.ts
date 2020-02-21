import * as PIXI from "pixi.js";
import { conf } from "conf";
import { UserData, AssetData } from "models";
import { Scene, BootScene, TitleScene, HomeScene, ResultScene } from "views";

export class GameController {
  public renderer      : PIXI.Renderer;
  public stage         : PIXI.Container;
  public loader        : PIXI.Loader;
  public ticker        : PIXI.Ticker;
  public events        : { [key : string] : any };
  public currentScene  : Scene;
  public nextSceneName : string;

  public userData  : UserData;
  public assetData : AssetData;

  private static _instance: GameController;
  public static get instance(): GameController {
    if (!this._instance) {
      this._instance = new GameController();
    }

    return this._instance;
  }

  private constructor() {
    this.renderer = PIXI.autoDetectRenderer({
      width           : conf.canvas_width,
      height          : conf.canvas_height,
      autoDensity     : true,
      resolution      : devicePixelRatio,
      backgroundColor : conf.canvas_bgcolor,
    });

    this.loader = PIXI.Loader.shared;
    this.ticker = PIXI.Ticker.shared;
    this.stage  = new PIXI.Container();
    this.events = {
      "initRenderer" : () => this.initRenderer(),
      "onUpdate"     : () => this.onUpdate()
    };

    this.userData  = UserData.instance;
    this.assetData = AssetData.instance;

    this.initTicker();
    this.initRenderer();
  }

  private initTicker(): void {
    this.ticker.autoStart = false;
    this.ticker.stop();

    this.ticker.add((delta: number) => {
      if (this.currentScene) {
        this.currentScene.onUpdate(delta);
      }
    });
  }

  public initRenderer(): void {
    conf.canvas_el.appendChild(this.renderer.view);

    this.stage.name = "stage";
    this.renderer.render(this.stage);
  }  

  public route(sceneName: string): void {
    if (sceneName) {
      history.pushState(null, sceneName, sceneName);
    }

    switch (sceneName) {
      case "":
      case "boot":
      default:
        this.userData.save("nextSceneName", "title");
        this.currentScene = new BootScene();
        break;
      case "title":
        this.userData.save("nextSceneName", "home");
        this.currentScene = new TitleScene();
        break;
      case "home":
        this.userData.save("nextSceneName", "ingame");
        this.currentScene = new HomeScene();
        break;
      case "result":
        this.userData.save("nextSceneName", "home");
        this.currentScene = new ResultScene();
        break;
    }
  }

  public onUpdate(): void {
    this.renderer.render(this.stage);
  }
}

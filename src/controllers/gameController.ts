import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";
import { CONST } from "config";
import { UserData } from "models/userData";
import { Scene } from "views/scenes/_scene";
import { BootScene } from "views/scenes/bootScene";
import { TitleScene } from "views/scenes/titleScene";

export class GameController {
  public renderer      : PIXI.Renderer;
  public stage         : PIXI.Container;
  public loader        : PIXI.Loader;
  public ticker        : PIXI.Ticker;
  public events        : { [key : string] : any };
  public currentScene  : Scene;
  public nextSceneName : string;

  public userData : UserData;

  private static _instance: GameController;
  public static get instance(): GameController {
    if (!this._instance) {
      this._instance = new GameController();
    }

    return this._instance;
  }

  private constructor() {
    this.renderer = PIXI.autoDetectRenderer({
      // width  : CONST.CANVAS_WIDTH,
      // height : CONST.CANVAS_HEIGHT,
      width  : CONST.CANVAS_WIDTH / devicePixelRatio,
      height : CONST.CANVAS_HEIGHT / devicePixelRatio,
      resolution: devicePixelRatio,
      backgroundColor : CONST.CANVAS_BGCOLOR
    });

    this.loader = PIXI.Loader.shared;
    this.ticker = PIXI.Ticker.shared;
    this.stage  = new PIXI.Container();
    this.events = {
      "initRenderer" : () => this.initRenderer(),
      "onUpdate"     : () => this.onUpdate()
    };
    this.userData = UserData.instance;

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
    CONST.CANVAS_TARGET_EL.appendChild(this.renderer.view);

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
        this.userData.save("nextSceneName", "title");
        this.currentScene = new BootScene();
        break;
      case "title":
        this.userData.save("nextSceneName", "home");
        this.currentScene = new TitleScene();
        break;
      // case "home":
      //   console.log(this, this.userData);
      //   this.userData.save("nextSceneName", "ingame");
      //   // this.nextSceneName = "ingame";
      //   // this.currentScene = new TitleScene();
      //   break;
      default:
        return;
    }

    // console.log(this.nextSceneName);
  }

  public get _nextSceneName(): string {
    return this.nextSceneName;
  }

  public onUpdate(): void {
    this.renderer.render(this.stage);
  }
}

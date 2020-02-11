import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";
import { CONST } from "config";

export class SceneController {
  public renderer : PIXI.Renderer;
  public stage    : PIXI.Container;
  public loader   : PIXI.Loader;
  public ticker   : PIXI.Ticker;    // TODO: 別クラスにする？
  public events   : { [key:string] : any };

  private static _instance: SceneController;
  public static get instance(): SceneController {
    if (!this._instance) {
      this._instance = new SceneController();
    }

    return this._instance;
  }

  private constructor() {
    this.renderer = PIXI.autoDetectRenderer({
      width  : CONST.CANVAS_WIDTH,
      height : CONST.CANVAS_HEIGHT,
      backgroundColor : CONST.CANVAS_BGCOLOR
    });

    this.loader = PIXI.Loader.shared;
    this.ticker = PIXI.Ticker.shared;
    this.stage  = new PIXI.Container();
    this.events = {
      "initLayout" : () => this.initLayout(),
      "onUpdate"   : () => this.onUpdate()
    };

    this.ticker.autoStart = false;
    this.ticker.stop();
    this.ticker.add(this.events.onUpdate);

    // window.addEventListener("load", this.events.initLayout, false);
    this.initLayout();
  }

  public initLayout() {
    CONST.CANVAS_TARGET_EL.appendChild(this.renderer.view);
    this.renderer.render(this.stage);
  }

  public route(sceneName: string) {
    console.log(sceneName);
  }

  public onUpdate() {
    this.renderer.render(this.stage);
  }
}

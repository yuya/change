import * as PIXI from "pixi.js";
import { conf } from "conf";
import { GameController, SoundController } from "controllers";
import { UserData, AssetData } from "models";

export abstract class Scene extends PIXI.Container {
  protected game  : GameController;
  protected sound : SoundController;

  protected se        : { [key : string] : Howl };
  protected el        : { [key : string] : PIXI.Sprite };
  protected rect      : { [key : string] : PIXI.Graphics };
  protected userData  : UserData;
  protected assetData : AssetData;
  protected container : PIXI.Container;

  protected constructor() {
    super();

    this.game  = GameController.instance;
    this.sound = SoundController.instance;

    this.se   = {};
    this.el   = {};
    this.rect = {};

    this.userData  = UserData.instance;
    this.assetData = AssetData.instance;

    this.container = new PIXI.Container();
    this.container.name = "container";

    this.game.stage.width  = conf.canvas_width,
    this.game.stage.height = conf.canvas_height;
    this.game.stage.pivot.set(0, 0);
    this.game.stage.position.set(0, 0);

    this.game.stage.addChild(this.container);
  }

  public onUpdate(delta: number): void {
    this.game.renderer.render(this.game.stage);
  }

  public destroy(): void {
    this.game.ticker.stop();
    this.container.destroy({ children: true });

    this.game.renderer.render(this.game.stage);
  }
}

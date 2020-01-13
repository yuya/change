import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class BootScene extends Scene {
  private btnSoundOk: PIXI.Sprite;
  private btnSoundNg: PIXI.Sprite;

  constructor() {
    super();

    const container = new PIXI.Container;
    container.width = 40;
    container.height = 80;

    this.btnSoundOk = PIXI.Sprite.from("/img/btn_vol_on.png");
    this.btnSoundOk.interactive = true;
    this.btnSoundOk.buttonMode = true;
    this.btnSoundOk.width = this.btnSoundOk.height = 80;
    this.btnSoundOk.pivot.set(
      this.btnSoundOk.width / 2,
      this.btnSoundOk.height / 2,
    );
    this.btnSoundOk.position.set(
      this.sceneController.app.screen.width / 2,
      this.sceneController.app.screen.height / 2
    );

    this.btnSoundOk.addListener("pointerup", () => {
      container.destroy({ children: true });
      SceneController.assign("splash");
    });

    // this.sceneController.app.stage.addChild(this.btnSoundOk);
    container.addChild(this.btnSoundOk);
    this.sceneController.app.stage.addChild(container);
  }
}

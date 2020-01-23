import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class BootScene extends Scene {
  private container: PIXI.Container;
  private sprites: any;
  private btnSoundOk: PIXI.Sprite;
  private btnSoundNg: PIXI.Sprite;
  private nextSceneName: string;

  constructor(nextSceneName: string) {
    super();

    this.container     = new PIXI.Container();
    this.sprites       = this.loader.resources["sprites"].spritesheet.textures;
    this.btnSoundOk    = PIXI.Sprite.from(this.sprites["vol_enable.png"]);
    this.btnSoundNg    = PIXI.Sprite.from(this.sprites["vol_disable.png"]);
    this.nextSceneName = nextSceneName;

    this.btnSoundOk.name = "vol_enable";
    this.btnSoundNg.name = "vol_disable";

    this.init();
  }

  private init() {
    const renderTarget = [this.btnSoundOk, this.btnSoundNg];
    const halfScreenWidth = this.sceneController.app.screen.width / 2;
    const fireEventName = "pointerdown";

    renderTarget.forEach((btn, index) => {
      btn.anchor.set(0.5, 0.5);

      btn.x = (btn.name === "vol_enable") ? halfScreenWidth + btn.width : halfScreenWidth - btn.width;
      btn.y = this.sceneController.app.screen.height / 2;

      btn.buttonMode = true;
      btn.interactive = true;

      btn.addListener(fireEventName, () => {
        this.handleBtnClick(fireEventName, btn);
      });

      this.container.addChild(btn);
    });

    this.sceneController.app.stage.addChild(this.container);
  }

  private handleBtnClick(eventName: string, sprite: PIXI.Sprite) {
    this.container.destroy({ children: true });
    SceneController.assign(this.nextSceneName);
  }
}

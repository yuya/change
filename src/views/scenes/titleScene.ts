import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class TitleScene extends Scene {
  private logo: PIXI.Sprite;
  private se: Howl = new Howl({
    src: ["assets/poiiiiin.mp3"]
  }); 
  private isPlayedSE: boolean = false;

  constructor() {
    super();

    this.logo = PIXI.Sprite.from("/img/dna.png");
    this.logo.width = 192;
    this.logo.height = 160;

    this.logo.anchor.set(0.5, 0.5);
    this.logo.position.set(
      this.sceneController.app.screen.width / 2,
      this.sceneController.app.screen.height / 2
    );

    this.logo.buttonMode = true;
    this.logo.interactive = true;

    this.logo.addListener("pointerup", () => {
      this.logo.destroy();
      SceneController.assign("game");
    });

    this.sceneController.app.stage.addChild(this.logo);
  }

  // public renderByFrame(delta: number): void {
  //   this.logo.alpha += 0.1;
  // }
}

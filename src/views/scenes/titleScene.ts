import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class TitleScene extends Scene {
  private container: PIXI.Container;
  private sprites: any;
  private logo: PIXI.Sprite;
  private nextSceneName: string;

  constructor(nextSceneName: string) {
    super();

    this.container     = new PIXI.Container();
    this.sprites       = this.loader.resources["sprites"].spritesheet.textures;
    this.logo          = PIXI.Sprite.from(this.sprites["tmp_title.png"]);
    this.nextSceneName = nextSceneName;

    this.init();
  }

  private init() {
    this.logo.anchor.set(0.5, 0.5);
    this.logo.position.set(
      this.sceneController.app.screen.width / 2,
      this.sceneController.app.screen.height / 2
    );

    this.logo.buttonMode = true;
    this.logo.interactive = true;

    this.logo.addListener("pointerup", () => {
      this.container.destroy({ children: true });
      SceneController.assign(this.nextSceneName);
    });

    this.container.addChild(this.logo);
    this.sceneController.app.stage.addChild(this.container);
  }

  // public renderByFrame(delta: number): void {
  // }
}

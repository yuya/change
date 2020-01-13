import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class SplashScene extends Scene {
  private logo: PIXI.Sprite;
  private se: Howl = new Howl({
    src: ["assets/poiiiiin.mp3"],
    onend: () => {
      this.gotoNextScene();
    }
  }); 
  private isAnimPlayed: boolean = false;

  constructor() {
    super();

    this.logo = PIXI.Sprite.from("/img/change.png");
    this.logo.width = 192;
    this.logo.height = 128;

    this.logo.pivot.set(
      this.logo.width / 2,
      this.logo.height / 2
    );
    this.logo.position.set(
      this.sceneController.app.screen.width / 2,
      -(this.logo.height / 2)
    );

    this.sceneController.app.stage.addChild(this.logo);
  }

  public renderByFrame(delta: number): void {
    // super.renderByFrame(delta);
    const targetY = (this.sceneController.app.screen.height / 2) - (this.logo.height / 8);

    if (this.logo.y >= targetY) {
      if (!this.isAnimPlayed) {
        this.isAnimPlayed = true;
        this.se.play();
      }

      return;
    }

    this.logo.y += 2;
  }

  private gotoNextScene(): void {
    this.logo.destroy();
    SceneController.assign("title"); 
  }
}

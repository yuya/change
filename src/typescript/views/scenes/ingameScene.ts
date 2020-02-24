import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene } from "views";

export class IngameScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures = this.assetData.load("textures");

    // this.initLayout();
    // this.attachEvent();

    // this.renderTitleLogo();
  }

  private initLayout(): void {
    this.game.ticker.start();
  }

  private attachEvent(): void {
  }
}

import { gsap } from "gsap";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";

export class HomeScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.initLayout();
    this.attachEvent();

    this.renderCircleMenu();
  }

  private initLayout(): void {

    this.game.ticker.start();
  }

  private attachEvent(): void {

  }

  private renderCircleMenu(): void {
  }
}

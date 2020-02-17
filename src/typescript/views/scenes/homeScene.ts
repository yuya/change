import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";
import { CircleMenu, AboutContent, ContactContent, ProfileContent,
         SharamQContent, ChatMonchyContent, BeyooOoondsContent
       } from "views/parts/";

export class HomeScene extends Scene {
  private textures   : any;
  private content    : any;
  private prevIndex  : number;
  private circleMenu : CircleMenu;
  
  public constructor() {
    super();

    this.prevIndex = 0;

    this.initLayout();
    this.attachEvent();

    this.renderContent();
    this.renderCircleMenu();
  }

  private initLayout(): void {
    this.game.ticker.start();
  }

  private attachEvent(): void {
    this.game.events["refreshContent"] = (event) => {
      const currentIndex = (event as any).detail.currentIndex;

      if (currentIndex === this.prevIndex || this.content.isDestroyed) {
        return;
      }

      this.content.destroy();
      this.renderContent(currentIndex);

      this.prevIndex = currentIndex;
    };

    this.game.renderer.view.addEventListener("onmovecomplete", this.game.events.refreshContent, false);
  }

  private renderContent(index?: number): void {
    index = 0 || index;

    switch (index) {
      case 0:
      default:
        this.content = new SharamQContent();
        break;
      case 1:
        this.content = new ChatMonchyContent();
        break;
      case 2:
        this.content = new BeyooOoondsContent();
        break;
      case 3:
        this.content = new ContactContent();
        break;
      case 4:
        this.content = new ProfileContent();
        break;
      case 5:
        this.content = new AboutContent();
        break;
        // this.content = new ProfileContent();
        // break;
    }

    this.container.addChild(this.content.element);
  }

  private renderCircleMenu(): void {
    this.circleMenu = new CircleMenu();

    this.container.addChild(this.circleMenu.element);
  }
}

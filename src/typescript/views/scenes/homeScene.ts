import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene, CircleMenu,
         AboutContent, ContactContent, ProfileContent,
         SharamQContent, ChatMonchyContent, BeyooOoondsContent
       } from "views";

export class HomeScene extends Scene {
  private textures   : any;
  private content    : any;
  private lastIndex  : number;
  private circleMenu : CircleMenu;
  
  public constructor() {
    super();

    this.lastIndex = 0;

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

      if (currentIndex === this.lastIndex || this.content.isDestroyed) {
        return;
      }

      this.content.destroy();
      this.renderContent(currentIndex);

      this.lastIndex = currentIndex;
    };

    this.game.renderer.view.addEventListener("onmovecomplete", this.game.events.refreshContent, false);
  }

  private renderContent(index: number = 0): void {
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

    this.lastIndex = index;
    this.container.addChild(this.content.element);
  }

  private renderCircleMenu(): void {
    this.circleMenu = new CircleMenu();

    this.container.addChild(this.circleMenu.element);
  }
}

import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene, CircleMenu,
         AboutContent, ContactContent, ProfileContent,
         SharamQContent, ChatMonchyContent, BeyooOoondsContent
       } from "views";

const ContentType = {
  SharamQ     : 0,
  ChatMonchy  : 1,
  BeyooOoonds : 2,
  Contact     : 3,
  Profile     : 4,
  About       : 5,
} as const;
type ContentType = typeof ContentType[keyof typeof ContentType];

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
      default:
      case ContentType.SharamQ:
        this.content = new SharamQContent();
        break;
      case ContentType.ChatMonchy:
        this.content = new ChatMonchyContent();
        break;
      case ContentType.BeyooOoonds:
        this.content = new BeyooOoondsContent();
        break;
      case ContentType.Contact:
        this.content = new ContactContent();
        break;
      case ContentType.Profile:
        this.content = new ProfileContent();
        break;
      case ContentType.About:
        this.content = new AboutContent();
        break;
    }

    this.lastIndex = index;
    this.container.addChild(this.content.element);
  }

  private renderCircleMenu(): void {
    this.circleMenu = new CircleMenu();

    this.container.addChild(this.circleMenu.element);
  }
}

import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene, CircleMenu,
         AboutContent, ProfileContent, FavoriteContent,
         BeyooOoondsContent, HistoryContent, CreditContent
       } from "views";

const ContentType = {
  About       : 0,
  Profile     : 1,
  Favorite    : 2,
  BeyooOoonds : 3,
  History     : 4,
  Credit      : 5,
} as const;
type ContentType = typeof ContentType[keyof typeof ContentType];

export class HomeScene extends Scene {
  private textures   : any;
  private content    : any;
  private lastIndex  : number;
  private circleMenu : CircleMenu;
  
  public constructor() {
    super();

    this.lastIndex = ContentType.About;

    if (!this.sound.bgm || !this.sound.bgm["home"]) {
      this.sound.initSound();
    }
    this.sound.bgm["home"].play();
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
      const currentIndex = (event as any).currentIndex;

      if (currentIndex === this.lastIndex || this.content.isDestroyed) {
        return;
      }

      this.content.destroy();
      this.renderContent(currentIndex);

      this.lastIndex = currentIndex;
    };

    this.game.eventHandler.on("onmovecomplete", this.game.events.refreshContent);
  }

  private renderContent(index: number = 0): void {
    switch (index) {
      default:
      case ContentType.About:
        this.content = new AboutContent();
        break;
      case ContentType.Profile:
        this.content = new ProfileContent();
        break;
      case ContentType.Favorite:
        this.content = new FavoriteContent();
        break;
      case ContentType.BeyooOoonds:
        this.content = new BeyooOoondsContent();
        break;
      case ContentType.History:
        this.content = new HistoryContent();
        break;
      case ContentType.Credit:
        this.content = new CreditContent();
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

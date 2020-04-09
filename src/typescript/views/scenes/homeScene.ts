import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene, CircleMenu,
         AboutContent, ProfileContent, FavoriteContent,
         BeyooOoondsContent, HistoryContent, CreditContent
       } from "views";

const ContentType = {
  BeyooOoonds : 0,
  Profile     : 1,
  Favorite    : 2,
  History     : 3,
  Credit      : 4,
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

    this.lastIndex = ContentType.About;

    if (!this.sound.bgm || !this.sound.bgm["home"]) {
      this.sound.initSound();
    }
    setTimeout(() => {
      this.sound.bgm["home"].play();
    }, 500);
    this.initLayout();
    this.initSiteLogo();
    this.initVolumeButton();
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

  private renderContent(index: number = ContentType.BeyooOoonds): void {
    switch (index) {
      default:
      case ContentType.BeyooOoonds:
        this.content = new BeyooOoondsContent();
        break;
      case ContentType.Profile:
        this.content = new ProfileContent();
        break;
      case ContentType.Favorite:
        this.content = new FavoriteContent();
        break;
      
      case ContentType.History:
        this.content = new HistoryContent();
        break;
      case ContentType.Credit:
        this.content = new CreditContent();
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

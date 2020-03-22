import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene } from "views";

export class TitleScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures     = this.assetData.load("textures");
    this.el.titleLogo = utils.createSprite(this.textures["logo_dna.png"]);
    this.rect.cover   = utils.createRect(conf.canvas_width, conf.canvas_height);

    this.initLayout();
    this.attachEvent();

    this.renderTitleLogo();
  }

  private initLayout(): void {
    this.el.titleLogo.pivot.set(this.el.titleLogo.width / 2, this.el.titleLogo.height / 2);
    this.el.titleLogo.width *= 2;
    this.el.titleLogo.height *= 2;
    this.el.titleLogo.position.set(utils.display.centerX, utils.display.centerY);
    this.rect.cover.interactive = this.rect.cover.buttonMode = true;

    this.container.addChild(this.el.titleLogo, this.rect.cover);
    this.game.ticker.start();
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("nextSceneName");

    this.rect.cover.addListener("pointerdown", () => {
      this.sound.play("se", "spring");
      setTimeout(() => {
        this.sound.fade("bgm", "title", 1, 0, 750);
      }, 1250);
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          this.container.destroy({ children: true });
          this.game.route(nextSceneName);
        }
      });
    });

    this.sound.play("bgm", "title");
  }

  private renderTitleLogo(): void {
    gsap.to(this.el.titleLogo, {
      duration: utils.msec2sec(660),
      ease: "linear",
      pixi: { scale: 2.05 },
      repeat: -1,
    });
  }
}

import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";

export class TitleScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures     = this.assetData.load("textures");
    this.el.coverRect = utils.createTransparentRect(conf.canvas_width, conf.canvas_height);
    this.el.titleLogo = utils.createSprite(this.textures["logo_dna.png"]);

    this.initLayout();
    this.attachEvent();

    this.renderTitleLogo();
  }

  private initLayout(): void {
    this.el.titleLogo.pivot.set(this.el.titleLogo.width / 2, this.el.titleLogo.height / 2);
    this.el.titleLogo.position.set(this.display.pos.centerX, this.display.pos.centerY);
    this.el.coverRect.interactive = this.el.coverRect.buttonMode = true;

    this.container.addChild(this.el.titleLogo, this.el.coverRect);
    this.game.ticker.start();
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("nextSceneName");
    const bgm = new Howl({
      src: "/assets/audio/bgm_title.mp3",
      loop: true
    });
    const clickSe = new Howl({
      src: "/assets/audio/se_spring.mp3"
      // onend: () => {
      //   bgm.fade(1, 0, 500);
      // }
    });

    this.el.coverRect.addListener("pointerdown", () => {
      clickSe.play();
      setTimeout(() => {
        bgm.fade(1, 0, 750);
      }, 1250);
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          this.destroy();
          this.game.route(nextSceneName);
        }
      });
    });

    bgm.play();
  }

  private renderTitleLogo(): void {
    gsap.to(this.el.titleLogo, {
      duration: utils.msec2sec(660),
      ease: "linear",
      pixi: { scale: 1.05 },
      repeat: -1,
      // yoyo: true
    });
  }
}

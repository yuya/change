import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene } from "views";

export class TitleScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures       = this.assetData.load("textures");
    this.el.titleLogo   = utils.createSprite(this.textures["logo_change"]);
    this.el.bgLabel     = utils.createSprite(this.textures["bg_label"]);
    this.el.labelColor  = utils.createSprite(this.textures["label_color"]);
    this.el.labelRule   = utils.createSprite(this.textures["label_rule"]);
    this.el.labelLife   = utils.createSprite(this.textures["label_life"]);
    this.el.labelMyself = utils.createSprite(this.textures["label_myself"]);
    this.el.labelFuture = utils.createSprite(this.textures["label_future"]);
    this.rect.cover     = utils.createRect(conf.canvas_width, conf.canvas_height);

    this.initLayout();
    this.attachEvent();

    // TODO
    this.renderTitleLogo();
  }

  private initLayout(): void {
    this.el.titleLogo.pivot.set(this.el.titleLogo.width / 2, 0);
    this.el.titleLogo.position.set(utils.display.centerX, 400);
    this.el.titleLogo.scale.set(2, 2);
    this.el.bgLabel.pivot.set(this.el.bgLabel.width / 2, 0);
    this.el.bgLabel.position.set(utils.display.centerX, utils.display.centerY + 24);
    this.el.bgLabel.scale.set(2, 2);

    this.el.bgLabel.addChild(
      this.el.labelColor,
      this.el.labelRule,
      this.el.labelLife,
      this.el.labelMyself,
      this.el.labelFuture,
    );

    [
      this.el.labelColor,
      this.el.labelRule,
      this.el.labelLife,
      this.el.labelMyself,
      this.el.labelFuture,
    ].forEach((el) => {
      this.el.bgLabel.addChild(el);
      el.pivot.set(el.width / 2, el.height / 2);
      el.position.set(this.el.bgLabel.width / 4, this.el.bgLabel.height / 4);
      el.alpha = 0;
    })

    this.el.labelColor.alpha = 1;
    this.rect.cover.interactive = this.rect.cover.buttonMode = true;

    this.container.addChild(this.el.titleLogo, this.el.bgLabel, this.rect.cover);
    this.initVolumeButton();
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

    // TODO
    this.sound.play("bgm", "title");
    this.sound.bgm.title.on("end", () => {
      const bgColor = utils.choice([0xCFCBB1,0xE8C4A5,0xFFC2D0,0xC1A5E8,0xB5DDFF]);
      setTimeout(() => {
        this.game.renderer.backgroundColor = bgColor;
        document.body.style.backgroundColor = `#${bgColor.toString(16)}`;
      }, 200);
    });
  }

  private renderTitleLogo(): void {
    gsap.to(this.el.titleLogo, {
      duration: utils.msec2sec(1000),
      ease: "linear",
      pixi: { scale: 2.05 },
      repeat: -1,
    });
  }
}

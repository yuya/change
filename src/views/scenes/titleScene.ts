import { gsap } from "gsap";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";

export class TitleScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures     = this.assetData.load("textures");
    this.el.coverRect = this.createTransparentRect(this.game.renderer.width / 2, this.game.renderer.height / 2);
    this.el.titleLogo = this.createSprite(this.textures["dna.png"]);

    this.initLayout();
    this.attachEvent();
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
      src: "/assets/bgm_title.mp3",
      loop: true
    });
    const clickSe = new Howl({
      src: "/assets/se_spring.mp3",
      onend: () => {
        bgm.fade(1, 0, 500);
      }
    });

    this.el.coverRect.addListener("pointerdown", () => {
      clickSe.play();
      gsap.to(this.container, {
        duration: 0.1,
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
 
  }

  public destroy(): void {
    this.game.ticker.stop();
    this.container.destroy({ children: true });

    this.game.renderer.render(this.game.stage);
  }

  public onUpdate(delta: number): void {
    this.game.renderer.render(this.game.stage);
  }
}

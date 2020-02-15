import { gsap } from "gsap";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";

export class BootScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures         = this.assetData.load("textures");
    this.el.btnVolEnable  = this.createSprite(this.textures["vol_enable.png"]);
    this.el.btnVolDisable = this.createSprite(this.textures["vol_disable.png"]);

    this.initLayout();
    this.attachEvent();
  }

  private initLayout(): void {
    const btnVolEnableX  = this.display.pos.centerX + (this.el.btnVolEnable.width*0.875);
    const btnVolDisableX = this.display.pos.centerX - (this.el.btnVolDisable.width*0.875);

    this.el.btnVolEnable.pivot.set(this.el.btnVolEnable.width / 2, this.el.btnVolEnable.height / 2);
    this.el.btnVolDisable.pivot.set(this.el.btnVolDisable.width / 2, this.el.btnVolDisable.height / 2);
    this.el.btnVolEnable.position.set(btnVolEnableX, this.display.pos.centerY);
    this.el.btnVolDisable.position.set(btnVolDisableX, this.display.pos.centerY);
    this.el.btnVolEnable.interactive  = this.el.btnVolEnable.buttonMode  = true;
    this.el.btnVolDisable.interactive = this.el.btnVolDisable.buttonMode = true;

    this.container.addChild(
      this.el.btnVolEnable,
      this.el.btnVolDisable
    );

    this.game.ticker.start();
  }

  private attachEvent(): void {
    const animateOption  = {
      duration: 0.1,
        pixi: { alpha: 0 },
        onComplete: () => {
          Object.keys(this.el).forEach((key) => {
            this.el[key].destroy();
          });
    
          this.container.alpha = 1;
          this.renderBootLogo();
        }
    };

    this.el.btnVolEnable.addListener("pointerdown", () => {
      this.userData.save("is_enabled_volume", true);
      this.se.finish = new Howl({ src: "/assets/poiiiiin.mp3" });
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolEnable.addListener("pointerover", () => {
      this.el.btnVolEnable.texture = this.textures["vol_enable_o.png"];
    });
    this.el.btnVolEnable.addListener("pointerout", () => {
      this.el.btnVolEnable.texture = this.textures["vol_enable.png"];
    });

    this.el.btnVolDisable.addListener("pointerdown", () => {
      this.userData.save("is_enabled_volume", false);
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolDisable.addListener("pointerover", () => {
      this.el.btnVolDisable.texture = this.textures["vol_disable_o.png"];
    });
    this.el.btnVolDisable.addListener("pointerout", () => {
      this.el.btnVolDisable.texture = this.textures["vol_disable.png"];
    });
  }

  private renderBootLogo(): void {
    const isEnableVol    = this.userData.load("is_enabled_volume");
    const nextSceneName  = this.userData.load("nextSceneName");
    const onAnimationEnd = () => {
      this.destroy();
      this.game.route(nextSceneName);
    };

    this.el.bootLogo = this.createSprite(this.textures["splash.png"]);
    this.el.bootLogo.pivot.set(this.el.bootLogo.width / 2, this.el.bootLogo.height / 2);
    this.el.bootLogo.position.set(this.display.pos.centerX, -this.el.bootLogo.height);

    gsap.to(this.el.bootLogo, {
      duration: 2.75,
      ease: "linear",
      pixi: { y: this.display.pos.centerY },
      onComplete: () => {
        if (isEnableVol) {
          this.se.finish.on("end", onAnimationEnd);
          this.se.finish.play();
        } 
        else {
          setTimeout(onAnimationEnd, 1000);
        }
      }
    })

    this.container.addChild(this.el.bootLogo);
  }

  public onUpdate(delta: number): void {
    this.game.renderer.render(this.game.stage);
  }

  public destroy(): void {
    this.game.ticker.stop();
    this.container.destroy({ children: true });

    this.game.renderer.render(this.game.stage);
  }
}

import { gsap } from "gsap";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Scene } from "views/scenes/_scene";

export class BootScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures     = this.assetData.load("textures");
    this.el.btnVolOn  = utils.createSprite(this.textures["btn_vol_on.png"]);
    this.el.btnVolOff = utils.createSprite(this.textures["btn_vol_off.png"]);

    this.initLayout();
    this.attachEvent();
  }

  private initLayout(): void {
    const btnVolOnPosX  = utils.display.centerX + (this.el.btnVolOn.width*1.2);
    const btnVolOffPosX = utils.display.centerX - (this.el.btnVolOff.width*1.2);

    // this.el.btnVolOn.scale.set(2, 2);
    // this.el.btnVolOff.scale.set(2, 2);
    this.el.btnVolOn.pivot.set(this.el.btnVolOn.width / 2, this.el.btnVolOn.height / 2);
    this.el.btnVolOff.pivot.set(this.el.btnVolOff.width / 2, this.el.btnVolOff.height / 2);

    this.el.btnVolOn.width *= 2;
    this.el.btnVolOn.height *= 2;
    this.el.btnVolOff.width *= 2;
    this.el.btnVolOff.height *= 2;

    this.el.btnVolOn.position.set(btnVolOnPosX, utils.display.centerY);
    this.el.btnVolOff.position.set(btnVolOffPosX, utils.display.centerY);
    this.el.btnVolOn.interactive  = this.el.btnVolOn.buttonMode  = true;
    this.el.btnVolOff.interactive = this.el.btnVolOff.buttonMode = true;

    this.container.addChild(
      this.el.btnVolOn,
      this.el.btnVolOff
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

    this.el.btnVolOn.addListener("pointerdown", () => {
      this.userData.save("is_enabled_volume", true);
      this.se.finish = new Howl({ src: "/assets/audio/poiiiiin.mp3" });
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolOn.addListener("pointerover", () => {
      this.el.btnVolOn.texture = this.textures["btn_vol_on_o.png"];
    });
    this.el.btnVolOn.addListener("pointerout", () => {
      this.el.btnVolOn.texture = this.textures["btn_vol_on.png"];
    });

    this.el.btnVolOff.addListener("pointerdown", () => {
      this.userData.save("is_enabled_volume", false);
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolOff.addListener("pointerover", () => {
      this.el.btnVolOff.texture = this.textures["btn_vol_off_o.png"];
    });
    this.el.btnVolOff.addListener("pointerout", () => {
      this.el.btnVolOff.texture = this.textures["btn_vol_off.png"];
    });
  }

  private renderBootLogo(): void {
    const isEnableVol    = this.userData.load("is_enabled_volume");
    const nextSceneName  = this.userData.load("nextSceneName");
    const onAnimationEnd = () => {
      this.destroy();
      this.game.route(nextSceneName);
    };

    this.el.bootLogo = utils.createSprite(this.textures["logo_change.png"]);
    this.el.bootLogo.pivot.set(this.el.bootLogo.width / 2, this.el.bootLogo.height / 2);
    this.el.bootLogo.width *= 2;
    this.el.bootLogo.height *= 2;
    this.el.bootLogo.position.set(utils.display.centerX, -this.el.bootLogo.height);

    gsap.to(this.el.bootLogo, {
      duration: utils.msec2sec(2750),
      ease: "linear",
      pixi: { y: utils.display.centerY },
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
}

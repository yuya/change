import { gsap } from "gsap";
import { utils } from "utils";
import { Scene } from "views";

export class BootScene extends Scene {
  private textures: any;
  
  public constructor() {
    super();

    this.textures     = this.assetData.load("textures");
    this.el.btnVolOn  = utils.createSprite(this.textures["btn_vol_on"]);
    this.el.btnVolOff = utils.createSprite(this.textures["btn_vol_off"]);

    this.initLayout();
    this.attachEvent();
  }

  private initLayout(): void {
    const btnVolOnPosX  = utils.display.centerX + 32;
    const btnVolOffPosX = utils.display.centerX - 32;

    this.el.btnVolOn.pivot.set(0, this.el.btnVolOn.height / 2);
    this.el.btnVolOff.pivot.set(this.el.btnVolOff.width, this.el.btnVolOff.height / 2);

    this.el.btnVolOn.scale.set(2, 2);
    this.el.btnVolOff.scale.set(2, 2);
    this.el.btnVolOn.interactive  = this.el.btnVolOn.buttonMode  = true;
    this.el.btnVolOff.interactive = this.el.btnVolOff.buttonMode = true;

    this.el.btnVolOn.position.set(btnVolOnPosX, utils.display.centerY);
    this.el.btnVolOff.position.set(btnVolOffPosX, utils.display.centerY);

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
      this.userData.save("is_mute_volume", 0, true);
      this.sound.initSound();
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolOn.addListener("pointerover", () => {
      this.el.btnVolOn.texture = this.textures["btn_vol_on_o"];
      this.el.btnVolOn.position.y += 4;
    });
    this.el.btnVolOn.addListener("pointerout", () => {
      this.el.btnVolOn.texture = this.textures["btn_vol_on"];
      this.el.btnVolOn.position.y -= 4;
    });

    this.el.btnVolOff.addListener("pointerdown", () => {
      this.userData.save("is_mute_volume", 1, true);
      gsap.to(this.container, animateOption);
    });
    this.el.btnVolOff.addListener("pointerover", () => {
      this.el.btnVolOff.texture = this.textures["btn_vol_off_o"];
      this.el.btnVolOff.position.y += 4;
    });
    this.el.btnVolOff.addListener("pointerout", () => {
      this.el.btnVolOff.texture = this.textures["btn_vol_off"];
      this.el.btnVolOff.position.y -= 4;
    });
  }

  private renderBootLogo(): void {
    const isMuteVolume   = +this.userData.load("is_mute_volume");
    const nextSceneName  = this.userData.load("next_scene_name");
    const onAnimationEnd = () => {
      this.container.destroy({ children: true });
      // this.destroy();
      this.game.route(nextSceneName);
    };

    this.el.bootLogo = utils.createSprite(this.textures["logo_change"]);
    this.el.bootLogo.pivot.set(this.el.bootLogo.width / 2, 0);
    this.el.bootLogo.width *= 2;
    this.el.bootLogo.height *= 2;
    this.el.bootLogo.position.set(utils.display.centerX, -this.el.bootLogo.height);

    gsap.to(this.el.bootLogo, {
      duration: utils.msec2sec(2500),
      ease: "linear",
      pixi: { y: 400 },
      onComplete: () => {
        if (!isMuteVolume) {
          this.sound.play("se", "boot");
          this.sound.se.boot.on("end", onAnimationEnd);
        } 
        else {
          setTimeout(onAnimationEnd, 1000);
        }
      }
    })

    this.container.addChild(this.el.bootLogo);
  }
}

import * as PIXI from "pixi.js";
import { conf } from "conf";
import { GameController, SoundController } from "controllers";
import { UserData, AssetData } from "models";

export abstract class Scene extends PIXI.Container {
  protected game  : GameController;
  protected sound : SoundController;

  protected se        : { [key : string] : Howl };
  protected el        : { [key : string] : PIXI.Sprite };
  protected rect      : { [key : string] : PIXI.Graphics };
  protected userData  : UserData;
  protected assetData : AssetData;
  protected container : PIXI.Container;

  protected constructor() {
    super();

    this.game  = GameController.instance;
    this.sound = SoundController.instance;

    this.se   = {};
    this.el   = {};
    this.rect = {};

    this.userData  = UserData.instance;
    this.assetData = AssetData.instance;

    this.container = new PIXI.Container();
    this.container.name = "container";

    this.game.stage.width  = conf.canvas_width,
    this.game.stage.height = conf.canvas_height;
    this.game.stage.pivot.set(0, 0);
    this.game.stage.position.set(0, 0);

    this.game.stage.addChild(this.container);
  }

  public onUpdate(delta: number): void {
    this.game.renderer.render(this.game.stage);
  }

  public initSiteLogo(): void {
    if (document.getElementById("logo")) {
      return;
    }

    const logoElement = document.createElement("div");
    const spriteInfo  = this.assetData.load("spriteSheetUi");
    const spriteImage = spriteInfo.children[0].data;

    spriteImage.width  = spriteInfo.data.meta.size.w;
    spriteImage.height = spriteInfo.data.meta.size.h;
    spriteImage.style.top  = `-${spriteInfo.spritesheet.textures.logo_change.orig.y}px`;
    spriteImage.style.left = `-${spriteInfo.spritesheet.textures.logo_change.orig.x}px`;

    logoElement.id = "logo";
    logoElement.appendChild(spriteImage);
    conf.canvas_el.appendChild(logoElement);

    logoElement.addEventListener("click", () => {
      this.sound.play("se", "decide");
      setTimeout(() => {
        location.assign(`${location.origin}/`);
      }, 330);
    }, false);
  }

  public initVolumeButton(): void {
    if (document.getElementById("btn-sound-toggle")) {
      return;
    }

    const btnSoundToggle = document.createElement("div");
    const spriteInfo     = this.assetData.load("spriteSheetDom");
    const spriteImage    = spriteInfo.children[0].data;

    spriteImage.width  = spriteInfo.data.meta.size.w * 2;
    spriteImage.height = spriteInfo.data.meta.size.h * 2;
    btnSoundToggle.appendChild(spriteImage);

    btnSoundToggle.id = "btn-sound-toggle";
    btnSoundToggle.setAttribute("data-is-mute", +this.userData.load("is_mute_volume") ? "true" : "false");

    btnSoundToggle.addEventListener("click", () => {
      const currentMuteState = +this.userData.load("is_mute_volume");

      // mute -> unmute
      if (currentMuteState) {
        this.sound.howler.mute(false);
        btnSoundToggle.setAttribute("data-is-mute", "false");
        this.userData.save("is_mute_volume", 0, true);
      }
      // unmute -> mute
      else {
        this.sound.howler.mute(true);
        btnSoundToggle.setAttribute("data-is-mute", "true");
        this.userData.save("is_mute_volume", 1, true);
      }
    });

    conf.canvas_el.appendChild(btnSoundToggle);
    setTimeout(() => btnSoundToggle.classList.add("show"), 100);
  }

  public fadeScreen(from: number, to: number, duration: number, callback?: any, delay?: number) {
    const isFadeIn = (from === 0 && to === 1);
    const addValue = isFadeIn ? 0.1 : -0.1;
    const interval = duration / (1 / Math.abs(addValue));

    const coverDom = document.createElement("div");
    coverDom.id = "cover";
    coverDom.style.opacity = `${from}`;
    document.body.appendChild(coverDom);

    let lastVal = from;
    let timerId = setInterval(() => {
      lastVal = Math.round((lastVal + addValue) * 100) / 100;
      coverDom.style.opacity = `${lastVal}`;

      if (isFadeIn && lastVal >= to ||
        !isFadeIn && lastVal <= to) {
       clearInterval(timerId);

       if (callback && delay) {
         setTimeout(() => {
          callback();
          document.body.removeChild(coverDom);
         }, delay);
       }
       else if (callback) {
         callback();
         document.body.removeChild(coverDom);
       }
     }
    }, interval);
  }

  public destroy(): void {
    this.game.ticker.stop();
    this.container.destroy({ children: true });
    this.game.stage.removeChildren();

    const dom = document.getElementById("dom");
    dom && conf.canvas_el.removeChild(dom);

    this.game.renderer.render(this.game.stage);
  }
}

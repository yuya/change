import { Howl, Howler } from "howler";
import { conf } from "conf";
import { UserData, AssetData } from "models";

export class SoundController {
  public se       : { [key : string] : Howl };
  public bgm      : { [key : string] : Howl };
  public jingle   : { [key : string] : Howl };
  public isLoaded : boolean;

  private static _instance: SoundController;
  public static get instance(): SoundController {
    if (!this._instance) {
      this._instance = new SoundController();
    }

    return this._instance;
  }

  private constructor() {
    this.se     = {};
    this.bgm    = {};
    this.jingle = {};

    this.isLoaded = false;
  }

  // mobile browser の touch event で発火することを想定
  public initSound(): void {
    if (this.isLoaded) {
      return;
    }

    // SE
    this.se["poiiiiin"] = new Howl({ src : "/assets/audio/poiiiiin.mp3" });
    this.se["spring"]   = new Howl({ src : "/assets/audio/se_spring.mp3" });
    this.se["po"]       = new Howl({ src : "/assets/audio/se_po.wav" });
    this.se["puin"]     = new Howl({ src : "/assets/audio/se_puin.wav" });
    this.se["hit"]      = new Howl({ src : "/assets/audio/hit.wav" });
    this.se["miss"]     = new Howl({ src : "/assets/audio/miss.wav" });
    this.se["suburi"]   = new Howl({ src : "/assets/audio/suburi.wav" });
    this.se["throw"]    = new Howl({ src : "/assets/audio/throw.wav" });

    // BGM
    this.bgm["title"] = new Howl({ src: "/assets/audio/bgm_title.mp3", loop: true });

    // JINGLE
    this.jingle["intro"] = new Howl({ src : "/assets/audio/intro.mp3" });

    this.isLoaded = true;
  }

  public play(type: string, name: string): void{
    if (this[type][name] == null) {
      this.initSound();
      this.play(type, name);
    }

    this[type][name].play();
  }

  public pause(type: string, name: string): void {
    if (this[type][name] == null) {
      this.initSound();
      this.pause(type, name);
    }

    this[type][name].pause();
  }

  public fade(type: string, name: string, ...arg: number[]): void {
    if (this[type][name] == null) {
      this.initSound();
      this.fade(type, name, ...arg);
    }

    this[type][name].fade(...arg);
  }
}

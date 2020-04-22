import { Howl, Howler } from "howler";
import { conf } from "conf";
import { UserData, AssetData } from "models";

export class SoundController {
  public howler      : HowlerGlobal;
  public se          : { [key : string] : Howl };
  public bgm         : { [key : string] : Howl };
  public jingle      : { [key : string] : Howl };
  public isLoaded    : boolean;
  public isBgmPlayed : boolean;
  private userData   : UserData;

  private static _instance: SoundController;
  public static get instance(): SoundController {
    if (!this._instance) {
      this._instance = new SoundController();
    }

    return this._instance;
  }

  private constructor() {
    this.howler = Howler;
    this.se     = {};
    this.bgm    = {};
    this.jingle = {};

    this.isLoaded    = false;
    this.isBgmPlayed = false;
    this.userData = UserData.instance;
  }

  // mobile browser の touch event で発火することを想定
  public initSound(): void {
    if (this.isLoaded) {
      return;
    }
    
    // SE
    this.se["boot"]      = new Howl({ src : "/assets/audio/se_boot.mp3" });
    this.se["decide"]    = new Howl({ src : "/assets/audio/se_decide.mp3" });
    this.se["cancel"]    = new Howl({ src : "/assets/audio/se_cancel.mp3" });
    this.se["select"]    = new Howl({ src : "/assets/audio/se_select.mp3" });
    this.se["hit"]       = new Howl({ src : ["/assets/audio/se_hit.ogg", "/assets/audio/se_hit.mp3"] });
    this.se["miss"]      = new Howl({ src : "/assets/audio/se_miss.mp3" });
    this.se["eval_from"] = new Howl({ src : "/assets/audio/se_eval_from.mp3" });
    this.se["eval_msg"]  = new Howl({ src : "/assets/audio/se_eval_msg.mp3" });
    this.se["eval_high"] = new Howl({ src : "/assets/audio/se_eval_high.mp3" });
    this.se["eval_mid"]  = new Howl({ src : "/assets/audio/se_eval_mid.mp3" });
    this.se["eval_low"]  = new Howl({ src : "/assets/audio/se_eval_low.mp3" });
    this.se["swing"]     = new Howl({ src : ["/assets/audio/se_swing.ogg", "/assets/audio/se_swing.mp3"] });
    this.se["throw"]     = new Howl({ src : ["/assets/audio/se_throw.ogg", "/assets/audio/se_throw.mp3"] });
    this.se["punch_l"]   = new Howl({ src : ["/assets/audio/se_punch_l.ogg", "/assets/audio/se_punch_l.mp3"] });
    this.se["punch_r"]   = new Howl({ src : ["/assets/audio/se_punch_r.ogg", "/assets/audio/se_punch_r.mp3"] });
    this.se["punch_ska"] = new Howl({ src : ["/assets/audio/se_punch_ska.ogg", "/assets/audio/se_punch_ska.mp3"] });

    // BGM
    this.bgm["title"]     = new Howl({ src : ["/assets/audio/bgm_title.ogg", "/assets/audio/bgm_title.mp3"], loop : true });
    this.bgm["home"]      = new Howl({ src : ["/assets/audio/bgm_home.ogg", "/assets/audio/bgm_home.mp3"], loop : true });
    this.bgm["eval_high"] = new Howl({ src : "/assets/audio/bgm_eval_high.mp3", loop : true });
    this.bgm["eval_mid"]  = new Howl({ src : "/assets/audio/bgm_eval_mid.mp3", loop  : true });
    this.bgm["eval_low"]  = new Howl({ src : "/assets/audio/bgm_eval_low.mp3", loop  : true });
    // this.bgm["home"]      = new Howl({ src : "/assets/audio/bgm_home.mp3", loop      : true });
    // this.bgm["home"]      = new Howl({ src : "/assets/audio/bgm_home.mp3", loop      : true });

    // JINGLE
    this.jingle["metronome"]  = new Howl({ src : "/assets/audio/jingle_metronome.mp3" });
    this.jingle["intro"]      = new Howl({ src : "/assets/audio/jingle_intro.mp3" });
    this.jingle["outro"]      = new Howl({ src : "/assets/audio/jingle_outro.mp3" });
    this.jingle["outro_high"] = new Howl({ src : "/assets/audio/jingle_outro_high.mp3" });

    this.isLoaded = true;
  }

  public play(type: string, name: string): void {
    if (+this.userData.load("is_mute_volume")) {
      this.howler.mute(true);
    }
    if (this[type][name] == null) {
      this.initSound();
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

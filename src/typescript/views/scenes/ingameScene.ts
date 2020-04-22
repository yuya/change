import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import YTPlayer from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { BeyooOoondsModel } from "models/ingame/beyooooondsModel";
import { Scene } from "views";
import { Intro } from "views/ingame/beyooooonds/intro";

const YT_STATE = {
  UNSTARTED : -1,
  ENDED     :  0,
  PLAYING   :  1,
  PAUSED    :  2,
  BUFFERING :  3,
  CUED      :  5,
} as const;
type YT_STATE = typeof YT_STATE[keyof typeof YT_STATE];

const SubtitlePos = {
  hey       : { x :  12, y : 206 },
  yo        : { x : 184, y : 206 },
  japanese  : { x :   3, y : 188 },
  ybi_1     : { x :  17, y : 199 },
  ybi_2     : { x : 169, y : 199 },
  japa      : { x :  15, y : 128 },
  nese      : { x :  17, y : 234 },
  nippon_no : { x :  10, y : 128 },
  nippon_d  : { x :  49, y : 128 },
  nippon_n  : { x : 141, y : 128 },
  nippon_a  : { x : 225, y : 128 },
  d_big     : { x :  31, y : 128 },
  n_big     : { x : 123, y : 128 },
  a_big     : { x : 207, y : 128 },
  d_mid     : { x :  19, y : 179 },
  n_mid     : { x : 119, y : 179 },
  a_mid     : { x : 210, y : 179 },
  da_1      : { x :  13, y :  99 },
  da_2      : { x : 114, y :  99 },
  da_3      : { x : 215, y :  99 },
  da_4      : { x :  13, y : 199 },
  da_5      : { x : 114, y : 199 },
  da_6      : { x : 215, y : 199 },
  da_7      : { x :  13, y : 299 },
} as const;
type SubtitlePos = typeof SubtitlePos[keyof typeof SubtitlePos];

const FxStarPos = {
   star_1 : { x: 46, y:  5 },
   star_2 : { x: 57, y: 14 },
   star_3 : { x: 63, y: 29 },
   star_4 : { x: 57, y: 45 },
   star_5 : { x: 45, y: 55 },
   star_6 : { x: 30, y: 62 },
   star_7 : { x: 15, y: 56 },
   star_8 : { x:  7, y: 48 },
   star_9 : { x:  0, y: 33 },
  star_10 : { x:  3, y: 18 },
  star_11 : { x: 15, y:  4 },
  star_12 : { x: 30, y:  0 },
} as const;
type FxStarPos = typeof FxStarPos[keyof typeof FxStarPos];

type AnimSprites = {
  wait    : PIXI.AnimatedSprite,
  punch_l : PIXI.AnimatedSprite,
  punch_r : PIXI.AnimatedSprite,
};

type ActData = {
  time         : number,
  act          : string,
  act_fever    : string,
  duration     : number,
  act_se       : string,
  act_fever_se : string,
};
type NoteData = {
  instance      : GSAPTimeline,
  note_sprite   : PIXI.Sprite,
  note_time     : number,
  note_obj      : string,
  note_duration : number,
  note_spawn_se : string,
};
type GayaData = {
  time     : number,
  act      : string,
  duration : number,
};

const Result = {
  ska : -1,
  ng  :  0,
  ok  :  1,
} as const;
type Result = typeof Result[keyof typeof Result];
type ResultTable = {
  [key : number] : Result
};

export class IngameScene extends Scene {
  private textures      : any;
  private intro         : Intro;
  private player        : YouTubePlayer;
  private model         : BeyooOoondsModel;
  private judgeTimes    : number[];
  private spawnTimes    : number[];
  private gayaTimes     : number[];
  private actDatas      : ActData[];
  private noteDatas     : NoteData[];
  private gayaDatas     : GayaData[];
  private resultTable   : ResultTable;
  private prevJudge     : number;
  private prevSpawn     : number;
  private prevGaya      : number;
  private rawScore      : number;
  private isLoaded      : boolean;
  private isPaused      : boolean;
  private isFever       : boolean;
  private norikan       : number;
  private norikanEl     : PIXI.Container;
  private playerState   : number;
  private startTime     : number;
  private elapsedTime   : number;
  private currentTime   : number;
  private lastTime      : number;
  private loopTimer     : number;
  private interval      : number;
  private ytOptions     : object;
  private animParts     : any;
  private animSprites   : AnimSprites;
  private currentAnim   : PIXI.AnimatedSprite;
  private subtitle      : { [key : string] : PIXI.Sprite };
  private subtitleEl    : PIXI.Container;
  private fxGreatEl     : PIXI.Container;
  private fxPerfectEl   : PIXI.Container;
  private starList      : PIXI.Sprite[];

  public constructor() {
    super();

    this.model         = new BeyooOoondsModel();
    this.textures      = this.assetData.load("textures");
    this.judgeTimes    = [];
    this.spawnTimes    = [];
    this.gayaTimes     = [];
    this.actDatas      = [];
    this.noteDatas     = [];
    this.gayaDatas     = [];
    this.resultTable   = {};
    this.subtitle      = {};
    this.isLoaded      = false;
    this.isPaused      = false;
    this.isFever       = false;
    this.rawScore      = 0;
    this.norikan       = 0;
    this.rect.cover    = utils.createRect("cover", conf.canvas_width, conf.canvas_height);
    this.animParts     = this.assetData.load("animation").spritesheet.textures;

    this.game.events["enablePause"] = this.enablePause.bind(this);
    this.starList = [
      utils.createSprite(this.animParts["anim_fx_star_1"],   "star_1"),
      utils.createSprite(this.animParts["anim_fx_star_2"],   "star_2"),
      utils.createSprite(this.animParts["anim_fx_star_3"],   "star_3"),
      utils.createSprite(this.animParts["anim_fx_star_4"],   "star_4"),
      utils.createSprite(this.animParts["anim_fx_star_5"],   "star_5"),
      utils.createSprite(this.animParts["anim_fx_star_6"],   "star_6"),
      utils.createSprite(this.animParts["anim_fx_star_7"],   "star_7"),
      utils.createSprite(this.animParts["anim_fx_star_8"],   "star_8"),
      utils.createSprite(this.animParts["anim_fx_star_9"],   "star_9"),
      utils.createSprite(this.animParts["anim_fx_star_10"], "star_10"),
      utils.createSprite(this.animParts["anim_fx_star_11"], "star_11"),
      utils.createSprite(this.animParts["anim_fx_star_12"], "star_12"),
    ];
    
    this.initGameData();
    this.initAnimSprites();

    this.player = YTPlayer(conf.player_el, this.model.ytOptions);
    this.player.setPlaybackQuality("small");
    this.player.setVolume(0);
    // this.player.mute();

    this.attachEvent();
  }

  private initGameData(): void {
    this.model.ingameData.forEach((item, index) => {
      const type = item["type"];

      if (type === "judge") {
        this.judgeTimes.push(item["time"]);
        this.spawnTimes.push(item["note_time"]);
        
        this.actDatas.push({
          time         : item["time"],
          act          : item["act"],
          act_fever    : item["act_fever"],
          duration     : item["duration"],
          act_se       : item["act_se"],
          act_fever_se : item["act_fever_se"],
        });
        this.noteDatas.push({
          instance      : null,
          note_sprite   : null,
          note_time     : item["note_time"],
          note_obj      : item["note_obj"],
          note_duration : item["note_duration"],
          note_spawn_se : item["note_spawn_se"],
        });
      }
      else if (type === "gaya") {
        this.gayaTimes.push(item["time"]);
        this.gayaDatas.push({
          time     : item["time"],
          act      : item["act"],
          duration : item["duration"],
        });
      }
      else if (type === "fade_in") {
      }
      else if (type === "fade_out") {
      }
    });
  }

  private initAnimSprites(): void {
    this.animSprites = {
      wait    : this.createAnimatedSprite("wait"),
      punch_l : this.createAnimatedSprite("punch_l"),
      punch_r : this.createAnimatedSprite("punch_r"),
    };

    this.animSprites.wait.loop = true;
  }

  private attachEvent(): void {
    this.game.eventHandler.on("introPlayed", () => {
      conf.root_el.classList.add("yt-loaded");
      this.setYoutubeParam();
      this.initLayout();
      this.game.ticker.start();
    });

    this.game.eventHandler.once("fadeIn", () => {
      this.fadeVolume(0, 100, 300);
    });

    this.game.eventHandler.once("fadeOut", () => {
      const nextSceneName = this.userData.load("next_scene_name");

      this.fadeVolume(100, 0, 300);
      this.fadeScreen(0, 1, 300, () => {
        this.game.ticker.stop();
        this.syncCurrentTime();
        this.userData.save("latest_score", this.currentScore);

        conf.root_el.classList.remove("yt-loaded");
        document.removeEventListener("visibilitychange", this.game.events.enablePause, false);
        this.player.destroy();
        this.disableFeverBg();
        utils.setBgColor(this.game.renderer, conf.color.gray);
        this.destroy();
        this.game.currentScene.destroy();

        setTimeout(() => {
          this.game.route(nextSceneName);
        }, 200);
      });
    });

    this.player.on("ready",       () => { this.showIntro() });
    this.player.on("stateChange", (event) => { this.handleStateChange(event) });

    document.addEventListener("visibilitychange", this.game.events.enablePause, false);
  }

  private enableFeverBg(): void {
    this.el.feverBg.visible = true;

    this.game.events["animFeverBg"] = setInterval(() => {
      const textureName = (this.el.feverBg.texture.textureCacheIds[0] === "bg_fever_1") ? "bg_fever_2" : "bg_fever_1";

      this.el.feverBg.texture = this.animParts[textureName];
    }, 1000);
  }

  private disableFeverBg(): void {
    this.el.feverBg.visible = false;
    clearInterval(this.game.events["animFeverBg"]);
  }

  private createAnimatedSprite(name: string): PIXI.AnimatedSprite {
    const resource = this.assetData.load("animation");
    const textures = resource.textures;
    const data     = resource.data.animations;
    const animInfo = data[name].map((anim, index) => {
      return {
        texture: textures[anim.texture],
        time: anim.duration,
      }
    });

    const animSprite = new PIXI.AnimatedSprite(animInfo);
    animSprite.loop    = false;
    animSprite.visible = false;
    animSprite.pivot.set(0, animSprite.height);
    animSprite.scale.set(3, 3);
    animSprite.position.set(40, conf.canvas_height - 120);

    return animSprite;
  }

  private get currentScore(): number {
    return Math.floor(this.rawScore);
  }

  private showIntro(): void {
    this.intro = new Intro(this.player);
    this.container.addChild(this.intro.element);
  }

  private async syncCurrentTime(): Promise<void> {
    const time = await this.player.getCurrentTime();

    if (!time) {
      return;
    }

    this.currentTime = utils.sec2msec(time);
  }

  private initNorikan(): void {
    this.el.norikan_icon_1 = utils.createSprite(this.textures["icon_nori_1"], "norikan_icon_1");
    this.el.norikan_icon_2 = utils.createSprite(this.textures["icon_nori_1"], "norikan_icon_2");
    this.el.norikan_icon_3 = utils.createSprite(this.textures["icon_nori_1"], "norikan_icon_3");
    this.el.norikan_icon_4 = utils.createSprite(this.textures["icon_nori_1"], "norikan_icon_4");
    this.el.norikan_icon_5 = utils.createSprite(this.textures["icon_nori_1"], "norikan_icon_5");
    this.el.norikan_label  = utils.createSprite(this.textures["label_nori"], "norikan_label");

    this.norikanEl = new PIXI.Container();
    this.norikanEl.name = "norikan";
    this.norikanEl.width  = 16;
    this.norikanEl.height = 132;
    this.norikanEl.addChild(
      this.el.norikan_icon_5,
      this.el.norikan_icon_4,
      this.el.norikan_icon_3,
      this.el.norikan_icon_2,
      this.el.norikan_icon_1,
      this.el.norikan_label,
    );

    this.el.norikan_icon_5.position.set(2,  0);
    this.el.norikan_icon_4.position.set(2, 19);
    this.el.norikan_icon_3.position.set(2, 38);
    this.el.norikan_icon_2.position.set(2, 57);
    this.el.norikan_icon_1.position.set(2, 76);
    this.el.norikan_label.position.set(3, 100);

    this.norikanEl.pivot.set(this.norikanEl.width, 0);
    this.norikanEl.scale.set(2, 2);
    this.norikanEl.position.set(conf.canvas_width - 30, 50);

    this.norikanEl.on("increment", () => {
      this.norikan++;
      this.updateNorikan(this.norikan);
    });

    this.norikanEl.on("reset", () => {
      this.norikan = 0;
      this.updateNorikan(this.norikan);
    });
  }

  private initSubtitle(): void {
    this.subtitle["hey"]       = utils.createSprite(this.animParts["anim_txt_hey"], "hey");
    this.subtitle["yo"]        = utils.createSprite(this.animParts["anim_txt_yo"], "yo");
    this.subtitle["japanese"]  = utils.createSprite(this.animParts["anim_txt_japanese"], "japanese");
    this.subtitle["ybi_1"]     = utils.createSprite(this.animParts["anim_txt_ybi"], "ybi_1");
    this.subtitle["ybi_2"]     = utils.createSprite(this.animParts["anim_txt_ybi"], "ybi_2");
    this.subtitle["japa"]      = utils.createSprite(this.animParts["anim_txt_japa"], "japa");
    this.subtitle["nese"]      = utils.createSprite(this.animParts["anim_txt_nese"], "nese");
    this.subtitle["nippon_no"] = utils.createSprite(this.animParts["anim_txt_nippon_no"], "nippon_no");
    this.subtitle["nippon_d"]  = utils.createSprite(this.animParts["anim_txt_nippon_d"], "nippon_d");
    this.subtitle["nippon_n"]  = utils.createSprite(this.animParts["anim_txt_nippon_n"], "nippon_n");
    this.subtitle["nippon_a"]  = utils.createSprite(this.animParts["anim_txt_nippon_a"], "nippon_a");
    this.subtitle["d_big"]     = utils.createSprite(this.animParts["anim_txt_nippon_d"], "d_big");
    this.subtitle["n_big"]     = utils.createSprite(this.animParts["anim_txt_nippon_n"], "n_big");
    this.subtitle["a_big"]     = utils.createSprite(this.animParts["anim_txt_nippon_a"], "a_big");
    this.subtitle["d_mid"]     = utils.createSprite(this.animParts["anim_txt_d"], "d_mid");
    this.subtitle["n_mid"]     = utils.createSprite(this.animParts["anim_txt_n"], "n_mid");
    this.subtitle["a_mid"]     = utils.createSprite(this.animParts["anim_txt_a"], "a_mid");
    this.subtitle["da_1"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_1");
    this.subtitle["da_2"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_2");
    this.subtitle["da_3"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_3");
    this.subtitle["da_4"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_4");
    this.subtitle["da_5"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_5");
    this.subtitle["da_6"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_6");
    this.subtitle["da_7"]      = utils.createSprite(this.animParts["anim_txt_da"], "da_7");

    this.subtitleEl = new PIXI.Container();
    this.subtitleEl.name = "subtitle";
    this.subtitleEl.width  = conf.canvas_width;
    this.subtitleEl.height = conf.canvas_height;

    Object.keys(this.subtitle).forEach((key, index) => {
      const subtitle = this.subtitle[key];

      subtitle.position.set(SubtitlePos[key].x, SubtitlePos[key].y);
      subtitle.alpha = 0.85;
      subtitle.visible = false;

      this.subtitleEl.addChild(subtitle);
    });

    this.subtitleEl.scale.set(2, 2);
  }

  private playHitEffectPerfect(): void {
    const starContainer = new PIXI.Container();
    const containerSize = 78;
    const centerPoint   = containerSize / 2;

    starContainer.width = starContainer.height = containerSize;
    starContainer.pivot.set(centerPoint, centerPoint);
    starContainer.position.set(294, 548);

    let idx = 0;
    let len = this.starList.length;

    for (; len; ++idx, --len) {
      const star = this.starList[idx];
      const name = `star_${idx + 1}`;
      const posX = FxStarPos[name].x + star.width/2;
      const posY = FxStarPos[name].y + star.height/2;

      star.anchor.set(0.5, 0.5);
      star.position.set(posX, posY);
      starContainer.addChild(star);

      const targetX = posX - centerPoint;
      const targetY = posY - centerPoint;

      gsap.fromTo(star, {
        pixi: {
          x: posX,
          y: posY,
          rotation: 0,
        }
      }, {
        ease: "easeOutExpo",
        duration: utils.msec2sec(330),
        pixi: {
          x: `+=${targetX}`,
          y: `+=${targetY}`,
          rotation: 30,
        },
      });
    }

    starContainer.name = "fx_great";
    starContainer.scale.set(0.2, 0.2);
    this.container.addChildAt(starContainer, 1);

    gsap.to(starContainer, {
      ease: "easeOutExpo",
      duration: utils.msec2sec(330),
      pixi: {
        scale: 2,
        rotation: 30,
      },
      onComplete: () => {
        starContainer.destroy();
      }
    });
  }

  private playHitEffectGreat(): void {
    const starContainer = new PIXI.Container();
    const containerSize = 78;
    const centerPoint   = containerSize / 2;

    starContainer.width = starContainer.height = containerSize;
    starContainer.pivot.set(centerPoint, centerPoint);
    starContainer.position.set(294, 548);

    let idx = 0;
    let len = this.starList.length;

    for (; len; ++idx, --len) {
      const star = this.starList[idx];
      const name = `star_${idx + 1}`;

      star.anchor.set(0.5, 0.5);
      star.position.set(FxStarPos[name].x + star.width/2, FxStarPos[name].y + star.height/2);
      starContainer.addChild(star);

      gsap.fromTo(star, {
        pixi: { rotation: 0 }
      }, {
        ease: "easeOutExpo",
        duration: utils.msec2sec(330),
        pixi: { rotation: 15 },
      });
    }

    starContainer.name = "fx_great";
    starContainer.scale.set(0.2, 0.2);
    this.container.addChildAt(starContainer, 1);

    gsap.to(starContainer, {
      ease: "easeOutExpo",
      duration: utils.msec2sec(330),
      pixi: {
        scale: 1.5,
        rotation: 15,
      },
      onComplete: () => {
        starContainer.destroy();
      }
    });
  }

  private initLayout(): void {
    const spriteSheetDom = this.assetData.load("spriteSheetDom").spritesheet.textures;

    utils.setBgColor(this.game.renderer, conf.color.yellow);

    this.rect.cover.interactive = this.rect.cover.buttonMode = true;
    this.rect.cover.addListener("pointerdown", this.judgeTiming, this);

    this.animSprites.wait.visible = true;
    this.animSprites.wait.play();
    this.currentAnim = this.animSprites.wait;

    this.el.pauseBtn = utils.createSprite(this.textures["btn_pause"]);
    this.el.pauseBtn.buttonMode = this.el.pauseBtn.interactive = true;
    this.el.pauseBtn.scale.set(2, 2);
    this.el.pauseBtn.position.set(30, 50);

    this.el.pauseBtn.addListener("pointerdown", this.enablePause, this);

    this.el.volumeToggleBtn = utils.createSprite(spriteSheetDom["btn_sound_toggle_on"]);
    this.el.volumeToggleBtn.buttonMode = this.el.volumeToggleBtn.interactive = true;
    this.el.volumeToggleBtn.scale.set(2, 2);
    this.el.volumeToggleBtn.position.set(82, 52);

    this.el.youtubeBg = utils.createSprite(this.animParts["bg_youtube"]);
    this.el.youtubeBg.scale.set(2, 2);
    this.el.youtubeBg.position.set(280, 48);

    this.initNorikan();
    this.initSubtitle();

    this.el.feverBg = utils.createSprite(this.animParts["bg_fever_1"]);
    this.el.feverBg.scale.set(4, 4);
    this.el.feverBg.visible = false;

    this.container.addChild(
      this.el.feverBg,
      this.animSprites.wait,
      this.animSprites.punch_l,
      this.animSprites.punch_r,
      this.el.youtubeBg,
      this.rect.cover,
      this.el.pauseBtn,
      this.el.volumeToggleBtn,
      this.norikanEl,
      this.subtitleEl,
    );
  }

  private enablePause(): void {
    if (this.isPaused) {
      return;
    }

    this.game.ticker.stop();
    utils.appendDom("yt-overlay", conf.canvas_el);
    conf.root_el.classList.add("is-paused");
    this.el.txtPause  = utils.createSprite(this.textures["txt_pause"]);
    this.rect.overlay = utils.createRect("overlay", conf.canvas_width, conf.canvas_height, 0x222222, 0.75);
    this.rect.overlay.interactive = this.rect.overlay.buttonMode = true;

    this.el.txtPause.pivot.set(this.el.txtPause.width / 2, this.el.txtPause.height / 2);
    this.el.txtPause.position.set(utils.display.centerX, utils.display.centerY);
    this.rect.overlay.addChild(this.el.txtPause);
    this.container.addChild(this.rect.overlay);
    
    this.isPaused = true;
    this.player.pauseVideo();
    this.rect.cover.removeListener("pointerdown", this.judgeTiming, this);
    this.rect.overlay.addListener("pointerdown", this.disablePause, this);
    this.game.renderer.render(this.game.stage);
  }

  private disablePause(): void {
    this.isPaused = false;
    utils.removeDom("yt-overlay", conf.canvas_el);
    conf.root_el.classList.remove("is-paused");
    this.sound.play("se", "cancel");
    this.player.playVideo();
    this.rect.overlay.destroy();
    this.game.ticker.start();
    this.rect.cover.addListener("pointerdown", this.judgeTiming, this);
  }

  private setYoutubeParam(): void {
    this.startTime   = performance.now();
    this.elapsedTime = 0;
    this.currentTime = utils.sec2msec(this.model.ytOptions["playerVars"]["start"]);
    this.lastTime    = 0;
    this.loopTimer   = 0;
    this.interval    = 3000;
  }

  private playAnim(name: string, callback?: any): void {
    this.currentAnim.visible = false;
    this.currentAnim.stop();

    this.animSprites[name].visible = true;
    this.animSprites[name].gotoAndPlay(0);

    this.currentAnim = this.animSprites[name];

    if (callback) {
      this.currentAnim.onComplete = () => {
        callback();
      };
    }
    else {
      this.currentAnim.onComplete = () => {
        this.currentAnim.visible = false;
        this.currentAnim.stop();
        
        this.animSprites.wait.visible = true;
        this.animSprites.wait.play();

        this.currentAnim = this.animSprites.wait;
      };
    }
  }

  private playGaya(): void {
    const approximate = utils.getApproximate(this.gayaTimes, this.currentTime);
    const index       = this.gayaTimes.indexOf(approximate);
    const gayaData    = this.gayaDatas[index];
    
    if (approximate >= this.currentTime ||
        this.prevGaya === approximate) {
      return;
    }

    const acts = gayaData.act.split(",");
    let   idx  = 0;
    let   len  = acts.length;

    for (; len; ++idx, --len) {
      const act  = acts[idx];
      const gaya = this.subtitle[act];

      gaya.visible = true;
      setTimeout(() => gaya.visible = false, gayaData.duration);
    }

    this.prevGaya = approximate;
  }

  private spawnNote(): void {
    const approximate = utils.getApproximate(this.spawnTimes, this.currentTime);
    const index       = this.spawnTimes.indexOf(approximate);
    const noteData    = this.noteDatas[index];

    if (approximate >= this.currentTime ||
        this.prevSpawn === approximate) {
      return;
    }

    const ball = utils.createSprite(this.animParts[`anim_note_${noteData.note_obj}`]);

    ball.position.set(450, 900);
    ball.scale.set(5, 5);
    this.container.addChild(ball);

    const noteDuration = noteData.note_duration;
    const timeline = gsap.timeline({
      // ease: "linear",
      onComplete: () => {
        this.norikanEl.emit("reset");
        ball.destroy();
      }
    });

    noteData.instance = timeline;
    noteData.note_sprite = ball;

    timeline.to(ball, {
      duration: utils.msec2sec(noteDuration),
      ease: "linear",
      motionPath: [
        {"x":550,"y":950},{"x":483.3333333333333,"y":550},{"x":391.66666666666663,"y":408.3333333333333},{"x":275,"y":525}
      ],
      pixi: { scale: 1 },
    });
    timeline.to(ball, {
      duration: utils.msec2sec(100),
      ease: "easeOutExpo",
      motionPath: [
        {"x":275,"y":525},{"x":258.3333333333333,"y":541.6666666666666},{"x":241.66666666666666,"y":575},{"x":225,"y":625}
      ],
      pixi: { scale: 0.8 }
    });

    ball.once("perfect", () => {
      gsap.fromTo(ball, 
      {
        x: 275,
        y: 525,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        motionPath: [
          {"x":275,"y":525},{"x":458.33333333333326,"y":458.3333333333333},{"x":600,"y":375},{"x":700,"y":275}
        ],
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("great", () => {
      gsap.fromTo(ball, {
        x: 275,
        y: 525,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        motionPath: [
          {"x":275,"y":525},{"x":391.66666666666663,"y":458.3333333333333},{"x":533.3333333333333,"y":408.3333333333333},{"x":700,"y":375}
        ],
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("good", () => {
      gsap.fromTo(ball, {
        x: 275,
        y: 525,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        motionPath: [
          {"x":275,"y":525},{"x":325,"y":491.66666666666663},{"x":466.66666666666663,"y":474.99999999999994},{"x":700,"y":475}
        ],
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("bad", () => {
      gsap.fromTo(ball, {
        x: 275,
        y: 525,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(320),
        ease: "linear",
        motionPath: [
          {"x":275,"y":525},{"x":308.3333333333333,"y":508.3333333333333},{"x":333.3333333333333,"y":541.6666666666666},{"x":350,"y":625}
        ],
        onComplete: () => { ball.destroy() }
      });
    });

    if (noteData.note_spawn_se) {
      this.sound.se[noteData.note_spawn_se].play();
    }
    
    this.prevSpawn = approximate;
  }

  private updateNorikan(norikan: number): void {
    const len = this.norikanEl.children.length-1;

    switch (norikan) {
      case 0:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;
          (el as PIXI.Sprite).texture = this.textures["icon_nori_1"];
        });
        this.isFever = false;
        this.disableFeverBg();
        break;
      case 1:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;

          if (index < 1) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_2"];
          }
        });
        break;
      case 2:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;

          if (index < 2) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_2"];
          }
        });
        break;
      case 3:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;

          if (index < 2) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_3"];
          }
          else if (index < 3) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_4"];
          }
        });
        this.isFever = true;
        this.enableFeverBg();
        break;
      case 4:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;

          if (index < 2) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_3"];
          }
          else if (index < 4) {
            (el as PIXI.Sprite).texture = this.textures["icon_nori_4"];
          }
        });
        break;
      case 5:
        this.norikanEl.children.forEach((el, index) => {
          if (len === index) return;

          (el as PIXI.Sprite).texture = this.textures["icon_nori_5"];
        });
        break;
      default:
        break;
    }

  }

  private judgeTiming(): void {
    const approximate = utils.getApproximate(this.judgeTimes, this.currentTime);
    const index       = this.judgeTimes.indexOf(approximate);
    const absDiff     = Math.abs(approximate - this.currentTime);
    const actData     = this.actDatas[index];
    const noteData    = this.noteDatas[index];

    if (absDiff > this.model.judgeTiming.bad ||
        this.prevJudge === approximate) {
      this.sound.se.swing.play();
      this.playAnim("punch_l");
      return;
    }

    const act  = this.isFever ? actData.act_fever : actData.act;
    const note = noteData.instance;
    const ball = noteData.note_sprite;

    this.playAnim(act);
    note.pause();

    // Perfect
    if (absDiff <= this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      ball.emit("perfect");
      this.playHitEffectPerfect();
      this.norikanEl.emit("increment");
      this.rawScore += this.model.scoreTable.perfect;
      this.resultTable[approximate] = Result.ok;
      console.log(`perfect, currentScore : ${this.currentScore}`);
    }
    // Great
    else if (absDiff <= this.model.judgeTiming.great &&
             absDiff > this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      ball.emit("great");
      this.playHitEffectGreat();
      this.norikanEl.emit("increment");

      this.rawScore += this.model.scoreTable.great;
      this.resultTable[approximate] = Result.ok;
      console.log(`great, currentScore : ${this.currentScore}`);
    }
    // Good
    else if (absDiff <= this.model.judgeTiming.good &&
             absDiff > this.model.judgeTiming.great) {
      this.sound.se.hit.play();
      ball.emit("good");
      this.norikanEl.emit("increment");
      this.rawScore += this.model.scoreTable.good;
      this.resultTable[approximate] = Result.ok;
      console.log(`good, currentScore : ${this.currentScore}`);
    }
    // Bad
    else if (absDiff <= this.model.judgeTiming.bad &&
             absDiff > this.model.judgeTiming.good) {
      this.sound.se.miss.play();
      ball.emit("bad");
      this.norikanEl.emit("reset");
      this.rawScore += this.model.scoreTable.bad;
      this.resultTable[approximate] = Result.ng;
      console.log(`bad, currentScore : ${this.currentScore}`);
    }

    this.prevJudge = approximate;
  }

  private handleStateChange(event: CustomEvent): void {
    const state = event["data"];
    const nextSceneName = this.userData.load("next_scene_name");

    switch (state) {
      case YT_STATE.UNSTARTED:
        break;
      case YT_STATE.ENDED:
        this.game.ticker.stop();
        this.syncCurrentTime();
        this.userData.save("latest_score", this.currentScore);

        conf.root_el.classList.add("yt-loaded");
        document.removeEventListener("visibilitychange", this.game.events.enablePause, false);
        this.player.destroy();
        this.game.currentScene.destroy();
        this.destroy();
        this.game.route(nextSceneName);
        break;
      case YT_STATE.PLAYING:
        if (!this.game.ticker.started) {
          this.game.ticker.start();
        }
        this.syncCurrentTime();
        this.isLoaded = true;
        break;
      case YT_STATE.PAUSED:
        // this.game.ticker.stop();
        this.syncCurrentTime();
        break;
      case YT_STATE.BUFFERING:
        break;
      case YT_STATE.CUED:
        break;
      default:
        break;
    }

    this.playerState = state;
  }

  private fadeVolume(from: number, to: number, duration: number) {
    const isFadeIn = (from === 0 && to === 100);
    const addValue = isFadeIn ? 20 : -20;
    const interval = duration / (100 / Math.abs(addValue));

    let lastVol = from;
    let timerId = setInterval(async () => {
      lastVol += addValue;
      this.player.setVolume(lastVol);

      if (isFadeIn && lastVol >= to ||
         !isFadeIn && lastVol <= to) {
        clearInterval(timerId);
      }
    }, interval);
  }

  public onUpdate(delta: number): void {
    if (!this.isLoaded) {
      return this.game.renderer.render(this.game.stage);
    }
    else if (this.playerState === YT_STATE.PLAYING &&
             this.currentTime >= 15600 && this.currentTime < 102600) {
      this.game.eventHandler.emit("fadeIn");
    }
    else if (this.playerState === YT_STATE.PLAYING &&
             this.currentTime >= 102600) {
      this.game.eventHandler.emit("fadeOut");
    }

    const now = performance.now();
    this.elapsedTime = now - this.startTime;
    
    if (this.isLoaded) {
      const diff = this.elapsedTime - (this.lastTime - this.startTime);
      this.currentTime += diff;
      this.loopTimer   += diff;
    }

    if (this.loopTimer >= this.interval) {
      this.syncCurrentTime();
      this.loopTimer = 0;
    }
    this.playGaya();
    this.spawnNote();

    this.lastTime = now;
    this.game.renderer.render(this.game.stage);
  }
}

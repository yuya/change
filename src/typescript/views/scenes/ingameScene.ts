import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import YTPlayer from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { BeyooOoondsModel } from "models/ingame/beyooooondsModel";
import { Scene } from "views";
import { Intro } from "views/ingame/beyooooonds/intro";
import { TitleScene } from "./titleScene";

const YT_STATE = {
  UNSTARTED : -1,
  ENDED     :  0,
  PLAYING   :  1,
  PAUSED    :  2,
  BUFFERING :  3,
  CUED      :  5,
} as const;
type YT_STATE = typeof YT_STATE[keyof typeof YT_STATE];

type AnimSprites = {
  wait    : PIXI.AnimatedSprite,
  punch_l : PIXI.AnimatedSprite,
  punch_r : PIXI.AnimatedSprite,
};

type ActData = {
  judge_time     : number,
  act_type       : string,
  act_fever_type : string,
  act_a_duration : number,
  act_ok_type    : string,
  act_ng_type    : string,
  act_ska_type   : string,
  act_se         : string,
  act_fever_se   : string,
  act_ok_se      : string,
  act_ng_se      : string,
  act_ska_se     : string,
  fx_ok          : string,
  fx_fever_ok    : string,
  bg_type        : string,
  bg_fever_type  : string,
  bg_fever_se    : string,
  bg_unfever_se  : string,
};

type NoteData = {
  instance      : GSAPTimeline,
  note_object   : PIXI.Sprite,
  note_time     : number,
  note_type     : string,
  note_duration : number,
  note_se       : string,
  note_ok_se    : string,
  note_ng_se    : string,
  note_ska_se   : string,
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
  private textures    : any;
  private intro       : Intro;
  private player      : YouTubePlayer;
  private model       : BeyooOoondsModel;
  private judgeTimes  : number[];
  private spawnTimes  : number[];
  private actDatas    : ActData[];
  private noteDatas   : NoteData[];
  private resultTable : ResultTable;
  private prevJudge   : number;
  private prevSpawn   : number;
  private rawScore    : number;
  private isLoaded    : boolean;
  private isPaused    : boolean;
  private norikan     : number;
  private norikanEl   : PIXI.Container;
  private playerState : number;
  private startTime   : number;
  private elapsedTime : number;
  private currentTime : number;
  private lastTime    : number;
  private loopTimer   : number;
  private interval    : number;
  private ytOptions   : object;
  private animParts   : any;
  private animSprites : AnimSprites;
  private currentAnim : PIXI.AnimatedSprite;

  public constructor() {
    super();

    this.model       = new BeyooOoondsModel();
    this.textures    = this.assetData.load("textures");
    this.judgeTimes  = [];
    this.spawnTimes  = [];
    this.actDatas    = [];
    this.noteDatas   = [];
    this.resultTable = {};
    this.isLoaded    = false;
    this.isPaused    = false;
    this.rawScore    = 0;
    this.norikan     = 0;
    this.rect.cover  = utils.createRect(conf.canvas_width, conf.canvas_height);
    this.animParts   = this.assetData.load("animation").spritesheet.textures;

    this.game.events["enablePause"] = this.enablePause.bind(this);
    
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
      const judgeTime : number = item["judge_time"];
      const spawnTime : number = item["note_time"];

      this.judgeTimes.push(judgeTime);
      this.spawnTimes.push(spawnTime);

      this.actDatas.push({
        judge_time     : item["judge_time"],
        act_type       : item["act_type"],
        act_fever_type : item["act_fever_type"],
        act_a_duration : item["act_a_duration"],
        act_ok_type    : item["act_ok_type"],
        act_ng_type    : item["act_ng_type"],
        act_ska_type   : item["act_ska_type"],
        act_se         : item["act_se"],
        act_fever_se   : item["act_fever_se"],
        act_ok_se      : item["act_ok_se"],
        act_ng_se      : item["act_ng_se"],
        act_ska_se     : item["act_ska_se"],
        fx_ok          : item["fx_ok"],
        fx_fever_ok    : item["fx_fever_ok"],
        bg_type        : item["bg_type"],
        bg_fever_type  : item["bg_fever_type"],
        bg_fever_se    : item["bg_fever_se"],
        bg_unfever_se  : item["bg_unfever_se"],
      });

      this.noteDatas.push({
        instance      : null,
        note_object   : null,
        note_time     : item["note_time"],
        note_type     : item["note_type"],
        note_duration : item["note_duration"],
        note_se       : item["note_se"],
        note_ok_se    : item["note_ok_se"],
        note_ng_se    : item["note_ng_se"],
        note_ska_se   : item["note_ska_se"],
      });
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
      conf.root_el.classList.toggle("yt-loaded");
      this.setYoutubeParam();
      this.initLayout();
      this.game.ticker.start();
    });

    this.game.eventHandler.once("fadeIn", () => {
      this.fadeVolume(0, 100, 300);
    });

    this.game.eventHandler.once("fadeOut", () => {
      const nextSceneName = this.userData.load("nextSceneName");

      this.fadeVolume(100, 0, 300);
      this.fadeScreen(0, 1, 300, () => {
        this.game.ticker.stop();
        this.syncCurrentTime();
        this.userData.save("latest_score", this.currentScore);

        conf.root_el.classList.toggle("yt-loaded");
        document.removeEventListener("visibilitychange", this.game.events.enablePause, false);
        this.player.destroy();
        this.disableFeverBg();
        utils.setBgColor(this.game.renderer, conf.color.gray);
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
      console.log(textureName);

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
    this.el.pauseBtn.position.set(30, 30);

    this.el.pauseBtn.addListener("pointerdown", this.enablePause, this);

    this.el.volumeToggleBtn = utils.createSprite(spriteSheetDom["btn_sound_toggle_on"]);
    this.el.volumeToggleBtn.buttonMode = this.el.volumeToggleBtn.interactive = true;
    this.el.volumeToggleBtn.scale.set(2, 2);
    this.el.volumeToggleBtn.position.set(82, 32);

    this.el.youtubeBg = utils.createSprite(this.animParts["bg_youtube"]);
    this.el.youtubeBg.scale.set(2, 2);
    this.el.youtubeBg.position.set(280, 28);

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
    this.el.norikan_label.position.set(2, 100);

    this.norikanEl.pivot.set(this.norikanEl.width, 0);
    this.norikanEl.scale.set(2, 2);
    this.norikanEl.position.set(conf.canvas_width - 30, 30);

    this.norikanEl.on("increment", () => {
      this.norikan++;
      this.updateNorikan(this.norikan);
    });

    this.norikanEl.on("reset", () => {
      this.norikan = 0;
      this.updateNorikan(this.norikan);
    });

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
    );
  }

  private enablePause(): void {
    if (this.isPaused) {
      return;
    }

    this.game.ticker.stop();
    utils.appendDom("yt-overlay", conf.canvas_el);
    conf.root_el.classList.toggle("is-paused");
    this.el.txtPause  = utils.createSprite(this.textures["txt_pause"]);
    this.rect.overlay = utils.createRect(conf.canvas_width, conf.canvas_height, 0x222222, 0.75);
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
    conf.root_el.classList.toggle("is-paused");
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

  private spawnNote(): void {
    const approximate = utils.getApproximate(this.spawnTimes, this.currentTime);
    const index       = this.spawnTimes.indexOf(approximate);
    const noteData    = this.noteDatas[index];

    // TODO: DEBUG
    if (approximate >= this.currentTime ||
        this.prevSpawn === approximate) {
      return;
    }

    const ball = utils.createSprite(this.animParts[`anim_note_${noteData.note_type}`]);
    // ball.position.set(conf.canvas_width, conf.canvas_height);
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
    noteData.note_object = ball;

    timeline.to(ball, {
      // duration: utils.msec2sec(noteDuration),
      duration: utils.msec2sec(noteDuration),
      ease: "linear",
      motionPath: [
        {"x":550,"y":950},{"x":483.3333333333333,"y":550},{"x":391.66666666666663,"y":408.3333333333333},{"x":275,"y":525}
      ],
        // [{"x":550,"y":950},{"x":483.3333333333333,"y":550},{"x":375,"y":408.3333333333333},{"x":225,"y":525}]
        // {"x":450,"y":900},
        // {"x":316.66666666666663,"y":333.3333333333333},
        // {"x":216.66666666666666,"y":200},
        // {"x":160,"y":370}
        // {"x":150,"y":500}
      // ],
      pixi: { scale: 1 },
    });
    timeline.to(ball, {
      duration: utils.msec2sec(100),
      ease: "easeOutExpo",
      motionPath: [
        // {"x":160,"y":370},
        {"x":275,"y":525},{"x":258.3333333333333,"y":541.6666666666666},{"x":241.66666666666666,"y":575},{"x":225,"y":625}
        // {"x":225,"y":525},{"x":208.33333333333331,"y":541.6666666666666},{"x":191.66666666666663,"y":575},{"x":175,"y":625}
        // {"x":150,"y":500},
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
          // {"x":225,"y":525},{"x":258.3333333333333,"y":408.3333333333333},{"x":416.66666666666663,"y":325},{"x":700,"y":275}
        ],
        // x: 640,
        // y: 120,
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
          // {"x":225,"y":525},{"x":258.3333333333333,"y":441.66666666666663},{"x":416.66666666666663,"y":391.66666666666663},{"x":700,"y":375}
        ],
        // x: 640,
        // y: 240,
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
          // {"x":225,"y":525},{"x":275,"y":491.66666666666663},{"x":433.3333333333333,"y":474.99999999999994},{"x":700,"y":475}
        ],
        // x: 512,
        // y: 320,
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
          // {"x":225,"y":525},{"x":291.66666666666663,"y":508.3333333333333},{"x":316.66666666666663,"y":541.6666666666666},{"x":300,"y":625}
        ],
        // x: 320,
        // y: 512,
        onComplete: () => { ball.destroy() }
      });
    });

    if (noteData.note_se) {
      this.sound.se[noteData.note_se].play();
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
      this.sound.se.suburi.play();
      this.playAnim("punch_l");
      return;
    }

    const act  = actData.act_type;
    const note = noteData.instance;
    const ball = noteData.note_object;

    this.playAnim(act);
    note.pause();

    // Perfect
    if (absDiff <= this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      ball.emit("perfect");
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
    const nextSceneName = this.userData.load("nextSceneName");

    switch (state) {
      case YT_STATE.UNSTARTED:
        break;
      case YT_STATE.ENDED:
        this.game.ticker.stop();
        this.syncCurrentTime();
        this.userData.save("latest_score", this.currentScore);

        conf.root_el.classList.toggle("yt-loaded");
        document.removeEventListener("visibilitychange", this.game.events.enablePause, false);
        this.player.destroy();
        this.game.currentScene.destroy();
        this.game.route(nextSceneName);
        break;
      case YT_STATE.PLAYING:
        if (!this.game.ticker.started) {
          this.game.ticker.start();
        }
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

    const diff = this.elapsedTime - (this.lastTime - this.startTime);
    this.currentTime += diff;
    this.loopTimer   += diff;

    if (this.loopTimer >= this.interval) {
      this.syncCurrentTime();
      this.loopTimer = 0;
    }
    this.spawnNote();

    this.lastTime = now;
    this.game.renderer.render(this.game.stage);
  }
}

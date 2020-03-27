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

type AnimSprites = {
  wait    : PIXI.AnimatedSprite,
  punch_l : PIXI.AnimatedSprite,
  punch_r : PIXI.AnimatedSprite,
};

type ActTable = {
  [key : number] : {
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
  }
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

type NoteTable = {
  [key : number] : {
    note_type     : string,
    note_duration : number,
    note_se       : string,
    note_ok_se    : string,
    note_ng_se    : string,
    note_ska_se   : string,
  }
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
  private actTable    : ActTable;
  private noteTable   : NoteTable;
  private actDatas    : ActData[];
  private noteDatas   : NoteData[];
  private resultTable : ResultTable;
  private prevJudge   : number;
  private prevSpawn   : number;
  private rawScore    : number;
  private isLoaded    : boolean;
  private isPaused    : boolean;
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
    this.actTable    = {};
    this.noteTable   = {};
    this.actDatas    = [];
    this.noteDatas   = [];
    this.resultTable = {};
    this.isLoaded    = false;
    this.isPaused    = false;
    this.rawScore    = 0;
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

      this.actTable[judgeTime] = {
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
      };
      this.noteTable[spawnTime] = {
        note_type     : item["note_type"],
        note_duration : item["note_duration"],
        note_se       : item["note_se"],
        note_ok_se    : item["note_ok_se"],
        note_ng_se    : item["note_ng_se"],
        note_ska_se   : item["note_ska_se"],
      };

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
    animSprite.pivot.set(0, animSprite.height / 2);
    animSprite.scale.set(2, 2);
    animSprite.position.set(16, utils.display.centerY);

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
    this.rect.cover.interactive = this.rect.cover.buttonMode = true;
    this.rect.cover.addListener("pointerdown", this.judgeTiming, this);

    this.animSprites.wait.visible = true;
    this.animSprites.wait.play();
    this.currentAnim = this.animSprites.wait;

    this.el.pauseBtn = utils.createSprite(this.textures["btn_pause"]);
    this.el.pauseBtn.buttonMode = this.el.pauseBtn.interactive = true;
    this.el.pauseBtn.position.set(20, 20);

    this.el.pauseBtn.addListener("pointerdown", this.enablePause, this);

    this.container.addChild(
      this.animSprites.wait,
      this.animSprites.punch_l,
      this.animSprites.punch_r,
      this.rect.cover,
      this.el.pauseBtn,
    );
  }

  private enablePause(): void {
    if (this.isPaused) {
      return;
    }

    this.game.ticker.stop();
    utils.appendDom("yt-overlay");
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
    utils.removeDom("yt-overlay");
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
        {"x":450,"y":900},
        {"x":316.66666666666663,"y":333.3333333333333},
        {"x":216.66666666666666,"y":200},
        {"x":160,"y":370}
        // {"x":150,"y":500}
      ],
      pixi: { scale: 1 },
    });
    timeline.to(ball, {
      duration: utils.msec2sec(100),
      ease: "easeOutExpo",
      motionPath: [
        // {"x":160,"y":370},
        {"x":150,"y":500},
      ],
      pixi: { scale: 0.8 }
    });

    ball.once("perfect", () => {
      gsap.fromTo(ball, {
        x: 160,
        y: 370,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        x: 640,
        y: 120,
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("great", () => {
      gsap.fromTo(ball, {
        x: 150,
        y: 400,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        x: 640,
        y: 240,
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("good", () => {
      gsap.fromTo(ball, {
        x: 170,
        y: 340,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(256),
        ease: "linear",
        x: 512,
        y: 320,
        onComplete: () => { ball.destroy() }
      });
    });

    ball.once("bad", () => {
      gsap.fromTo(ball, {
        x: 160,
        y: 370,
        pixi: { scale: 1 }
      }, {
        duration: utils.msec2sec(320),
        ease: "linear",
        x: 320,
        y: 512,
        onComplete: () => { ball.destroy() }
      });
    });

    if (this.noteTable[approximate].note_se) {
      this.sound.se[this.noteTable[approximate].note_se].play();
    }
    
    this.prevSpawn = approximate;
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

    // const act = this.playAnim(this.actTable[approximate].act_type);
    
    const act  = actData.act_type;
    const note = noteData.instance;
    const ball = noteData.note_object;

    this.playAnim(act);
    note.pause();

    // Perfect
    if (absDiff <= this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      ball.emit("perfect");
      this.rawScore += this.model.scoreTable.perfect;
      this.resultTable[approximate] = Result.ok;
      console.log(`perfect, currentScore : ${this.currentScore}`);
    }
    // Great
    else if (absDiff <= this.model.judgeTiming.great &&
             absDiff > this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      ball.emit("great");
      this.rawScore += this.model.scoreTable.great;
      this.resultTable[approximate] = Result.ok;
      console.log(`great, currentScore : ${this.currentScore}`);
    }
    // Good
    else if (absDiff <= this.model.judgeTiming.good &&
             absDiff > this.model.judgeTiming.great) {
      this.sound.se.hit.play();
      ball.emit("good");
      this.rawScore += this.model.scoreTable.good;
      this.resultTable[approximate] = Result.ok;
      console.log(`good, currentScore : ${this.currentScore}`);
    }
    // Bad
    else if (absDiff <= this.model.judgeTiming.bad &&
             absDiff > this.model.judgeTiming.good) {
      this.sound.se.miss.play();
      ball.emit("bad");
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

        // document.body.removeChild(document.getElementById("debug"));
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
    
    // this.updateDebug();  // TODO: DEBUG
  }
}

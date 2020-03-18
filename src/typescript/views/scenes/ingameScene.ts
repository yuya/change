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
  all     : PIXI.AnimatedSprite,
}

export class IngameScene extends Scene {
  private textures    : any;
  private intro       : Intro;
  private player      : YouTubePlayer;
  private model       : BeyooOoondsModel;
  private timingList  : number[];
  private prevTiming  : number;
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
  private animSprites : AnimSprites;
  private currentAnim : PIXI.AnimatedSprite;

  public constructor() {
    super();

    this.model       = new BeyooOoondsModel();
    this.textures    = this.assetData.load("textures");
    this.timingList  = Object.keys(this.model.ingameData).map((v) => { return +v });
    this.isLoaded    = false;
    this.isPaused    = false;
    this.rawScore    = 0;
    this.rect.cover  = utils.createRect(conf.canvas_width, conf.canvas_height);

    this.initAnimSprites();

    this.player = YTPlayer(conf.player_el, this.model.ytOptions);
    this.player.setPlaybackQuality("small");
    this.player.setVolume(0);

    this.attachEvent();
  }

  private initAnimSprites(): void {
    this.animSprites = {
      wait    : this.createAnimatedSprite("wait"),
      punch_l : this.createAnimatedSprite("punch_l"),
      punch_r : this.createAnimatedSprite("punch_r"),
      all     : this.createAnimatedSprite("all"),
    };

    this.animSprites.all.loop = true;
    this.animSprites.wait.loop = true;
  }

  private attachEvent(): void {
    this.game.renderer.view.addEventListener("introPlayed", () => {
      conf.root_el.classList.add("yt-loaded");
      this.player.unMute();
      this.player.setVolume(100);

      this.setYoutubeParam();
      this.initLayout();
      this.game.ticker.start();
    }, false);

    this.player.on("ready",       () => { this.showIntro() });
    this.player.on("stateChange", (event) => { this.handleStateChange(event) });

    document.addEventListener("visibilitychange", () => {
      console.log("fired visibilitychange");
      this.togglePause();
    }, false);
    // window.addEventListener("pagehide", () => {
    //   console.log("fired pagehide");
    //   this.togglePause();
    // }, false);
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

  // TODO: DEBUG
  private enableDebug(): void {
    const debugEl = document.createElement("div");
    const timerEl = document.createElement("p");

    debugEl.id = "debug";
    timerEl.id = "debug-timer";
    timerEl.appendChild(document.createTextNode("00:00:000"));
    
    debugEl.appendChild(timerEl);
    document.body.appendChild(debugEl);
  }

  // TODO: DEBUG
  private updateDebug(): void {
    const timerEl = document.getElementById("debug-timer");

    timerEl.innerText = this.getTimerText(this.currentTime);
  }

  // TODO: DEBUG
  private getTimerText(elapsedTime: number): string {
    let m  : string = Math.floor(elapsedTime / (1000 * 60)) + "";
    let s  : string = Math.floor(elapsedTime % (1000 * 60) / 1000) + "";
    let ms : string = Math.round(elapsedTime % 1000) + "";
  
    m  = String(m).padStart(2,  "0");
    s  = String(s).padStart(2,  "0");
    ms = String(ms).padStart(3, "0");
  
    return `${m}:${s}:${ms}`;
  }

  private initLayout(): void {
    this.rect.cover.interactive = this.rect.cover.buttonMode = true;
    this.rect.cover.addListener("pointerdown", (event) => {
      this.judgeTiming();
    }, this.rect.cover);

    this.animSprites.wait.visible = true;
    this.animSprites.wait.play();
    this.currentAnim = this.animSprites.wait;

    this.el.pauseBtn = utils.createSprite(this.textures["btn_pause.png"]);
    this.el.pauseBtn.buttonMode = this.el.pauseBtn.interactive = true;
    this.el.pauseBtn.position.set(20, 20);

    this.el.pauseBtn.addListener("pointerdown", () => {
      this.togglePause();
    });

    this.container.addChild(
      this.animSprites.wait,
      this.animSprites.punch_l,
      this.animSprites.punch_r,
      this.rect.cover,
      this.el.pauseBtn,
    );
    this.enableDebug();  // TODO: DEBUG
  }

  private togglePause(): void {
    // remove overlay
    if (this.isPaused) {
      this.isPaused = false;
      this.player.playVideo();
      this.rect.overlay.destroy();
      this.game.ticker.start();
    }
    // add overlay
    else {
      this.el.txtPause  = utils.createSprite(this.textures["txt_pause.png"]);
      this.rect.overlay = utils.createRect(conf.canvas_width, conf.canvas_height, 0x222222, 0.75);
      this.rect.overlay.interactive = this.rect.overlay.buttonMode = true;

      this.el.txtPause.pivot.set(this.el.txtPause.width / 2, this.el.txtPause.height / 2);
      this.el.txtPause.position.set(utils.display.centerX, utils.display.centerY);
      this.rect.overlay.addChild(this.el.txtPause);
      this.container.addChild(this.rect.overlay);
      
      this.isPaused = true;
      this.player.pauseVideo();
      this.rect.overlay.addListener("pointerdown", () => {
        this.togglePause();
      });
    }
  }

  private setYoutubeParam(): void {
    this.isLoaded    = true;
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

  }

  private judgeTiming(): void {
    const approximate = utils.getApproximate(this.timingList, this.currentTime);
    const absDiff     = Math.abs(approximate - this.currentTime);

    if (absDiff > this.model.judgeTiming.bad ||
        this.prevTiming === approximate) {
      this.sound.se.suburi.play();
      this.playAnim("punch_l");
      return;
    }

    this.playAnim(this.model.ingameData[approximate].act);

    // Perfect
    if (absDiff <= this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.perfect;
      console.log(`perfect, currentScore : ${this.currentScore}`);
    }
    // Great
    else if (absDiff <= this.model.judgeTiming.great &&
             absDiff > this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.great;
      console.log(`great, currentScore : ${this.currentScore}`);
    }
    // Good
    else if (absDiff <= this.model.judgeTiming.good &&
             absDiff > this.model.judgeTiming.great) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.good;
      console.log(`good, currentScore : ${this.currentScore}`);
    }
    // Bad
    else if (absDiff <= this.model.judgeTiming.bad &&
             absDiff > this.model.judgeTiming.good) {
      this.sound.se.miss.play();
      this.rawScore += this.model.scoreTable.bad;
      console.log(`bad, currentScore : ${this.currentScore}`);
    }

    this.prevTiming = approximate;
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

        document.body.removeChild(document.getElementById("debug"));
        this.player.destroy();
        this.game.currentScene.destroy();
        this.game.route(nextSceneName);
        break;
      case YT_STATE.PLAYING:
        if (!this.game.ticker.started) {
          this.game.ticker.start();
        }
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
    const obj = { vol : from };
    let lastVol = from;
      
    gsap.to(obj, {
      duration: utils.msec2sec(duration),
      vol: to,
      ease: "steps(20)",
      onUpdate: () => {
        if (lastVol == obj.vol || !obj.vol) {
          return;
        }

        this.player.setVolume(obj.vol);
        lastVol = obj.vol;
      },
      onComplete: async () => {
        const isFadeIn = (from === 0 && to === 100);

        if (isFadeIn && this.playerState !== YT_STATE.PLAYING) {
          this.player.playVideo();
        }
      }
    });
  }

  public onUpdate(delta: number): void {
    if (!this.isLoaded) {
      return this.game.renderer.render(this.game.stage);
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

    this.lastTime = now;
    this.game.renderer.render(this.game.stage);
    
    this.updateDebug();  // TODO: DEBUG
  }
}

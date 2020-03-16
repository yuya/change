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

export class IngameScene extends Scene {
  private textures    : any;
  private intro       : Intro;
  private player      : YouTubePlayer;
  private model       : BeyooOoondsModel;
  private timingList  : number[];
  private prevTiming  : number;
  private rawScore    : number;
  private isLoaded    : boolean;
  private playerState : number;
  private startTime   : number;
  private elapsedTime : number;
  private currentTime : number;
  private lastTime    : number;
  private loopTimer   : number;
  private interval    : number;
  private ytOptions   : object;

  public constructor() {
    super();

    this.model       = new BeyooOoondsModel();
    this.timingList  = Object.keys(this.model.ingameData).map((v) => { return +v });
    this.isLoaded    = false;
    this.rawScore    = 0;
    this.rect.cover  = utils.createRect(conf.canvas_width, conf.canvas_height);

    this.player = YTPlayer(conf.player_el, this.model.ytOptions);
    this.player.setPlaybackQuality("small");
    this.player.setVolume(0);

    // this.game.events["handleStateChange"] = this.handleStateChange;
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

    //   this.setYoutubeParam();
    //   this.game.ticker.start();
    //   this.player.setVolume(100);
    // });
    

    // this.rect.cover.addListener("pointerdown", (event) => {
    //   this.handleTouchEvent();
    // }, this.rect.cover);

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
    const timerEl = document.createElement("p");

    timerEl.id = "debug-timer";
    timerEl.appendChild(document.createTextNode("00:00:000"));

    document.body.appendChild(timerEl);
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

    this.container.addChild(this.rect.cover);
    this.enableDebug();  // TODO: DEBUG
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

  private initGame(): void { 
    // this.game.ticker.stop();

    this.rect.cover.addListener("pointerdown", (event) => {
      this.judgeTiming();
    }, this.rect.cover);

    this.player.on("stateChange", (event) => {
      this.handleStateChange(event);
    });

    this.container.addChild(this.rect.cover);
    this.enableDebug();  // TODO: DEBUG
    this.game.ticker.start();
  }

  private judgeTiming(): void {
    const approximate = utils.getApproximate(this.timingList, this.currentTime);
    const absDiff     = Math.abs(approximate - this.currentTime);

    if (absDiff > this.model.judgeTiming.bad ||
        this.prevTiming === approximate) {
      this.sound.se.suburi.play();
      return;
    }

    if (absDiff <= this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.perfect;
      console.log(`perfect, currentScore : ${this.currentScore}`);
    }
    else if (absDiff <= this.model.judgeTiming.great &&
             absDiff > this.model.judgeTiming.perfect) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.great;
      console.log(`great, currentScore : ${this.currentScore}`);
    }
    else if (absDiff <= this.model.judgeTiming.good &&
             absDiff > this.model.judgeTiming.great) {
      this.sound.se.hit.play();
      this.rawScore += this.model.scoreTable.good;
      console.log(`good, currentScore : ${this.currentScore}`);
    }
    else if (absDiff <= this.model.judgeTiming.bad &&
             absDiff > this.model.judgeTiming.good) {
      this.sound.se.miss.play();
      this.rawScore += this.model.scoreTable.bad;
      console.log(`bad, currentScore : ${this.currentScore}`);
    }
    else {
      this.sound.se.suburi.play();
    }

    this.prevTiming = approximate;
    // this.timingList.shift();
  }

  private handleStateChange(event: CustomEvent): void {
    const state = event["data"];
    console.log(state);

    switch (state) {
      case YT_STATE.UNSTARTED:
        break;
      case YT_STATE.ENDED:
        this.game.ticker.stop();
        this.syncCurrentTime();
        break;
      case YT_STATE.PLAYING:
        if (!this.game.ticker.started) {
          this.game.ticker.start();
        }
        break;
      case YT_STATE.PAUSED:
        this.game.ticker.stop();
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

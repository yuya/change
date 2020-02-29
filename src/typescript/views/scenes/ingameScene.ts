import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import YTPlayer from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { BeyooOoondsModel } from "models/ingame/beyooooondsModel";
import { Scene } from "views";
import { Intro } from "views/ingame/beyooooonds/intro";

// const YT = (window as any).YT;
const YT_STATE = {
  "UNSTARTED" : -1,
  "ENDED"     :  0,
  "PLAYING"   :  1,
  "PAUSED"    :  2,
  "BUFFERING" :  3,
  "CUED"      :  5,
};

export class IngameScene extends Scene {
  private textures    : any;
  private intro       : Intro;
  private player      : YouTubePlayer;
  private model       : BeyooOoondsModel;
  private timingList  : number[];
  private isLoaded    : boolean;
  private playerState : number;
  private startTime   : number;
  private elapsedTime : number;
  private currentTime : number;
  private lastTime    : number;
  private loopTimer   : number;
  private interval    : number;
  private ytOptions   : object;
  // private updateQueue : any[];
  
  public constructor() {
    super();

    this.model       = new BeyooOoondsModel();
    this.timingList  = Object.keys(this.model.ingameData).map((v) => { return +v });
    this.isLoaded    = false;
    this.rect.cover  = utils.createRect(conf.canvas_width, conf.canvas_height);
    // this.updateQueue = [];

    this.game.events["handleStateChange"] = this.handleStateChange;

    this.game.renderer.view.addEventListener("introPlayed", () => {
      this.initGame();
    }, false);

    this.showIntro();
  }

  private showIntro(): void {
    this.intro = new Intro({});
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
    this.rect.cover.addListener("pointerdown", (event) => {
      this.handleTouchEvent();
    }, this.rect.cover);
    this.container.addChild(this.rect.cover);
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
    this.game.ticker.stop();

    this.player = YTPlayer(conf.player_el, this.model.ytOptions);
    this.player.setPlaybackQuality("small");
    this.player.setVolume(0);

    this.player.on("stateChange", (event) => {
      this.handleStateChange(event);
    });
    this.player.on("ready", () => {
      this.setYoutubeParam();
      this.initLayout();

      conf.root_el.classList.add("yt-loaded");
      this.player.playVideo();
      this.fadeVolume(0, 100, 1000);

      this.game.ticker.start();
    });
  }

  private handleTouchEvent(): void {
    const currentTime = this.currentTime;
    const timingList  = this.timingList;
    const approximate = utils.getApproximate(timingList, currentTime);
    const absDiff     = Math.abs(currentTime - approximate);

    console.log(absDiff);
    if (absDiff <= 500) {
      this.sound.se.hit.play();
    }
    else {
      this.sound.se.miss.play();
    }
  }

  private handleStateChange(event: CustomEvent): void {
    const state = event["data"];

    switch (state) {
      case YT_STATE.UNSTARTED:
        break;
      case YT_STATE.ENDED:
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
  }
}

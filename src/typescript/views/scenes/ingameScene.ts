import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import YTPlayer from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { BeyooOoondsModel } from "models/ingame/beyooooondsModel";
import { Scene } from "views";
import { Intro } from "views/ingame/beyooooonds/intro";

export class IngameScene extends Scene {
  private textures    : any;
  private intro       : Intro;
  private player      : YouTubePlayer;
  private model       : BeyooOoondsModel;
  private isLoaded    : boolean;
  private startTime   : number;
  private elapsedTime : number;
  private currentTime : number;
  private lastTime    : number;
  private loopTimer   : number;
  private interval    : number;
  private ytOptions   : object;
  
  public constructor() {
    super();

    this.model    = new BeyooOoondsModel();
    this.isLoaded = false;

    // this.game.events["initGame"] = this.initGame;
    this.game.renderer.view.addEventListener("onintroend", () => {
      this.initGame();
    }, false);

    this.showIntro();
  }

  private showIntro(): void {
    this.intro = new Intro({});
    this.container.addChild(this.intro.element);
  }

  private async syncCurrentTime(): Promise<void> {
    const time = utils.sec2msec(await this.player.getCurrentTime());

    if (time) {
      this.currentTime = time;
    }
  }

  private initGame(): void { 
    this.game.ticker.stop();

    this.player = YTPlayer(conf.player_el, this.model.ytOptions);
    this.player.setPlaybackQuality("small");
    this.player.mute();

    this.player.on("ready", () => {
      this.isLoaded    = true;
      this.startTime   = performance.now();
      this.elapsedTime = 0;
      this.currentTime = utils.sec2msec(this.model.ytOptions["playerVars"]["start"]);
      this.lastTime    = 0;
      this.loopTimer   = 0;
      this.interval    = 3000;

      conf.root_el.classList.add("yt-loaded");
      this.player.playVideo();

      this.game.ticker.start();
    });
  }

  public onUpdate(delta: number): void {
    if (this.isLoaded) {
      const now = performance.now();

      this.elapsedTime  = now - this.startTime;
      this.currentTime += this.elapsedTime - (this.lastTime - this.startTime);
      this.loopTimer   += this.elapsedTime - (this.lastTime - this.startTime);

      if (this.player && this.loopTimer >= this.interval) {
        this.syncCurrentTime();
        this.loopTimer = 0;
      }

      this.lastTime = now;   
    }

    this.game.renderer.render(this.game.stage);
  }
}

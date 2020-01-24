import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import YTPlayer from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Env } from "../../utilities/env";
import { Scene } from "../scenes/scene";

export class IntroCutscene extends Scene {
  private container: PIXI.Container;
  private ytPlayer: YouTubePlayer;
  private keyv: PIXI.Sprite;
  private jingle: Howl;
  private sprites: any;
  private jinglePlayed: boolean;
  private ticker: any;

  constructor(container: PIXI.Container, ytPlayer: YouTubePlayer) {
    super();

    this.container = container;
    this.ytPlayer  = ytPlayer;
    this.sprites   = this.loader.resources["sprites"].spritesheet.textures;
    this.keyv      = PIXI.Sprite.from(this.sprites["dna.png"]);
    this.jingle    = new Howl({ src: "assets/intro.mp3" });

    this.keyv.name = "dna";

    this.init();
  }

  private init() {
    this.keyv.anchor.set(0.5, 0.5);
    this.keyv.x = this.sceneController.app.screen.width / 2;
    this.keyv.y = this.sceneController.app.screen.height / 2;
    this.keyv.alpha = 1;

    this.container.addChild(this.keyv);
    this.sceneController.app.stage.addChild(this.container);
  }

  public play(callback: any) {
    this.jingle.once("end", () => {
      this.ticker = this.sceneController.app.ticker.add((delta: number) => {
        this.renderByFrame(delta, callback);
      });
    });

    this.jingle.play();
  }

  public renderByFrame(delta: number, callback: any): void {
    if (this.keyv.alpha <= 0) {
      callback();
      this.destroy();
    }

    this.keyv.alpha -= 0.1;
  }

  public destroy() {
    this.ticker.destroy();
    this.jingle.unload();
    this.keyv.destroy();
  }
}

import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import YTPlayer from "youtube-player";
// import { YouTubePlayer } from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Env } from "../../utilities/env";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";
import { Intro } from "../parts/intro";

const okSound: Howl = new Howl({ src: ["assets/se_ok.mp3"] });
const ngSound: Howl = new Howl({ src: ["assets/se_ng.mp3"] });

export class GameScene extends Scene {
  private logo: PIXI.Sprite;
  private player: YouTubePlayer;
  private intro: Intro;

  constructor() {
    super();

    this.intro = new Intro();
    this.intro.play();
  }

  public renderByFrame(delta: number): void {
  }
}

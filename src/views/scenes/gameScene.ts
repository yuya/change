import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import YTPlayer from "youtube-player";
// import { YouTubePlayer } from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Env } from "../../utilities/env";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";
import { IntroCutscene } from "../parts/introCutscene";
// import { Outro } from "../parts/outro";

const okSound: Howl = new Howl({ src: ["assets/se_ok.mp3"] });
const ngSound: Howl = new Howl({ src: ["assets/se_ng.mp3"] });

export class GameScene extends Scene {
  private container: PIXI.Container;
  private logo: PIXI.Sprite;
  private ytDOM: HTMLElement;
  private ytPlayer: YouTubePlayer;
  private introCutscene: IntroCutscene;
  // private outro: Outro;

  private ytPlayerOptions: object = {
    videoId: "KYVMtijS74U",
    width: 320,
    height: 180,
    playerVars: {
      "start"          : 15, // 再生開始秒数
      "controls"       : 0,  // UIを非表示にする
      "fs"             : 0,  // フルスクリーンボタンを消す
      "iv_load_policy" : 3,  // アノテーションを非表示にする
      "playsinline"    : 1,  // インライン再生
      "rel"            : 0   // 関連動画を非表示にする
    }
  };

  constructor() {
    super();

    this.container     = new PIXI.Container();
    
    this.ytPlayer      = YTPlayer("yt", this.ytPlayerOptions);
    this.introCutscene = new IntroCutscene(this.container, this.ytPlayer);

    this.container.buttonMode  = true;
    this.container.interactive = true;

    this.ytPlayer.setPlaybackQuality("small");
    this.init();
  }

  private init() {
    this.introCutscene.play();
    this.ytPlayer.on("ready", (event) => {
      this.ytDOM = document.getElementById("yt");

      this.container.addListener("pointerup", () => {
        // this.introCutscene.fadeOut();
        this.ytDOM.className = "show";
        this.ytPlayer.playVideo();
        this.introCutscene.destroy();
      });
    });

    this.ytPlayer.on("stateChange", (event) => {
      console.log("READY!!!!!");
      console.log(event);
    });
  }

  // public renderByFrame(delta: number): void {
  // }
}

import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import YTPlayer from "youtube-player";
// import { YouTubePlayer } from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

export class GameScene extends Scene {
  private logo: PIXI.Sprite;
  private player: YouTubePlayer;

  constructor() {
    super();

    this.player = YTPlayer("yt", {
      videoId: "KYVMtijS74U",
      width: 320,
      height: 180,
      playerVars: {
        "start"          : 15,
        "controls"       : 0, // UIを非表示にする
        // "disablekb"      : 0, // キーボードによる操作を不可にする
        "fs"             : 0, // フルスクリーンボタンを消す
        "iv_load_policy" : 3, // アノテーションを非表示にする
        // "modestbranding" : 1, // ロゴを非表示にする
        "playsinline"    : 1, // インライン再生
        "rel"            : 0  // 関連動画を非表示にする
      }

    });

    document.addEventListener("pointerup", () => {
      this.player.playVideo();
    }, false);
  }

  private doFunc(currentTime: number): void {
    console.log(currentTime);
  }

  public renderByFrame(delta: number): void {
    const promise: any = this.player.getCurrentTime();
    promise.then((currentTime: any) => {
      this.doFunc(currentTime);
    });
  }
}

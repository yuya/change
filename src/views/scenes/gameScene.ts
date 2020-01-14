import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import YTPlayer from "youtube-player";
// import { YouTubePlayer } from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Scene } from "./scene";
import { SceneController } from "../../controllers/sceneController";

interface GameSE {
  ok: Howl,
  ng: Howl
}

export class GameScene extends Scene {
  private logo: PIXI.Sprite;
  private player: YouTubePlayer;
  private se: GameSE = {
    ok: new Howl({ src: ["assets/se_ok.mp3"] }),
    ng: new Howl({ src: ["assets/se_ng.mp3"] })
  };
  private elapsedTime: any = 0;

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
    this.player.setPlaybackQuality("small");

    const fireEvent = (event) => {
      document.removeEventListener("pointerdown", fireEvent);
      this.player.playVideo();
      // this.registHandleSound();
      document.addEventListener("pointerdown", () => {
        this.hogeFunc();
      }, false);
    };

    document.addEventListener("pointerdown", fireEvent, false);
  }

  // private registHandleSound(): void {
  //   document.addEventListener("pointerdown", this.doFunc, false);

  // }

  // private getApproximateNumber(numberList: Array<number>, time: number): number {
  //   let diff: Array<number> = [];
  //   let idx: number = 0;
  //   let num: number;
    
  //   for (let i = 0, l = numberList.length; i < l; i++) {
  //     num = numberList[i];
  //     diff[i] = Math.abs(time - num);
  //     idx = (diff[idx] < diff[i]) ? idx : i;
  //   }

  //   return numberList[idx];
  // }

  private hogeFunc(): void {
    const getApproximateNumber = (numberList: Array<number>, time: number): number => {
      let diff: Array<number> = [];
      let idx: number = 0;
      let num: number;
      
      for (let i = 0, l = numberList.length; i < l; i++) {
        num = numberList[i];
        diff[i] = Math.abs(time - num);
        idx = (diff[idx] < diff[i]) ? idx : i;
      }

      return numberList[idx];
    };

    const timingList: Array<number> = [
      // 15.70,
      31.10,
      32.00,
      44.90,
      45.30,
      45.70,
      58.60,
      58.90,
      59.40,
      75.70,
      77.40,
      80.80,
      81.30,
      81.70,
      82.50,
      84.30,
      87.70,
      88.10,
      88.60,
      89.40,
      91.10,
      94.60,
      95.00,
      95.50,
      96.30,
      98.00,
      101.40,
      101.90,
      102.30,
      103.50
    ];
    const currentTime: any = this.player.getCurrentTime();

    currentTime.then((time: any) => {
      const approximate = getApproximateNumber(timingList, time);
      const absGap = Math.abs(time - approximate);

      // console.log(absGap);
      if (absGap <= 0.125) {
        console.log("ok: " + absGap);
        this.se.ok.play();
      }
      else {
        console.log("ng: " + absGap);
        this.se.ng.play();
      }
    });
  }

  private setCurrentTime(time: number): void {
    this.elapsedTime = time;
    console.log(this.elapsedTime);
  }

  public renderByFrame(delta: number): void {
    // const ytCurrentTime: any = this.player.getCurrentTime();

    // ytCurrentTime.then((currentTime: any) => {
    //   this.setCurrentTime(currentTime);
    //   // this.hogeFunc(currentTime);
    // });
  }
}

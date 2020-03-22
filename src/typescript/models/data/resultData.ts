import { conf } from "conf";
import { utils } from "utils";
import { Howl, Howler } from "howler";

const ResultThreshold = {
  Superb: 80,
  Ok: 60,
} as const;
type ResultThreshold = typeof ResultThreshold[keyof typeof ResultThreshold];

type Result = {
  eval: {
    from      : string,
    comment   : string,
    labelPath : string,
    sePath    : string,
    bgmPath   : string,
  },
  outro: {
    comment    : string,
    imgPath    : string,
    jinglePath : string,
  },
};

export class ResultData {
  public score : number;
  public data  : Result;

  public constructor(score: number) {
    this.score = score;
    this.data  = this.getEvalResoucesPath();
  }

  private getEvalResoucesPath(): Result {
    let ret: Result;

    // ハイスコア
    if (this.score >= ResultThreshold.Superb) {
      ret = {
        eval: {
          from: "せんちょう",
          comment: "いいね!",
          labelPath: "superb.png",
          sePath: "superb.wav",
          bgmPath: "superb_bgm.wav",
        },
        outro: {
          comment: "はっぴー",
          imgPath: "superb_outro.png",
          jinglePath: "superb_jingle.wav",
        },
      };
    }
    // 平凡
    else if (this.score >= ResultThreshold.Ok &&
             this.score < ResultThreshold.Superb) {
      ret = {
        eval: {
          from: "鯛めし食べたい",
          comment: "へいぼん",
          labelPath: "ok.png",
          sePath: "ok.wav",
          bgmPath: "ok_bgm.wav",
        },
        outro: {
          comment: "がんばらないと！",
          imgPath: "ok_outro.png",
          jinglePath: "ok_jingle.wav",
        },
      };
    }
    // やりなおし
    else {
      ret = {
        eval: {
          from: "鯛めし",
          comment: "あうと〜",
          labelPath: "try_again.png",
          sePath: "try_again.wav",
          bgmPath: "try_again_bgm.wav",
        },
        outro: {
          comment: "ぜ〜んぜんだめ",
          imgPath: "try_again_outro.png",
          jinglePath: "try_again_jingle.wav",
        },
      };
    }

    return ret;
  }
}

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
          from: "しゃちょうの おことば",
          comment: "GJ！ パンチにキレがあっていいね！",
          labelPath: "label_eval_high",
          sePath: "eval_high",
          bgmPath: "eval_high",
        },
        outro: {
          comment: "チカラをあわせて がんばろう！",
          imgPath: "superb_outro",
          jinglePath: "outro_high",
        },
      };
    }
    // 平凡
    else if (this.score >= ResultThreshold.Ok &&
             this.score < ResultThreshold.Superb) {
      ret = {
        eval: {
          from: "じょうしの ひとこと",
          comment: "とりあえず...",
          labelPath: "label_eval_mid",
          sePath: "eval_mid",
          bgmPath: "eval_mid",
        },
        outro: {
          comment: "元気だそっと！",
          imgPath: "ok_outro",
          jinglePath: "outro",
        },
      };
    }
    // やりなおし
    else {
      ret = {
        eval: {
          from: "どうりょうの ひとこと",
          comment: "ぜんぜん あってない・・・",
          labelPath: "label_eval_low",
          sePath: "eval_low",
          bgmPath: "eval_low",
        },
        outro: {
          comment: "MV 見て べんきょうだ！",
          imgPath: "try_again_outro",
          jinglePath: "outro",
        },
      };
    }

    return ret;
  }
}

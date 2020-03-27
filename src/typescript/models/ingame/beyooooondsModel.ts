import { AssetData } from "models";

type Score = {
  perfect : number,
  great   : number,
  good    : number,
  bad     : number,
};

export class BeyooOoondsModel {
  public ytOptions   : object;
  public ingameData  : object[];
  public scoreTable  : Score;
  public judgeTiming : Score;

  public constructor() {
    const assetData = AssetData.instance;

    this.ytOptions = {
      videoId    : "KYVMtijS74U",
      width      : 320,
      height     : 180,
      playerVars : {
        "start"          : 15,
        // "start"          : 100,
        "end"            : 105,
        "fs"             : 0,
        "iv_load_policy" : 3,
        "playsinline"    : 1,
        "rel"            : 0,
        "disablekb"      : 1,
        "origin"         : `${location.protocol}//${location.host}`,
        "host"           : `${location.protocol}//www.youtube.com`,
      }
    };

    this.ingameData = assetData.load("beyooOoondsData");

    this.initScoreTable();
    this.initJudgeTiming();
  }

  private initScoreTable(): void {
    const noteLen   = Object.keys(this.ingameData).length;
    const maxScore  = 100;
    const baseScore = {
      perfect : 100,
      great   :  90,
      good    :  70,
      bad     :  40,
    };

    this.scoreTable = {
      perfect : baseScore.perfect / noteLen,
      great   : baseScore.great   / noteLen,
      good    : baseScore.good    / noteLen,
      bad     : baseScore.bad     / noteLen,
    };
  }

  private initJudgeTiming(): void {
    const baseJudgeTime = {
      perfect :  33,
      great   : 150,
      good    : 350,
      bad     : 783,
    };

    this.judgeTiming = {
      perfect : baseJudgeTime.perfect / 2,
      great   : baseJudgeTime.great   / 2,
      good    : baseJudgeTime.good    / 2,
      bad     : baseJudgeTime.bad     / 2,
    };
  }

}

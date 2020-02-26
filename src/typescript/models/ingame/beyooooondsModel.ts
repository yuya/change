export class BeyooOoondsModel {
  public ytOptions : object;

  public constructor() {
    this.ytOptions = {
      videoId    : "KYVMtijS74U",
      width      : 320,
      height     : 180,
      playerVars : {
        "start"          : 15,
        "fs"             : 0,
        "iv_load_policy" : 3,
        "playsinlinefs"  : 0,
        "rel"            : 0,
        "origin"         : `${location.protocol}//${location.host}`,
        "host"           : `${location.protocol}//www.youtube.com`,
      }
    };
  }
}

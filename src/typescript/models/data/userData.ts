import { utils } from "utils";

export class UserData {
  private _userData: { [key:string] : any };

  private static _instance: UserData;
  public static get instance(): UserData {
    if (!this._instance) {
      this._instance = new UserData();
    }

    return this._instance;
  }

  public constructor() {
    this._userData = {};
  }

  public save(key: string, data: any, saveCookie?: boolean): void {
    this._userData[key] = data;

    if (!saveCookie) {
      return;
    }

    const EXPIRE_DAY = 7;
    let expireTime = new Date();

    expireTime.setTime(expireTime.getTime() + (EXPIRE_DAY * 24 * 60 * 60 * 1000));
    utils.setCookie(key, data, {
      path: "/",
      expires: expireTime,
    });
  }

  public load(key: string): any {
    let retData = this._userData[key];
    const cookieData = utils.getCookie(key);

    if (!retData && cookieData) {
      retData = cookieData;

      if (/^true$/.test(retData)) {
        retData = true;
      }
      else if (/^false$/.test(retData)) {
        retData = false;
      }

      this.save(key, cookieData);
    }

    return retData;
  }
}

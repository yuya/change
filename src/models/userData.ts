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

  public save(key: string, data: any): void {
    this._userData[key] = data;
  }

  public load(key: string): any {
    return this._userData[key];
  }
}

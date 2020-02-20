export class AssetData {
  private _assetData: { [key:string] : any };

  private static _instance: AssetData;
  public static get instance(): AssetData {
    if (!this._instance) {
      this._instance = new AssetData();
    }

    return this._instance;
  }

  public constructor() {
    this._assetData = {};
  }

  public save(key: string, data: any): void {
    this._assetData[key] = data;
  }

  public load(key: string): any {
    return this._assetData[key];
  }
}

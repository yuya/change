import * as PIXI from "pixi.js";
import { SceneController } from "../../controllers/sceneController"

export abstract class Scene extends PIXI.Container {
  protected sceneController = SceneController.instance;
  protected elapsedFrameCount: number = 0;
  protected renderObjectList: any[] = [];

  public renderByFrame(delta: number, func: void): void {
    this.elapsedFrameCount++;
    // this.doRenderFromObjList(delta, this.renderObjectList);
  }

  protected doRenderFromObjList(delta: number, objList: any[]) {
    const nextRenderObjectList = [];

    for (let i = 0, l = this.renderObjectList.length; i < l; i++) {
      const obj = this.renderObjectList[i];

      if (!obj) {
        continue;
      }

      obj.renderByFrame(delta);
      nextRenderObjectList.push(obj);
    }

    this.renderObjectList = nextRenderObjectList;
  }
  
  protected registRenderObject(obj: any): void {
    this.renderObjectList.push(obj);
  }
}

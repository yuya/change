import * as PIXI from "pixi.js";
import { conf } from "conf";
import { utils } from "utils";
import { GameController } from "controllers/gameController";

export abstract class Content {
  public element     : PIXI.Container;
  public isDestroyed : boolean;
  protected bg       : { [key : string] : PIXI.NineSlicePlane };
  protected game     : GameController;
  protected textures : any;
  protected txtStyle : { [key : string] : any };

  public constructor() {
    this.element = new PIXI.Container();
    this.element.name = "content";
    this.isDestroyed = false;

    this.bg       = {};
    this.game     = GameController.instance;
    this.textures = this.game.assetData.load("textures");

    this.txtStyle = {
      fill: utils.color.black,
      fontFamily: "Nu Kinako Mochi Ct",
      fontSize: 20,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 480
    };
    this.txtStyle.lineHeight = this.txtStyle.fontSize * 1.5;
  }

  public makeBackground(): void {
    this.bg["content"] = new PIXI.NineSlicePlane(this.textures["ui_bg_menu_blue.png"], 16, 16, 16, 16);
    this.bg["txtHead"] = new PIXI.NineSlicePlane(this.textures["ui_bg_text_slice.png"], 16, 16, 16, 16);
    this.bg["txtBody"] = new PIXI.NineSlicePlane(this.textures["ui_bg_text_slice.png"], 16, 16, 16, 16);

    this.bg.content.width  = conf.canvas_width - 40;
    this.bg.content.height = conf.canvas_height - 240;
    this.bg.content.position.set(20, 20);

    this.element.addChild(this.bg.content);

    this.bg.txtHead.width  = 320;
    this.bg.txtHead.height = 64;
    this.bg.txtHead.position.set(40, 40);

    this.bg.txtBody.width  = this.bg.content.width - 80;
    this.bg.txtBody.height = this.bg.content.height - (this.bg.txtHead.position.y + this.bg.txtHead.height + 30) - 60;
    this.bg.txtBody.position.set(40, 40+100);

    this.bg.content.addChild(this.bg.txtHead, this.bg.txtBody);
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.element.destroy({ children: true });
  }
}

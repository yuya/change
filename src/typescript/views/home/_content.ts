import * as PIXI from "pixi.js";
import { conf } from "conf";
import { utils } from "utils";
import { GameController, SoundController } from "controllers";

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
      fill: conf.color.black,
      fontFamily: conf.font.family,
      fontSize: 20,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 480
    };
    this.txtStyle.lineHeight = this.txtStyle.fontSize * 2;
  }

  public makeBackground(): void {
    const tryangle = utils.createSprite(this.textures["bg_content_tryangle_blue"]);

    this.bg["content"] = new PIXI.NineSlicePlane(this.textures["bg_content_blue"], 16, 16, 16, 16);
    this.bg["txtHead"] = new PIXI.NineSlicePlane(this.textures["bg_content_text"], 16, 16, 16, 16);
    this.bg["txtBody"] = new PIXI.NineSlicePlane(this.textures["bg_content_text"], 16, 16, 16, 16);

    this.bg.content.width  = conf.canvas_width - 40;
    this.bg.content.height = conf.canvas_height - 240;
    this.bg.content.position.set(20, 20);

    tryangle.pivot.set(tryangle.width / 2, 0);
    tryangle.position.set(utils.display.centerX, this.bg.content.height + 8);
    this.element.addChild(this.bg.content, tryangle);

    this.bg.txtHead.width  = 320;
    this.bg.txtHead.height = 64;
    this.bg.txtHead.position.set(40, 40);

    this.bg.txtBody.width  = 520;
    this.bg.txtBody.height = 548;
    this.bg.txtBody.position.set(40, 132);

    this.bg.content.addChild(this.bg.txtHead, this.bg.txtBody);
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.element.destroy({ children: true });

    const dom = document.getElementById("dom");
    if (dom) {
      conf.canvas_el.removeChild(dom);
    }
  }
}

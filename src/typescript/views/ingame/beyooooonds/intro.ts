import * as PIXI from "pixi.js";
import gsap from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { AssetData } from "models";
import { GameController, SoundController } from "controllers";

export class Intro {
  public element    : PIXI.Container;

  private assetData : AssetData;
  private game      : GameController;
  private sound     : SoundController;
  private textures  : any;
  private keyv      : PIXI.Sprite;
  private bg        : PIXI.Graphics;
  private cover     : PIXI.Graphics;

  public constructor(src: object) {
    this.element = new PIXI.Container();
    this.element.name = "intro_cutscene";

    this.game      = GameController.instance;
    this.sound     = SoundController.instance;
    this.assetData = AssetData.instance;
    this.textures  = this.assetData.load("textures");

    this.keyv  = utils.createSprite(this.textures["tmp_intro.png"]);
    this.bg    = utils.createRect(conf.canvas_width, conf.canvas_height, conf.color.black);
    this.cover = utils.createRect(conf.canvas_width, conf.canvas_height);

    utils.setNameToObj({
      "bg"    : this.bg,
      "cover" : this.cover,
    });

    this.initKeyv();
  }

  private initKeyv(): void {
    this.keyv.pivot.set(this.keyv.width / 2, this.keyv.height / 2);
    this.keyv.position.set(utils.display.centerX, utils.display.centerY);

    this.sound.play("jingle", "intro");
    this.sound.jingle.intro.on("end", () => {
      this.attachEvent();
    });

    this.element.addChild(this.bg, this.keyv, this.cover);
    this.game.ticker.start();
  }

  private attachEvent(): void {
    this.cover.interactive = this.cover.buttonMode = true;
    this.cover.addListener("pointerdown", () => {
      utils.triggerEvent(this.game.renderer.view, "introPlayed", false, false);
      this.element.destroy({ children: true });
    });
  }
}

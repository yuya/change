import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import { GameController } from "controllers/gameController";
import { UserData } from "models/userData";
import { AssetData } from "models/assetData";

export abstract class Scene extends PIXI.Container {
  protected game: GameController;
  protected el        : { [key : string] : PIXI.Sprite };
  protected se        : { [key : string] : Howl };
  protected display   : { [key : string] : any };
  protected userData  : UserData;
  protected assetData : AssetData;
  protected container : PIXI.Container;

  protected constructor() {
    super();

    this.game = GameController.instance;
    this.el   = {};
    this.se   = {};
    this.display = {
      "pos" : {
        "centerX" : this.game.renderer.width / (2 * devicePixelRatio),
        "centerY" : this.game.renderer.height / (2 * devicePixelRatio),
      }
    };

    this.userData  = UserData.instance;
    this.assetData = AssetData.instance;

    this.container      = new PIXI.Container();
    this.container.name = "container";

    this.game.stage.width  = this.game.renderer.width;
    this.game.stage.height = this.game.renderer.height;
    this.game.stage.pivot.set(0, 0);
    this.game.stage.position.set(0, 0);

    this.game.stage.addChild(this.container);
  }

  public createSprite(texture: PIXI.Texture): PIXI.Sprite {
    const sprite = PIXI.Sprite.from(texture);
    const regex  = /\.(png|jpg)$/;

    sprite.name = texture.textureCacheIds.length ?
        texture.textureCacheIds[0].replace(/\.(jpg|png)$/, "") :
        ""
    ;

    return sprite;
  }

  public createTransparentRect(width: number, height: number): PIXI.Sprite {
    const rect = new PIXI.Graphics()
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, width, height)
        .endFill()
    ;
    const texture = this.game.renderer.generateTexture(rect, 1, 1);
    const sprite  = new PIXI.Sprite(texture);

    return sprite;
  }

  public onUpdate(delta: number): void {
    this.game.renderer.render(this.game.stage);
  }

  public destroy(): void {
    this.game.ticker.stop();
    this.container.destroy({ children: true });

    this.game.renderer.render(this.game.stage);
  }
}

import * as PIXI from "pixi.js";
import { conf } from "conf";

const display = {
  centerX: conf.canvas_width / 2,
  centerY: conf.canvas_height / 2,
};

const msec2sec = (msec: number): number => {
  return msec / 1000;
};

const createRect = (width: number, height: number, color?: number): PIXI.Graphics => {
  const hasColor  = (color != null);
  const rectangle = new PIXI.Graphics()
      .beginFill(hasColor ? color: 0xffffff, hasColor ? 1 : 0)
      .drawRect(0, 0, width, height)
      .endFill()
  ;
  rectangle.hitArea = new PIXI.Rectangle(0, 0, width, height);

  return rectangle;
};

const createSprite = (texture: PIXI.Texture): PIXI.Sprite => {
  const sprite = PIXI.Sprite.from(texture);
  const regex  = /\.(png|jpg)$/;

  if (texture.textureCacheIds.length) {
    sprite.name = texture.textureCacheIds[0].replace(/\.(jpg|png)$/, "");
  }

  return sprite;
};


export const utils = {
  "display"      : display,
  "msec2sec"     : msec2sec,
  "createRect"   : createRect,
  "createSprite" : createSprite,
};

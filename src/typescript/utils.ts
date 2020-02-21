import * as PIXI from "pixi.js";
import { conf } from "conf";

const display = {
  centerX: conf.canvas_width / 2,
  centerY: conf.canvas_height / 2,
};

const color = {
  "black" : 0x222222,
  "white" : 0xFFFFFF,
};

const msec2sec = (msec: number): number => {
  return msec / 1000;
};

const sleep = (ms: number) => {
  new Promise(resolve => setTimeout(resolve, ms));
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

const setNameToObj = (obj: object): void => {
  Object.keys(obj).forEach((key) => {
    obj[key].name = key;
  });
};

export const utils = {
  "display"      : display,
  "color"        : color,
  "sleep"        : sleep,
  "msec2sec"     : msec2sec,
  "createRect"   : createRect,
  "createSprite" : createSprite,
  "setNameToObj" : setNameToObj,
};

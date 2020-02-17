import * as PIXI from "pixi.js";
import { conf } from "conf";

const renderer = new PIXI.Renderer;

const display = {
  centerX: conf.canvas_width / 2,
  centerY: conf.canvas_height / 2,
};

const msec2sec = (msec: number): number => {
  return msec / 1000;
};

const createSprite = (texture: PIXI.Texture): PIXI.Sprite => {
  const sprite = PIXI.Sprite.from(texture);
  const regex  = /\.(png|jpg)$/;

  sprite.name = texture.textureCacheIds.length ?
      texture.textureCacheIds[0].replace(/\.(jpg|png)$/, "") :
      ""
  ;

  return sprite;
};

const createTransparentRect = (width: number, height: number): PIXI.Sprite => {
  const rect = new PIXI.Graphics()
      .beginFill(0xffffff, 0)
      .drawRect(0, 0, width, height)
      .endFill()
  ;
  const texture = renderer.generateTexture(rect, 1, 1);
  const sprite  = new PIXI.Sprite(texture);

  return sprite;
};


export const utils = {
  "display": display,
  "msec2sec" : msec2sec,
  "createSprite": createSprite,
  "createTransparentRect": createTransparentRect,
};

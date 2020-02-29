import * as PIXI from "pixi.js";
import { conf } from "conf";

const display = {
  centerX: conf.canvas_width / 2,
  centerY: conf.canvas_height / 2,
};

const msec2sec = (msec: number): number => {
  return msec / 1000;
};

const sec2msec = (sec: number): number => {
  return sec * 1000;
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

const triggerEvent = (element: HTMLElement, eventName: string,
      bubbles: boolean, cancelable: boolean, data?: object): void => {
  const detail = {};

  if (data) {
    Object.keys(data).forEach((key, index) => {
      detail[key] = data[key];
    });
  }

  const event = new CustomEvent(eventName, { "detail" : detail });
  element.dispatchEvent(event);
};

const getApproximate = (list: number[], num: number): number => {
  let diff  = [];
  let index = 0;

  list.forEach(function (li, i) {
    diff[i] = Math.abs(num - li);
    index   = (diff[index] < diff[i]) ? index : i;
  });

  return list[index];
}

export const utils = {
  "display"        : display,
  "msec2sec"       : msec2sec,
  "sec2msec"       : sec2msec,
  "createRect"     : createRect,
  "createSprite"   : createSprite,
  "setNameToObj"   : setNameToObj,
  "triggerEvent"   : triggerEvent,
  "getApproximate" : getApproximate,
};

import * as PIXI from "pixi.js";
import { conf } from "conf";

const display = {
  centerX: conf.canvas_width  / 2,
  centerY: conf.canvas_height / 2,
};
const hasPointer = "onpointerdown" in window;
const hasTouch   = "ontouchstart" in window;

const pointer = {
  down   : hasPointer ? "pointerdown"   : (hasTouch ? "touchstart"  : "mousedown"),
  move   : hasPointer ? "pointermove"   : (hasTouch ? "touchmove"   : "mousemove"),
  up     : hasPointer ? "pointerup"     : (hasTouch ? "touchend"    : "mouseup"),
  cancel : hasPointer ? "pointercancel" : (hasTouch ? "touchcancel" : "mouseleave"),
};

const msec2sec = (msec: number): number => {
  return msec / 1000;
};

const sec2msec = (sec: number): number => {
  return sec * 1000;
};

const createRect = (name: string, width: number, height: number, color?: number, alpha?: number): PIXI.Graphics => {
  const hasColor  = (color != null);
  const rectangle = new PIXI.Graphics()
      .beginFill(hasColor ? color: 0xffffff, hasColor ? 1 : 0)
      .drawRect(0, 0, width, height)
      .endFill()
  ;
  rectangle.name    = name;
  rectangle.alpha   = alpha ? alpha : 1;
  rectangle.hitArea = new PIXI.Rectangle(0, 0, width, height);

  return rectangle;
};

const createSprite = (texture: PIXI.Texture, name?: string): PIXI.Sprite => {
  const sprite = PIXI.Sprite.from(texture);

  if (name) {
    sprite.name = name;
  }
  else if (texture.textureCacheIds.length) {
    sprite.name = texture.textureCacheIds[0];
  }

  return sprite;
};

const setNameToObj = (obj: object): void => {
  Object.keys(obj).forEach((key) => {
    obj[key].name = key;
  });
};

const getApproximate = (list: number[], num: number): number => {
  let i     = 0;
  let len   = list.length;
  let diff  = [];
  let index = 0;

  for (; len; ++i, --len) {
    diff[i] = Math.abs(num - list[i]);
    index   = (diff[index] < diff[i]) ? index : i;
  }

  return list[index];
};

const emitDomEvent = (element: HTMLElement, eventName: string,
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

const appendDom = (idName: string, targetDom?: HTMLElement): void => {
  if (document.getElementById(idName)) { return; }
  const dom = document.createElement("div");
  dom.id = idName;

  if (targetDom) {
    targetDom.appendChild(dom);
  }
  else {
    document.body.appendChild(dom);
  }
};

const removeDom = (idName: string, targetDom?: HTMLElement): void => {
  const dom = document.getElementById(idName);
  if (!dom) { return; }

  if (targetDom) {
    targetDom.removeChild(dom);
  }
  else {
    document.body.removeChild(dom);
  }
};

const copy2clipboard = (text: string, msg?: string): void => {
  const textarea = document.createElement("textarea");
  const message  = `${msg ? msg + " を " : ""}クリップボードにコピーしました！`; 

  textarea.textContent = text;
  document.body.appendChild(textarea);
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);

  alert(message);
};

const getCookie = (name): string => {
  const regex = /([\.$?*|{}\(\)\[\]\\\/\+^])/g;
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(regex, "\\$1") + "=([^;]*)"
  ));

  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const setCookie = (name, value, options?: {}): void => {
  if (options["expires"]) {
    options["expires"] = options["expires"].toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  Object.keys(options).forEach((key, index) => {
    updatedCookie += `; ${key}${options[key] ? "" : "=" + options[key]}`;
  });

  document.cookie = updatedCookie;
};

const choice = (list: number[]): number => {
  return list[Math.floor(Math.random() * list.length)];
};

const setBgColor = (renderer: PIXI.Renderer, color: number): void => {
  renderer.backgroundColor = color;
  document.body.style.backgroundColor = color.toString(16);
};

const resizeCanvas = (): void => {
  const winHeight = window.innerHeight;

  if (winHeight < conf.canvas_height) {
    const scale = winHeight / conf.canvas_height;
    conf.canvas_el.style.cssText = `-webkit-transform: scale(${scale}, ${scale});
    -moz-transform: scale(${scale}, ${scale});
    -ms-transform: scale(${scale}, ${scale});
    -o-transform: scale(${scale}, ${scale});
    transform: scale(${scale}, ${scale});`;
  }
  else if (conf.canvas_el.style.cssText !== "") {
    conf.canvas_el.style.cssText = "";
  }
};

export const utils = {
  "display"        : display,
  "pointer"        : pointer,
  "msec2sec"       : msec2sec,
  "sec2msec"       : sec2msec,
  "createRect"     : createRect,
  "createSprite"   : createSprite,
  "setNameToObj"   : setNameToObj,
  "getApproximate" : getApproximate,
  "emitDomEvent"   : emitDomEvent,
  "appendDom"      : appendDom,
  "removeDom"      : removeDom,
  "copy2clipboard" : copy2clipboard,
  "getCookie"      : getCookie,
  "setCookie"      : setCookie,
  "choice"         : choice,
  "setBgColor"     : setBgColor,
  "resizeCanvas"   : resizeCanvas,
};

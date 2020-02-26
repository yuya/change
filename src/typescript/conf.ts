import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";

const CANVAS_WIDTH   = 640;
const CANVAS_HEIGHT  = 960;
const CANVAS_BGCOLOR = 0xCFCBB1;

window.PIXI = PIXI;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.TextMetrics.BASELINE_SYMBOL += "あ｜";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

const color = {
  "black" : 0x222222,
  "white" : 0xFFFFFF,
};

const font = {
  "family" : "Nu Kinako Mochi, MisakiGothic2nd, sans-serif",
};

export const conf = {
  "root_el"        : document.getElementsByTagName("html")[0],
  "spinner_el"     : document.getElementById("spinner"),
  "canvas_el"      : document.getElementById("container"),
  "player_el"      : document.getElementById("youtube"),
  "canvas_width"   : CANVAS_WIDTH,
  "canvas_height"  : CANVAS_HEIGHT,
  "canvas_bgcolor" : CANVAS_BGCOLOR,
  "pixel_ratio"    : window.devicePixelRatio || 1,
  "color"          : color,
  "font"           : font,
};

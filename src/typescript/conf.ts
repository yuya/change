import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";

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
  "spinner_el"     : document.getElementById("spinner"),
  "canvas_el"      : document.getElementById("container"),
  "canvas_width"   : 640,
  "canvas_height"  : 960,
  "canvas_bgcolor" : 0xCFCBB1,
  "pixel_ratio"    : window.devicePixelRatio || 1,
  "color"          : color,
  "font"           : font,
};

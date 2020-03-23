import * as PIXI from "pixi.js";
import PixiPlugin from "gsap/PixiPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import gsap from "gsap";

const CANVAS_WIDTH   = 640;
const CANVAS_HEIGHT  = 960;
const CANVAS_BGCOLOR = 0xCFCBB1;

window.PIXI = PIXI;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.TextMetrics.BASELINE_SYMBOL += "あ｜";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);

const color = {
  "black" : 0x222222,
  "white" : 0xFFFFFF,
};

const font = {
  "family" : "Nu Kinako Mochi, JF Dot M+H 10, sans-serif",
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

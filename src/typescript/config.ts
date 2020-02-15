import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";

window.PIXI = PIXI;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.TextMetrics.BASELINE_SYMBOL += "あ｜";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

export const CONST = {
  SPINNER_EL       : document.getElementById("spinner"),
  CANVAS_TARGET_EL : document.getElementById("container"),
  CANVAS_WIDTH     : 640,
  CANVAS_HEIGHT    : 960,
  CANVAS_BGCOLOR   : 0xCFCBB1
};

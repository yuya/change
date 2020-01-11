import * as PIXI from "pixi.js";
import "./config";
import { Env } from "./utilities/env";

const env = Env;
const app = new PIXI.Application({
  width: Math.round(env.screenWidth / env.pixelRatio),
  height: Math.round(env.screenHeight / env.pixelRatio),
  resolution: env.pixelRatio,
  backgroundColor: 0xCFCBB1
});
document.body.appendChild(app.view);

const logo = PIXI.Sprite.from("/img/change.png");
app.stage.addChild(logo);

import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import "./config";
import { Env } from "./utilities/env";
import { SceneController } from "./controllers/sceneController";

const env = Env;
const sceneController = SceneController;

const app = new PIXI.Application({
  width: env.screenWidth / env.pixelRatio,
  height: env.screenHeight / env.pixelRatio,
  resolution: env.pixelRatio,
  // width: env.screenWidth,
  // height: env.screenHeight,
  // resolution: env.pixelRatio,
  backgroundColor: 0xCFCBB1
});

sceneController.loader.add("sprite", "/img/sprites.json");
sceneController.loader.load((loader, resources) => {
  sceneController.init(app);
  sceneController.assign("boot");
});

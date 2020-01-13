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
  backgroundColor: 0xCFCBB1
});

sceneController.init(app);
sceneController.assign("boot");

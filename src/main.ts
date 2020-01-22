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

const hideSpinner = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideSpinner, false);
    return;
  }

  const spinner = document.getElementById("spinner");
  spinner.style.display = "none";
};

const routeScene = () => {
  const regex   = /^#!(\w+)/;
  const matched = location.hash.match(regex);

  sceneController.assign(matched ? matched[1] : "boot");
}

const init = () => {
  hideSpinner();
  sceneController.init(app);
  
  routeScene();
  // sceneController.assign("boot");
};

sceneController.loader.add("sprite", "/img/sprites.json");
sceneController.loader.load(init);

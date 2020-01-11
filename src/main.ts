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
sceneController.assign("splash")

function init(se) {
  document.body.appendChild(app.view);

  const logo = PIXI.Sprite.from("/img/change.png");
  const container = new PIXI.Container();

  logo.width = 256;
  logo.height = 256;

  container.addChild(logo);
  app.stage.addChild(container);

  container.pivot.x = logo.width / 2;
  container.pivot.y = logo.height / 2;

  container.x = (app.screen.width / 2);
  container.y = -(logo.height / 2);

  app.ticker.add((delta) => {
    const targetY = (app.screen.height / 2) - (logo.height / 12);
    // rotate the container!
    // use delta to create frame-independent transform
    // container.rotation -= 0.03 * delta;
    if (container.y >= targetY) {
      se.play();

      return app.ticker.destroy();
    }

    container.y += 2;
  });
}

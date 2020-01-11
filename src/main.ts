import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import "./config";
import { Env } from "./utilities/env";

const env = Env;
const app = new PIXI.Application({
  width: env.screenWidth / env.pixelRatio,
  height: env.screenHeight / env.pixelRatio,
  // width: env.screenWidth,
  // height: env.screenHeight,
  resolution: env.pixelRatio,
  // autoResize: true,
  backgroundColor: 0xCFCBB1
});

function init(se) {
  document.body.appendChild(app.view);

  const logo = PIXI.Sprite.from("/img/change.png");
  const container = new PIXI.Container();

  logo.width = 192;
  logo.height = 192;

  container.addChild(logo);
  app.stage.addChild(container);

  container.pivot.x = logo.width / 2;
  container.pivot.y = logo.height / 2;

  container.x = (app.screen.width / 2);
  container.y = -(logo.height / 2);

  app.ticker.add((delta) => {
    const targetY = (app.screen.height / 2) - (logo.height / 8);
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

const btn: any = document.createElement("button");
btn.appendChild(document.createTextNode("start"));
document.body.appendChild(btn);

btn.addEventListener("click", () => {
  document.body.removeChild(btn);
  const se = new Howl({
    src: ["assets/poiiiiin.mp3"]
  });

  init(se);
});

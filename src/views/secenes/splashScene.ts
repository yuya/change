import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";

export class splashScene extends PIXI.Container {
  private app: PIXI.Application;
  private se: any = new Howl({
    src: ["assets/poiiiiin.mp3"]
  }); 

  constructor(app: PIXI.Application) {
    super();

    this.app = app;
    // const hoge = PIXI.Container;

    const btn: any = document.createElement("button");
    btn.appendChild(document.createTextNode("start"));
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      document.body.removeChild(btn);
      const se = new Howl({
        src: ["assets/poiiiiin.mp3"]
      });

      document.body.appendChild(app.view);
      this.start();
    });
  }

  private start() {
    document.body.appendChild(this.app.view);

    const logo = PIXI.Sprite.from("/img/change.png");
    const container = new PIXI.Container();

    logo.width = 256;
    logo.height = 256;

    container.addChild(logo);
    this.app.stage.addChild(container);

    container.pivot.x = logo.width / 2;
    container.pivot.y = logo.height / 2;

    container.x = (this.app.screen.width / 2);
    container.y = -(logo.height / 2);

    this.app.ticker.add((delta) => {
      const targetY = (this.app.screen.height / 2) - (logo.height / 12);

      if (container.y >= targetY) {
        this.se.play();

        return this.app.ticker.destroy();
      }

      container.y += 2;
    });

  }
}

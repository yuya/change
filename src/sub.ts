import * as PIXI from "pixi.js";

export function Hello() {
  console.log("hellooooo world!!!!!");

  const app = new PIXI.Application({
    width: 400,
    height: 200
  });
  document.body.appendChild(app.view);

  const text = new PIXI.Text("Hellooooo World!!!!!",
    new PIXI.TextStyle({
      fill: "#FFFFFF"
    })
  );
  app.stage.addChild(text);
}

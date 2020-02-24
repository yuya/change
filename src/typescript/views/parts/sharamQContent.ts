import { utils } from "utils";
import { UserData } from "models";
import { Content } from "views";

export class SharamQContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
    this.setButton();
  }

  private setTitle() {
    const title = utils.createSprite(this.textures["txt_sharamq.png"]);

    title.position.set(8, 6);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
つんく♂さん
シャ乱Q
`.replace(/(^\n|\n$)/g, "");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }

  private setButton() {
    const button = utils.createSprite(this.textures["ui_button.png"]);
    const nextSceneName = UserData.instance.load("nextSceneName");

    button.pivot.set(button.width / 2, 0);
    button.position.set(this.bg.txtBody.width / 2, this.bg.txtBody.height - button.height - 24);
    button.interactive = button.buttonMode = true;

    button.addListener("pointerdown", () => {
      this.game.currentScene.destroy();
      this.game.route(nextSceneName);
    }, button);

    this.bg.txtBody.addChild(button);
  }
}
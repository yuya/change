import { gsap } from "gsap";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Content } from "views";

export class AboutContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
  }

  private setTitle() {
    const title = utils.createSprite(this.textures["txt_myname.png"]);

    title.position.set(8, 6);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = [
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
      "私の名はブルターニア！またの名をルルーシュ！！！",
    ].join("\n");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
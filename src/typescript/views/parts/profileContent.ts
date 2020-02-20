import { gsap } from "gsap";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Content } from "views"

export class ProfileContent extends Content {
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
      "私はリズム天国に携わりたい！だから任天堂任天堂！",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
      "私はリズム天国に携わりたい！だから 任天堂 任天堂",
    ].join("\n");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
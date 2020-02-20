import { utils } from "utils";
import { Content } from "views"

export class ContactContent extends Content {
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
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
      "お問い合わせはこちら！お問い合わせはこちら！",
    ].join("\n");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
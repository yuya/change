import { utils } from "utils";
import { Content } from "views";

export class HistoryContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
  }

  private setTitle() {
    const title = utils.createSprite(this.textures["ttl_chatmonchy.png"]);

    title.position.set(8, 6);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
シャングリラ！！！！！！！！！！！！！！！！！！
`.replace(/(^\n|\n$)/g, "");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
import { utils } from "utils";
import { Content } from "views"

export class SharamQContent extends Content {
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
    const str = `
さみしいユルはごめんどぅあああっはっはいい！

【最近ハマってる沼】
BEYOOOOONDS

【最近の】
さいきん

最近ハマってる沼：ＢＥＹＯＯＯＯＯＮＤＳ沼
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
寂しいユルはごめんどぅあああっはっはいい！
`.replace(/(^\n|\n$)/g, "");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
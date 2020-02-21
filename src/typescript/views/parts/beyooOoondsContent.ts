import { utils } from "utils";
import { Content } from "views";

export class BeyooOoondsContent extends Content {
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
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ Ｄ・Ｎ・Ａ！ＢＥＹＯＯＯＯＯＮＤＳ 沼
ニッポンノ D・N・A！BEYooOooNDS！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
ニッポンノ D・N・A！Beyooooonds！！！！！
`.replace(/(^\n|\n$)/g, "");

    const txt = new PIXI.Text(str, this.txtStyle);
    txt.position.set(20, 20);

    this.bg.txtBody.addChild(txt);
  }
}
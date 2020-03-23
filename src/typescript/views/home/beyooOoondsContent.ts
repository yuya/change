import { conf } from "conf";
import { utils } from "utils";
import { UserData } from "models";
import { Content } from "views";

export class BeyooOoondsContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
    this.setButton();
  }

  private setTitle() {
    // ニッポンノ D・N・A！
    const title = utils.createSprite(this.textures["ttl_beyooooonds.png"]);

    title.position.set(8, 6);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<p>
すきなゲーム の リズム天国 と、<i class="mod-mochi">Beyooooonds</i> の がっきょくを 組み合わせたら どうなるのか？<br>
そんな こうきしん から、<i class="mod-mochi">YouTube</i> で 公開されている <i class="mod-mochi">MV</i> を はいしゃくして、作ってみました。
</p>
<p>
とんでくる モノを、リズムにノッて タイミングよく パンチ！！ タイミング が わからなければ、<a class="icon youtube" href="https://www.youtube.com/watch?v=KYVMtijS74U" target="_blank" rel="noopener noreferrer"><i class="mod-mochi">MV</i></a> を みて べんきょうだ！
</p>
`.replace(/(^\n|\n$)/g, "");

    const txt = document.createTextNode(str);
    const dom = document.createElement("div");

    dom.id = "dom";
    dom.className = "txt-body";
    dom.innerHTML = str;

    conf.canvas_el.appendChild(dom);
  }

  private setButton() {
    const button = utils.createSprite(this.textures["ui_button.png"]);
    const nextSceneName = UserData.instance.load("nextSceneName");

    button.pivot.set(button.width / 2, 0);
    button.position.set(this.bg.txtBody.width / 2, this.bg.txtBody.height - button.height - 24);
    button.interactive = button.buttonMode = true;

    button.addListener("pointerdown", () => {
      this.destroy();
      this.game.currentScene.destroy();
      this.game.route(nextSceneName);
    }, button);

    this.bg.txtBody.addChild(button);
  }
}
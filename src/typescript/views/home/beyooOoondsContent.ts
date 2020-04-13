import { conf } from "conf";
import { utils } from "utils";
import { UserData } from "models";
import { SoundController } from "controllers";
import { Content } from "views";

export class BeyooOoondsContent extends Content {
  private sound : SoundController;

  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
    this.setButton();

    this.sound = SoundController.instance;
  }

  private setTitle() {
    // ニッポンノ D・N・A！
    const title = utils.createSprite(this.textures["ttl_beyooooonds"]);

    title.position.set(12, 7);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<p>
すきなゲーム の リズム天国 と、<i class="mod-mochi">Beyooooonds</i> の がっきょくを 組み合わせたら どうなるのか？<br>
そんな こうきしん から、<i class="mod-mochi">YouTube</i> で 公開されている <i class="mod-mochi">MV</i> を はいしゃくして、作ってみました。
</p>
<p>
とんでくる モノを、リズムにノッて タイミングよく パンチ！！ タイミング が わからなければ、<a class="icon youtube" href="https://www.youtube.com/watch?v=KYVMtijS74U" target="_blank" rel="noopener"><i class="mod-mochi">MV</i></a> を みて べんきょうだ！
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
    const nextSceneName = UserData.instance.load("next_scene_name");
    const btnBase  = utils.createSprite(this.textures["btn_base"]);
    const btnHover = utils.createSprite(this.textures["btn_base_o"]);
    const btnLabel = utils.createSprite(this.textures["label_play"]);
    const defaultY = 5;
    const defaultH = btnBase.height * 3;

    btnBase.pivot.set(btnBase.width / 2, btnBase.height);
    btnBase.scale.set(3, 3);
    btnBase.height = defaultH + 16;
    btnBase.position.set(this.bg.txtBody.width / 2, this.bg.txtBody.height - 40);
    btnBase.interactive = btnBase.buttonMode = true;
    btnBase.addChild(btnLabel);
    btnLabel.position.set(25, defaultY);

    btnBase.addListener("pointerover", () => {
      this.sound.se["select"].play();
      btnBase.texture = this.textures["btn_base_o"];
      btnBase.height = defaultH;
      btnLabel.y = defaultY + 5;
    });
    btnBase.addListener("pointerout", () => {
      btnBase.texture = this.textures["btn_base"];
      btnBase.height = defaultH + 16;
      btnLabel.y = defaultY;
    });

    btnBase.addListener("pointerdown", () => {
      const logo = document.getElementById("logo");
      const btn  = document.getElementById("btn-sound-toggle");

      btnBase.texture = this.textures["btn_base_o"];
      btnLabel.y = defaultY + 5;
      this.sound.play("se", "decide");
      setTimeout(() => {
        this.sound.bgm["home"].fade(1, 0, 1000);
        this.destroy();
        conf.canvas_el.removeChild(logo);
        conf.canvas_el.removeChild(btn);
        this.game.currentScene.destroy();
        this.game.route(nextSceneName);
      }, 330);
    });

    this.bg.txtBody.addChild(btnBase);
  }
}

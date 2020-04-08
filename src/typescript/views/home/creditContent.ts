import { conf } from "conf";
import { utils } from "utils";
import { Content } from "views";

export class CreditContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
  }

  private setTitle() {
    // クレジット
    const title = utils.createSprite(this.textures["ttl_credit"]);

    title.scale.set(2, 2);
    title.position.set(12, 7);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<dl>
  <dt>【きかく/デザイン/じっそう】</dt>
  <dd>橋本 雄也</dd>
  <dt>【えいぞう】</dt>
  <dd><a class="icon youtube" href="https://www.youtube.com/watch?v=KYVMtijS74U" target="_blank" rel="noopener">ニッポンノ<i class="mod-mochi">D・N・A</i>！</a> <i class="mod-mochi">(<a class="icon favorite" href="http://www.helloproject.com/beyooooonds/" target="_blank" rel="noopener">Beyooooonds</a>)</i>
  <dt>【フォント】</dt>
  <dd>
    <ul>
      <li><a class="icon favorite" href="http://kokagem.sakura.ne.jp/font/mochi/" target="_blank" rel="noopener"><i class="mod-mochi">Nu</i> きなこもち</a> <i class="mod-mochi">(<a class="icon twitter" href="https://twitter.com/sayunu/status/1230841977979031552" target="_blank" rel="noopener">@sayunu</a>　thx!)</i></li>
      <li><a class="icon favorite" href="http://www.ku-da.net/fonts/font-exotic-agent.html" target="_blank" rel="noopener">exotic agent</a></li>
      <li><a class="icon favorite" href="https://fontdasu.com/179" target="_blank" rel="noopener">ヨコスカブロック</a></li>
    </ul>
  </dd>
</dl>
`.replace(/(^\n|\n$)/g, "");

    const txt = document.createTextNode(str);
    const dom = document.createElement("div");

    dom.id = "dom";
    dom.className = "txt-body";
    dom.innerHTML = str;

    conf.canvas_el.appendChild(dom);
  }
}
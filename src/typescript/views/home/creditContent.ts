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
  <dt>【ゲーム中のがっきょく】</dt>
  <dd><a class="icon youtube" href="https://www.youtube.com/watch?v=KYVMtijS74U" target="_blank" rel="noopener">ニッポンノ<i class="mod-mochi">D・N・A</i>！</a> <i class="mod-mochi">(<a class="icon newtab" href="http://www.helloproject.com/beyooooonds/" target="_blank" rel="noopener">Beyooooonds</a>)</i>
  <dt>【フォント】</dt>
  <dd>
    <table>
      <tr>
        <td><a class="icon newtab" href="http://kokagem.sakura.ne.jp/font/mochi/" target="_blank" rel="noopener"><i class="mod-mochi">Nu</i> きなこもち</a></td>
        <td><a class="icon newtab" href="https://littlelimit.net/misaki.htm" target="_blank" rel="noopener">美咲ゴシック</a></td>
      <tr>
        <td><a class="icon newtab" href="http://www.ku-da.net/fonts/font-exotic-agent.html" target="_blank" rel="noopener">exotic agent</a></td>
        <td><a class="icon newtab" href="https://fontdasu.com/179" target="_blank" rel="noopener noreferrer">ヨコスカブロック</a></td>
      </tr>
    </table>
  </dd>
  <dt>【サウンド】</dt>
  <dd>
    <table>
      <tr>
        <td><a class="icon newtab" href="https://on-jin.com/" target="_blank" rel="noopener">On-Jin ～音人～</a></td>
        <td><a class="icon newtab" href="https://pocket-se.info/" target="_blank" rel="noopener">ポケットサウンド</a></td>
      </tr>
      <tr>
        <td><a class="icon newtab" href="https://soundeffect-lab.info/" target="_blank" rel="noopener">効果音ラボ</a></td>
        <td><a class="icon newtab" href="https://otologic.jp/" target="_blank" rel="noopener">OtoLogic</a></td>
      </tr>
      <tr>
        <td><a class="icon newtab" href="https://01earth.net/" target="_blank" rel="noopener">01SoundEarth</a></td>
        <td>&nbsp;</td>
      </tr>
    </table>
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

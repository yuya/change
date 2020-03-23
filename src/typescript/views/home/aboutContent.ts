import { conf } from "conf";
import { utils } from "utils";
import { Content } from "views";

export class AboutContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();
  }

  private setTitle() {
    // このサイトはなに？
    const title = utils.createSprite(this.textures["ttl_profile.png"]);

    title.position.set(10, 12);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<p>橋本 雄也 の ポートフォリオ サイト です。</p>
<p class="mb-2em">
サイト名 に つけている 「<i class="mod-mochi">CHANGE</i>」 の、
<i class="mod-mochi">CHANGE</i>　...　[　　　　　]　に つづくことば、<br>
<i class="mod-mochi">５</i>つ に これからの 思い を こめています。
</p>

<table>
<caption class="l"><span>CHANGE</span></caption>
<tbody>
<tr><td>[</td><td class="c">&nbsp;<i class="mod-mochi">COLOR</i>&nbsp;</td><td>]</td><td>　...　</td><td class="c">いろ</td><td>&nbsp;を&nbsp;</td><td>かえ、</td></tr>
<tr><td>[</td><td class="c">&nbsp;<i class="mod-mochi">LIFE</i>&nbsp;</td><td>]</td><td>　...　</td><td class="c">せいかつ</td><td>&nbsp;を&nbsp;</td><td>かえ、</td></tr>
<tr><td>[</td><td class="c">&nbsp;<i class="mod-mochi">MYSELF</i>&nbsp;</td><td>]</td><td>　...　</td><td class="c">じぶん</td><td>&nbsp;を&nbsp;</td><td>かえ、</td></tr>
<tr><td>[</td><td class="c">&nbsp;<i class="mod-mochi">RULE</i>&nbsp;</td><td>]</td><td>　...　</td><td class="c">ルール</td><td>&nbsp;を&nbsp;</td><td>かえ、</td></tr>
<tr><td>[</td><td class="c">&nbsp;<i class="mod-mochi">FUTURE</i>&nbsp;</td><td>]</td><td>　...　</td><td class="c">みらい</td><td>&nbsp;を&nbsp;</td><td>かえていく</td></tr>
</tbody>
</table>
`.replace(/(^\n|\n$)/g, "");

    const txt = document.createTextNode(str);
    const dom = document.createElement("div");

    dom.id = "dom";
    dom.className = "txt-body";
    dom.innerHTML = str;

    conf.canvas_el.appendChild(dom);
  }
}
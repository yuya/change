import { conf } from "conf";
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
    // 更新履歴
    // TODO
    const title = new PIXI.Text("更新履歴", {
      fill: conf.color.black,
      fontFamily: "JF Dot M+H 10, sans-serif",
      fontSize: 32,
    });

    title.position.set(12, 14);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<dl>
  <dt>【かいはつ リポジトリ】</dt>
  <dd><a class="icon github" href="https://github.com/yuya/change" target="_blank" rel="noopener noreferrer">yuya/change</a></dd>
  <dt>【こうしん りれき】</dt>
  <dd>
    <ul>
      <li>- <i class="mod-mochi">2020.03.25</i>　...　さいしょ の 公開</li>
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
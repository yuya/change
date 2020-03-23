import { conf } from "conf";
import { utils } from "utils";
import { Content } from "views";

export class ProfileContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();

    // this.attachEvent();
  }

  private setTitle() {
    const title = utils.createSprite(this.textures["ttl_profile.png"]);

    title.position.set(10, 12);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<dl>
<dt>【すきな リズム天国 の ステージ】</dt>
<dd>
  <ul>
    <li><a class="icon favorite" href="https://www.nintendo.co.jp/n08/brij/" target="_blank" rel="noopener noreferrer">リズム天国 (GBA) 「<span class="mod-mochi-alphabet">3rd</span> リミックス」</a></li>
    <li class="nowrap"><a class="icon favorite" href="https://www.nintendo.co.jp/3ds/bpjj/" target="_blank" rel="noopener noreferrer">リズム天国 ザ・ベスト＋「ハチハチリミックス」</a></li>
  </ul>
</dd>
<dt>【すきな 尾崎豊 の ライブ えいぞう】</dt>
<dd>
  <ul>
    <li><a class="icon amazon" href="https://www.amazon.co.jp/dp/B000EIF4P4" target="_blank" rel="noopener noreferrer"><span class="mod-mochi-alphabet">1984.03.15</span> 新宿ルイード「十七歳の地図」</a></li>
    <li><a class="icon amazon" href="https://www.amazon.co.jp/dp/B00BETZ90W" target="_blank" rel="noopener noreferrer"><span class="mod-mochi-alphabet">1988.09.12</span> 東京ドーム「シェリー」</a></li>
  </ul>
</dd>
<dt>【すきな チャットモンチー の ライブ えいぞう】</dt>
<dd>
  <ul>
    <li><a class="icon amazon" href="https://www.amazon.co.jp/dp/B001OAMV3O" target="_blank" rel="noopener noreferrer"><span class="mod-mochi-alphabet">2008.04.01</span> 日本武道館「恋愛スピリッツ」</a></li>
    <li><a class="icon amazon" href="https://www.amazon.co.jp/dp/B07F7R8KZ7" target="_blank" rel="noopener noreferrer"><span class="mod-mochi-alphabet">2018.07.04</span> 日本武道館「砂鉄」</a></li>
  </ul>
</dd>
<dt>【さいきん ハマっている 沼】</dt>
<dd>
  <ul>
    <li><a class="icon youtube" href="https://www.youtube.com/channel/UCE5GP4BHm2EJx4xyxBVSLlg" target="_blank" rel="noopener noreferrer"><span class="mod-mochi-alphabet">BEYOOOOONDS</span> 沼</a></li>
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

  // private attachEvent(): void {
  //   const element  = document.querySelector(".js-mail-addr");
  //   const mailAddr = element.childNodes[0].textContent;

  //   element.addEventListener("click", () => {
  //     this.copy2clipboard(mailAddr);
  //   }, false);
  // }
}

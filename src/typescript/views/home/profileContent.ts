import { conf } from "conf";
import { utils } from "utils";
import { Content } from "views";

export class ProfileContent extends Content {
  public constructor() {
    super();

    this.makeBackground();
    this.setTitle();
    this.setText();

    this.attachEvent();
  }

  private setTitle() {
    // 橋本雄也
    const title = utils.createSprite(this.textures["ttl_profile.png"]);

    title.position.set(10, 12);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<div class="pic"><img src="/assets/img/pic_yhashimoto.png" width="480" height="270"></div>
<p>都内の <i class="mod-mochi">IT</i>ベンチャーで しゃかりき はたらいた後、<i class="mod-mochi">2011</i>年 カヤック に 入社。ソーシャルゲーム の うんよう・かいはつに 関わるうちに いだいた「夢」に いどむため、こんなサイト を つくりはじめた。</p>
<ul class="table col-3">
  <li><a class="icon twitter" href="https://twitter.com/yuya" target="_blank" rel="noopener noreferrer">@yuya</a></li>
  <li><a class="icon github" href="https://github.com/yuya" target="_blank" rel="noopener noreferrer">@yuya</a></li>
  <li><span class="icon gmail cursor-pointer js-mail-addr">&#109;&#97;&#105;&#108;&#64;&#121;&#117;&#121;&#97;&#46;&#105;&#109;</span></li>
</ul>
<ul>
</ul>
`.replace(/(^\n|\n$)/g, "");

    const txt = document.createTextNode(str);
    const dom = document.createElement("div");

    dom.id = "dom";
    dom.className = "txt-body";
    dom.innerHTML = str;

    conf.canvas_el.appendChild(dom);
  }

  private attachEvent(): void {
    const element  = document.querySelector(".js-mail-addr");
    const mailAddr = element.childNodes[0].textContent;

    element.addEventListener("click", () => {
      utils.copy2clipboard(mailAddr, "メールアドレス");
    }, false);
  }
}

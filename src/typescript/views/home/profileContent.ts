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
    const title = utils.createSprite(this.textures["ttl_profile"]);

    title.scale.set(2, 2);
    title.position.set(12, 7);
    this.bg.txtHead.addChild(title);
  }

  private setText() {
    const str = `
<div class="pic-profile"></div>
<p>都内の <i class="mod-mochi">IT</i>ベンチャーで しゃかりき はたらいた後、<i class="mod-mochi">2011</i>年 カヤック に 入社。ソーシャルゲーム の うんよう・開発に 関わるうちに いだいた「夢」に向かうため、このサイトを つくりはじめた。</p>
<ul class="table col-3">
  <li><a class="icon twitter" href="https://twitter.com/yuya" target="_blank" rel="noopener">@yuya</a></li>
  <li><a class="icon github" href="https://github.com/yuya" target="_blank" rel="noopener">@yuya</a></li>
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

    const picProfile  = document.querySelector(".pic-profile");
    const spriteData  = this.game.assetData.load("spriteSheetDom");
    const spriteImage = spriteData.children[0].data.cloneNode();

    spriteImage.width     = spriteData.data.meta.size.w*2;
    spriteImage.height    = spriteData.data.meta.size.h*2;
    spriteImage.style.top = `-${spriteData.data.frames.pic_yhashimoto.frame.y*2}px`;
    
    picProfile.appendChild(spriteImage);
  }

  private attachEvent(): void {
    const element  = document.querySelector(".js-mail-addr");
    const mailAddr = element.childNodes[0].textContent;

    element.addEventListener("click", () => {
      utils.copy2clipboard(mailAddr, "メールアドレス");
    }, false);
  }
}

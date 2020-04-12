import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene } from "views";

const LogoPos = {
  c : {
    bg  : { x:   0, y:   6 },
    txt : { x:  14, y:  19 },
    df  : { x:  14, y:  13 },
  },
  h : {
    bg  : { x:  33, y:   0 },
    txt : { x:  43, y:  15 },
    df  : { x:  10, y:  15 },
  },
  a : {
    bg  : { x:  59, y:  10 },
    txt : { x:  70, y:  22 },
    df  : { x:  11, y:  12 },
  },
  n : {
    bg  : { x:  93, y:   2 },
    txt : { x: 103, y:  15 },
    df  : { x:  10, y:  13 },
  },
  g : {
    bg  : { x: 122, y:   8 },
    txt : { x: 135, y:  21 },
    df  : { x:  13, y:  13 },
  },
  e : {
    bg  : { x: 151, y:   0 },
    txt : { x: 166, y:  15 },
    df  : { x:  15, y:  15 },
  },
} as const;
type LogoPos = typeof LogoPos[keyof typeof LogoPos];

const StarPos = {
  star_1  : { x:  93, y:  18 },
  star_2  : { x: 275, y:  22 },
  star_3  : { x: 167, y:  66 },
  star_4  : { x:  25, y:  86 },
  star_5  : { x: 255, y: 120 },
  star_6  : { x:  85, y: 140 },
  star_7  : { x:  10, y: 217 },
  star_8  : { x: 277, y: 251 },
  star_9  : { x:  40, y: 325 },
  star_10 : { x: 193, y: 364 },
  star_11 : { x:  92, y: 400 },
  star_12 : { x: 284, y: 420 },
} as const;
type StarPos = typeof StarPos[keyof typeof StarPos];


export class TitleScene extends Scene {
  private textures: any;
  private background: PIXI.Container;
  private logo: PIXI.Container;
  private logoParts: { [key : string] : PIXI.Sprite[] };
  private animParts: any;
  
  public constructor() {
    super();

    this.textures    = this.assetData.load("textures");
    this.background  = new PIXI.Container();
    this.logo        = new PIXI.Container();
    this.logoParts   = {};
    this.animParts   = this.assetData.load("animation").spritesheet.textures;
    this.rect.bgFoot = utils.createRect("bgFoot", conf.canvas_width, 64, conf.color.black);
    this.rect.cover  = utils.createRect("cover", conf.canvas_width, conf.canvas_height);

    this.background.name = "bg";
    this.logo.name = "logo";

    this.initLayout();
    this.initTitleLogo();
  }

  private initLayout(): void {
    const stashParts = new Array(18);

    this.initBackground();

    this.logoParts["c"] = [];
    this.logoParts["h"] = [];
    this.logoParts["a"] = [];
    this.logoParts["n"] = [];
    this.logoParts["g"] = [];
    this.logoParts["e"] = [];

    Object.keys(this.logoParts).forEach((key, index) => {
      const part = this.logoParts[key];
      const out  = utils.createSprite(this.animParts["anim_logo_circle_outline"], "out");
      const bg   = utils.createSprite(this.animParts["anim_logo_circle_base"], "bg");
      const txt  = utils.createSprite(this.animParts[`anim_logo_txt_${key}`], "txt");

      out.anchor.set(0.5, 0.5);
      bg.anchor.set(0.5, 0.5);
      txt.anchor.set(0.5, 0.5);

      out.position.set(LogoPos[key].bg.x + out.width/2, LogoPos[key].bg.y + out.height/2);
      bg.position.set(LogoPos[key].bg.x + bg.width/2, LogoPos[key].bg.y + bg.height/2);
      txt.position.set(LogoPos[key].txt.x + txt.width/2, LogoPos[key].txt.y + txt.height/2);

      stashParts[0  + index] = out;
      stashParts[6  + index] = bg;
      stashParts[12 + index] = txt;

      part.push(bg, out, txt);
    });

    stashParts.forEach((el) => this.logo.addChild(el));

    this.logo.width  = 206;
    this.logo.height = 66;
    this.logo.pivot.set(this.logo.width / 2, 0);
    this.logo.position.set(utils.display.centerX, conf.canvas_height + this.logo.height*2.75);
    this.logo.scale.set(2.5, 2.5);
    // this.logo.scale.set(2, 2);

    this.rect.bgFoot.pivot.set(0, this.rect.bgFoot.height);
    this.rect.bgFoot.position.set(0, conf.canvas_height);

    this.el.tap2start = utils.createSprite(this.textures["label_tap2start"]);
    this.el.tap2start.pivot.set(this.el.tap2start.width / 2, 0);
    this.el.tap2start.scale.set(2, 2);
    this.el.tap2start.position.set(utils.display.centerX, utils.display.centerY + this.el.tap2start.height);
    this.el.tap2start.alpha = 0;

    this.el.txtFoot = utils.createSprite(this.textures["txt_developed"]);
    this.el.txtFoot.pivot.set(this.el.txtFoot.width / 2, this.el.txtFoot.height);
    this.el.txtFoot.scale.set(2, 2);
    this.el.txtFoot.position.set(utils.display.centerX, conf.canvas_height - 30);

    this.rect.cover.interactive = this.rect.cover.buttonMode = true;

    this.container.addChild(this.background, this.logo, this.el.tap2start, this.rect.bgFoot, this.el.txtFoot, this.rect.cover);
    this.game.ticker.start();
  }

  private initShareButton(): void {
    const str = `
    <ul>
      <li><a id="btn-share-tw" target="_blank" rel="noopener" href="#"></a></li>
      <li><a id="btn-share-fb" target="_blank" rel="noopener" href="#"></a></li>
    </ul>
    <p><a id="link2repo" target="_blank" rel="noopener" href="https://github.com/yuya/change"></a></p>
    `.replace(/(^\n|\n$)/g, "");
    
    const txt = document.createTextNode(str);
    const dom = document.createElement("div");

    dom.id = "dom";
    dom.className = "foot-link";
    dom.innerHTML = str;
    conf.canvas_el.appendChild(dom);

    const tw = document.getElementById("btn-share-tw");
    const fb = document.getElementById("btn-share-fb");
    const gh = document.getElementById("link2repo");

    const spriteInfo  = this.assetData.load("spriteSheetDom");
    const spriteImage = spriteInfo.children[0].data;

    tw.appendChild(spriteImage.cloneNode());
    fb.appendChild(spriteImage.cloneNode());
    gh.appendChild(spriteImage.cloneNode());

    tw.setAttribute("href", `https://twitter.com/share?url=${location.origin}/&text=${document.title}`);
    fb.setAttribute("href", `https://www.facebook.com/share.php?u=${location.origin}/`);
    setTimeout(() => dom.classList.add("show"), 100);
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("next_scene_name");

    this.rect.cover.addListener("pointerdown", () => {
      this.sound.play("se", "decide");
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          // this.sound.fade("bgm", "title");
          const footLink = document.querySelector(".foot-link");
          conf.canvas_el.removeChild(footLink);
          this.sound.bgm["title"].fade(1, 0, 500);
          this.container.destroy({ children: true });
          this.game.route(nextSceneName);
        }
      });
    });
  }

  private initBackground(): void {
    const starList = [
      utils.createSprite(this.animParts["anim_bg_star_1"],   "star_1"),
      utils.createSprite(this.animParts["anim_bg_star_2"],   "star_2"),
      utils.createSprite(this.animParts["anim_bg_star_3"],   "star_3"),
      utils.createSprite(this.animParts["anim_bg_star_4"],   "star_4"),
      utils.createSprite(this.animParts["anim_bg_star_5"],   "star_5"),
      utils.createSprite(this.animParts["anim_bg_star_6"],   "star_6"),
      utils.createSprite(this.animParts["anim_bg_star_7"],   "star_7"),
      utils.createSprite(this.animParts["anim_bg_star_8"],   "star_8"),
      utils.createSprite(this.animParts["anim_bg_star_9"],   "star_9"),
      utils.createSprite(this.animParts["anim_bg_star_10"], "star_10"),
      utils.createSprite(this.animParts["anim_bg_star_11"], "star_11"),
      utils.createSprite(this.animParts["anim_bg_star_12"], "star_12"),
    ];
    starList.forEach((star, index) => {
      const name = `star_${index + 1}`;

      star.anchor.set(0.5, 0.5);
      star.position.set(StarPos[name].x + star.width/2, StarPos[name].y + star.height/2);
      this.background.addChild(star);
    })

    this.background.scale.set(2, 2);

    let timeline = gsap.timeline({
      repeat: 3,
      delay: utils.msec2sec(130),
      repeatDelay: utils.msec2sec(300),
      onComplete: () => {
        this.loopBackground(starList);
      }
    });

    timeline.to(starList, {
      duration: utils.msec2sec(100),
      ease: "easeOutCubic",
      pixi: { scale: "+=0.5" },
    });

    timeline.to(starList, {
      duration: utils.msec2sec(50),
      ease: "easeInCubic",
      pixi: { scale: "-=0.5" },
    });

    timeline.play();
  }

  private loopBackground(starList: PIXI.Sprite[]): void {
    let timeline = gsap.timeline({
      repeat: -1,
    });

    starList.forEach((star, index) => {
      timeline.to(star, {
        ease: "linear",
        duration: utils.msec2sec(500),
        pixi: { alpha: 0.4 }
      }, `-=${utils.msec2sec(500)}`);
      timeline.to(star, {
        ease: "linear",
        duration: utils.msec2sec(500),
        pixi: { alpha: 1 }
      });
    });

    timeline.play();
  }

  private initTitleLogo(): void {
    const height: number = conf.canvas_height / 2;
    let timeline: any = {
      conf: [
        {
          y: -(height+ this.logo.height),
          duration: 300,
          ease: "easeOutCubic"
        },
        {
          y: (height + this.logo.height),
          duration: 200,
          ease: "easeInCubic"
        },
        {
          y: -(height * 0.8),
          duration: 180,
          ease: "easeOutCubic"
        },
        {
          y: (height * 0.5),
          duration: 144,
          ease: "easeInCubic"
        },
        {
          y: -(height * 0.4),
          duration: 100,
          ease: "easeOutCubic"
        },
        {
          y: (height * 0.02),
          duration: 60,
          ease: "easeInCubic"
        },
        {
          y: -(height * 0.005),
          duration: 30,
          ease: "easeOutCubic"
        },
      ]
    };

    timeline.intro = gsap.timeline({
      delay: utils.msec2sec(500),
      onComplete: () => {
        this.initVolumeButton();
        this.initShareButton();

        this.sound.play("bgm", "title");
        this.attachEvent();
        this.loopTitleLogo();

        gsap.to(this.el.tap2start, {
          duration: utils.msec2sec(250),
          pixi: { alpha: 1 }
        });
      }
    });
    timeline.cha = gsap.timeline();
    timeline.nge = gsap.timeline();

    timeline.conf.forEach((tl) => {
      timeline.cha.to(this.logoParts["c"], {
        duration: utils.msec2sec(tl.duration*0.8),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      });
      timeline.cha.to(this.logoParts["h"], {
        duration: utils.msec2sec(tl.duration*0.9),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      }, `<+${utils.msec2sec(20)}`);
      timeline.cha.to(this.logoParts["a"], {
        duration: utils.msec2sec(tl.duration),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      }, `<+${utils.msec2sec(40)}`);

      timeline.nge.to(this.logoParts["n"], {
        duration: utils.msec2sec(tl.duration*0.8),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      });
      timeline.nge.to(this.logoParts["g"], {
        duration: utils.msec2sec(tl.duration*0.9),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      }, `<+${utils.msec2sec(20)}`);
      timeline.nge.to(this.logoParts["e"], {
        duration: utils.msec2sec(tl.duration),
        ease: tl.ease,
        pixi: { y: tl.y ? `+=${tl.y}` : `-=${tl.y}` }
      }, `<+${utils.msec2sec(40)}`);
    });

    timeline.intro.add(timeline.cha);
    timeline.intro.add(timeline.nge, "-=1.3");
    timeline.intro.pause();

    this.sound.play("jingle", "metronome");
    timeline.intro.play();
  }

  private loopTitleLogo(): void {
    let timeline: any = {
      loop: gsap.timeline({
        repeat: -1,
      }),
      zoom: gsap.timeline(),
      wave: gsap.timeline({
        delay: utils.msec2sec(620),
        repeatDelay: utils.msec2sec(620),
        repeat: 7,
      })
    };
    
    Object.keys(this.logoParts).forEach((key, index) => {
      const part = this.logoParts[key];

      timeline.zoom.to(part, {
        duration: utils.msec2sec(80),
        ease: "easeOutElastic",
        pixi: { scale: "+=0.5" }
      }, `-=${utils.msec2sec(110)}`);
      timeline.zoom.to(part, {
        duration: utils.msec2sec(40),
        ease: "easeInElastic",
        pixi: { scale: "-=0.5" }
      });
    });

    timeline.wave.to(this.logoParts["c"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "-=12", y: "+=8" }
    });
    timeline.wave.to(this.logoParts["c"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "+=12", y: "-=8" }
    });

    timeline.wave.to(this.logoParts["h"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "-=8", y: "+=12" }
    }, `-=${utils.msec2sec(115)}`);
    timeline.wave.to(this.logoParts["h"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "+=8", y: "-=12" }
    });

    timeline.wave.to(this.logoParts["a"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "-=3", y: "-=15" }
    }, `-=${utils.msec2sec(100)}`);
    timeline.wave.to(this.logoParts["a"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "+=3", y: "+=15" }
    });

    timeline.wave.to(this.logoParts["n"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "+=3", y: "-=15" }
    }, `-=${utils.msec2sec(90)}`);
    timeline.wave.to(this.logoParts["n"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "-=3", y: "+=15" }
    });

    timeline.wave.to(this.logoParts["g"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "+=8", y: "+=12" }
    }, `-=${utils.msec2sec(80)}`);
    timeline.wave.to(this.logoParts["g"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "-=8", y: "-=12" }
    });

    timeline.wave.to(this.logoParts["e"], {
      duration: utils.msec2sec(80),
      ease: "easeOutElastic",
      pixi: { x: "+=12", y: "+=8" }
    }, `-=${utils.msec2sec(70)}`);
    timeline.wave.to(this.logoParts["e"], {
      duration: utils.msec2sec(40),
      ease: "easeInElastic",
      pixi: { x: "-=12", y: "-=8" }
    });

    timeline.loop.add(timeline.zoom);
    timeline.loop.add(timeline.wave);
    timeline.loop.play();
  }
}

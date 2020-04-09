import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { ResultData } from "models";
import { Scene } from "views";

export class ResultScene extends Scene {
  private resultData : ResultData;
  private textures   : any;
  private bgMsgHead  : PIXI.NineSlicePlane;
  private txt        : { [key : string] : PIXI.Text };

  public constructor(resultData: ResultData) {
    super();

    this.resultData = resultData;
    this.textures   = this.assetData.load("textures");
    this.bgMsgHead  = new PIXI.NineSlicePlane(this.textures["bg_content_text"], 16, 16, 16, 16);

    this.txt = {};
    this.el  = {
      msgFoot   : utils.createSprite(this.textures[this.resultData.data.eval.labelPath]),
      outroImg  : utils.createSprite(this.textures["img_intro_beyooooonds"]),
    };
    this.rect = {
      background  : utils.createRect("bg", conf.canvas_width, conf.canvas_height, conf.color.black),
      coverResult : utils.createRect("coverResult", conf.canvas_width, conf.canvas_height),
      coverOutro  : utils.createRect("coverOutro", conf.canvas_width, conf.canvas_height),
    };
    utils.setNameToObj(this.rect);
    conf.root_el.classList.add("bg-black");

    const initialize = () => {
      this.initLayout();
    };

    if (!this.sound.isLoaded) {
      document.addEventListener("click", () => {
        this.sound.initSound();
        initialize();
      }, { once: true });
      return;
    }

    initialize();
  }

  private makeMsgHead(): void {
    const msgHeadStr = this.resultData.data.eval.from;

    this.txt["msgHead"] = new PIXI.Text(msgHeadStr, {
      fill: conf.color.black,
      align: "center",
      fontFamily: conf.font.family,
      fontSize: 24,
    });
    this.txt.msgHead.position.set(16, 6);

    this.bgMsgHead.width = this.txt.msgHead.width + 32;
    this.bgMsgHead.height = this.txt.msgHead.height + 24;
    this.bgMsgHead.position.set(40, 200);
    this.bgMsgHead.addChild(this.txt.msgHead);

    this.bgMsgHead.alpha = 0;
  }

  private makeMsgBody(): void {
    const msgBodyStr = this.resultData.data.eval.comment;

    this.txt["msgBody"] = new PIXI.Text(msgBodyStr, {
      fill: conf.color.white,
      fontFamily: conf.font.family,
      fontSize: 32,
    });
    
    this.txt.msgBody.pivot.set(this.txt.msgBody.width / 2, this.txt.msgBody.height / 2);
    this.txt.msgBody.position.set(utils.display.centerX, utils.display.centerY);
    
    this.txt.msgBody.alpha = 0;
  }

  private makeMsgFoot(): void {
    this.el.msgFoot.pivot.set(this.el.msgFoot.width, this.el.msgFoot.height);
    this.el.msgFoot.scale.set(2, 2);
    this.el.msgFoot.position.set(conf.canvas_width - 40, conf.canvas_height - 200);

    this.el.msgFoot.alpha = 0;
  }

  private showOutro(): void {
    this.container = new PIXI.Container();
    this.container.name = "container";

    this.el.outroImg.scale.set(2, 2);
    this.el.outroImg.pivot.set(this.el.outroImg.width / 4, this.el.outroImg.height / 4);
    this.el.outroImg.position.set(utils.display.centerX, utils.display.centerY);

    const msgOutroStr = this.resultData.data.outro.comment;
    
    this.txt["msgOutro"] = new PIXI.Text(msgOutroStr, {
      fill: conf.color.white,
      fontFamily: conf.font.family,
      fontSize: 24,
      align: "center",
    });
    this.txt.msgOutro.pivot.set(this.txt.msgOutro.width / 2, 0);
    this.txt.msgOutro.position.set(utils.display.centerX, this.el.outroImg.y + (this.el.outroImg.height/2) + 30);
    this.rect.coverOutro.interactive = this.rect.coverOutro.buttonMode = true;

    this.sound.play("jingle", this.resultData.data.outro.jinglePath);
    this.attachEvent();
    this.container.addChild(this.el.outroImg, this.txt.msgOutro, this.rect.coverOutro);
    this.game.stage.addChild(this.container);
  }

  private initLayout(): void {
    this.makeMsgHead();
    this.makeMsgBody();
    this.makeMsgFoot();

    this.rect.coverResult.interactive = this.rect.coverResult.buttonMode = true;
    this.game.stage.addChildAt(this.rect.background, 0);
    this.container.addChild(this.bgMsgHead, this.txt.msgBody, this.el.msgFoot, this.rect.coverResult);

    this.playResultTimeline();
    this.game.ticker.start();
  }

  private playResultTimeline(): void {
    const completeFn = () => {
      this.rect.coverResult.addListener("pointerdown", () => {
        gsap.to(this.container, {
          duration: utils.msec2sec(100),
          pixi: { alpha: 0 },
          onComplete: () => {

            this.sound.bgm[this.resultData.data.eval.bgmPath].fade(1, 0, 200);
            this.container.destroy({ children: true });
            this.showOutro();
          }
        });
      });
    };
    const timeline = gsap.timeline({
      onComplete: completeFn
    });

    timeline.to(this.bgMsgHead, {
      delay: utils.msec2sec(750),
      duration: utils.msec2sec(10),
      ease: "linear",
      onStart: () => this.sound.play("se", "eval_from"),
      pixi: { alpha: 1 }
    });
    timeline.to(this.txt.msgBody, {
      delay: utils.msec2sec(1250),
      duration: utils.msec2sec(10),
      ease: "linear",
      onStart: () => this.sound.play("se", "eval_msg"),
      pixi: { alpha: 1 }
    });
    timeline.to(this.el.msgFoot, {
      delay: utils.msec2sec(1650),
      duration: utils.msec2sec(10),
      ease: "linear",
      onStart: () => this.sound.play("se", this.resultData.data.eval.sePath),
      onComplete: (() => {
        setTimeout(() => {
          this.sound.play("bgm", this.resultData.data.eval.bgmPath);
        }, 500);
      }),
      pixi: { alpha: 1 }
    });
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("next_scene_name");

    this.rect.coverOutro.addListener("pointerdown", () => {
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          conf.root_el.classList.remove("bg-black");
          this.rect.background.destroy();
          this.destroy();
          this.game.route(nextSceneName);
        }
      });
    });
  }
}

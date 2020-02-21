import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Scene } from "views";

export class ResultScene extends Scene {
  private textures  : any;
  private bgMsgHead : PIXI.NineSlicePlane;
  private txt       : { [key : string] : PIXI.Text };

  public constructor() {
    super();

    this.textures  = this.assetData.load("textures");
    this.bgMsgHead = new PIXI.NineSlicePlane(this.textures["ui_bg_text_slice.png"], 16, 16, 16, 16);
    
    this.txt = {};
    this.el  = {
      // result : utils.createSprite(this.textures["result_grade_low.png"]),
      // result : utils.createSprite(this.textures["result_grade_mid.png"]),
      msgFoot   : utils.createSprite(this.textures["result_grade_high.png"]),
      outroImg  : utils.createSprite(this.textures["tmp_result.png"]),
    };
    this.rect = {
      background  : utils.createRect(conf.canvas_width, conf.canvas_height, conf.color.black),
      coverResult : utils.createRect(conf.canvas_width, conf.canvas_height),
      coverOutro  : utils.createRect(conf.canvas_width, conf.canvas_height),
    };
    utils.setNameToObj(this.rect);

    this.initLayout();
    this.attachEvent();
  }

  private makeMsgHead(): void {
    const msgHeadStr = "にしお いしん より";

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
    const msgBodyStr = "う〜ん まぁまぁ かな 。｡・･.．\nでも 気分 は 上々！";

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
    this.el.msgFoot.position.set(conf.canvas_width - 40, conf.canvas_height - 200);

    this.el.msgFoot.alpha = 0;
  }

  private playResultTimeline(): void {
    gsap.timeline()
        .to(this.bgMsgHead, {
          delay: utils.msec2sec(750),
          duration: utils.msec2sec(10),
          ease: "linear",
          onStart: () => this.sound.play("se", "po"),
          pixi: { alpha: 1 }
        })
        .to(this.txt.msgBody, {
          delay: utils.msec2sec(1250),
          duration: utils.msec2sec(10),
          ease: "linear",
          onStart: () => this.sound.play("se", "puin"),
          pixi: { alpha: 1 }
        })
        .to(this.el.msgFoot, {
          delay: utils.msec2sec(1650),
          duration: utils.msec2sec(10),
          ease: "linear",
          onStart: () => this.sound.play("se", "spring"),
          pixi: { alpha: 1 }
        })
    ;
  }

  private showOutro(): void {
    this.container = new PIXI.Container();
    this.container.name = "container";

    this.el.outroImg.pivot.set(this.el.outroImg.width / 2, this.el.outroImg.height / 2);
    this.el.outroImg.position.set(utils.display.centerX, utils.display.centerY);

    const msgOutroStr = "あぁ〜 いっぱい 出た";
    
    this.txt["msgOutro"] = new PIXI.Text(msgOutroStr, {
      fill: conf.color.white,
      fontFamily: conf.font.family,
      fontSize: 24,
      align: "center",
    });
    this.txt.msgOutro.pivot.set(this.txt.msgOutro.width / 2, 0);
    this.txt.msgOutro.position.set(utils.display.centerX, this.el.outroImg.y + (this.el.outroImg.height/2) + 30);
    this.rect.coverOutro.interactive = this.rect.coverOutro.buttonMode = true;

    this.sound.play("se", "poiiiiin");
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

  private attachEvent(): void {
    const nextSceneName = this.userData.load("nextSceneName");

    this.rect.coverResult.addListener("pointerdown", () => {
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          this.container.destroy({ children: true });
          this.showOutro();
        }
      });
    });

    this.rect.coverOutro.addListener("pointerdown", () => {
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          this.rect.background.destroy();
          this.destroy();
          this.game.route(nextSceneName);
        }
      });
    });

  }
}

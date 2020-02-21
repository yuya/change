import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Howl, Howler } from "howler";
import { Scene } from "views";

export class ResultScene extends Scene {
  private textures  : any;
  private bgMsgFrom : PIXI.NineSlicePlane;
  private txt       : { [key : string] : PIXI.Text };

  public constructor() {
    super();

    this.textures  = this.assetData.load("textures");
    this.bgMsgFrom = new PIXI.NineSlicePlane(this.textures["ui_bg_text_slice.png"], 16, 16, 16, 16);
    
    this.txt = {};
    this.el  = {
      // result : utils.createSprite(this.textures["result_grade_low.png"]),
      // result : utils.createSprite(this.textures["result_grade_mid.png"]),
      result : utils.createSprite(this.textures["result_grade_high.png"]),
    };
    this.rect = {
      bg    : utils.createRect(conf.canvas_width, conf.canvas_height, 0x222222),
      cover : utils.createRect(conf.canvas_width, conf.canvas_height),
    };

    this.initLayout();
    this.attachEvent();
  }

  private initLayout(): void {
    const msgFromStr = "にしお いしん より";
    const msgBodyStr = "う〜ん まぁまぁ かな ...\nでも 気分 は 上々！";

    this.txt["msgFrom"] = new PIXI.Text(msgFromStr, {
      fill: 0x222222,
      fontFamily: "Nu Kinako Mochi Ct",
      fontSize: 24,
      align: "center",
    });
    this.txt.msgFrom.position.set(16, 6);

    this.bgMsgFrom.width = this.txt.msgFrom.width + 32;
    this.bgMsgFrom.height = this.txt.msgFrom.height + 24;
    this.bgMsgFrom.position.set(40, 200);
    this.bgMsgFrom.addChild(this.txt.msgFrom);

    this.txt["msgBody"] = new PIXI.Text(msgBodyStr, {
      fill: 0xFFFFFF,
      fontFamily: "Nu Kinako Mochi Ct",
      fontSize: 32,
    });
    this.txt.msgBody.pivot.set(this.txt.msgBody.width / 2, this.txt.msgBody.height / 2);
    this.txt.msgBody.position.set(utils.display.centerX, utils.display.centerY);

    this.el.result.pivot.set(this.el.result.width, this.el.result.height);
    this.el.result.position.set(conf.canvas_width - 40, conf.canvas_height - 200);
    // this.el.resultImg.pivot.set(this.el.resultImg.width / 2, this.el.resultImg.height / 2);
    // this.el.resultImg.width *= 2;
    // this.el.resultImg.height *= 2;
    // this.el.resultImg.position.set(utils.display.centerX, utils.display.centerY);
    // this.rect.cover.interactive = this.rect.cover.buttonMode = true;

    this.container.addChild(this.rect.bg, this.bgMsgFrom, this.txt.msgBody, this.el.result, this.rect.cover);
    this.game.ticker.start();
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("nextSceneName");
    const bgm = new Howl({
      src: "/assets/audio/bgm_title.mp3",
      loop: true
    });
    const clickSe = new Howl({
      src: "/assets/audio/se_spring.mp3"
      // onend: () => {
      //   bgm.fade(1, 0, 500);
      // }
    });

    this.rect.cover.addListener("pointerdown", () => {
      clickSe.play();
      setTimeout(() => {
        bgm.fade(1, 0, 750);
      }, 1250);
      gsap.to(this.container, {
        duration: utils.msec2sec(100),
        pixi: { alpha: 0 },
        onComplete: () => {
          this.destroy();
          this.game.route(nextSceneName);
        }
      });
    });

    bgm.play();
  }
}

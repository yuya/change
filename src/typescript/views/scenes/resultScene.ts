import { gsap } from "gsap";
import { conf } from "conf";
import { utils } from "utils";
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
      outro  : utils.createSprite(this.textures["tmp_result.png"]),
    };
    this.rect = {
      background  : utils.createRect(conf.canvas_width, conf.canvas_height, utils.color.black),
      coverResult : utils.createRect(conf.canvas_width, conf.canvas_height),
      coverOutro  : utils.createRect(conf.canvas_width, conf.canvas_height),
    };
    utils.setNameToObj(this.rect);

    this.initLayout();
    this.attachEvent();
  }

  private showResult(): void {
    const msgFromStr = "にしお いしん より";
    const msgBodyStr = "う〜ん まぁまぁ かな 。｡・･.．\nでも 気分 は 上々！";

    this.txt["msgFrom"] = new PIXI.Text(msgFromStr, {
      fill: utils.color.black,
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
      fill: utils.color.white,
      fontFamily: "Nu Kinako Mochi Ct",
      fontSize: 32,
    });
    this.txt.msgBody.pivot.set(this.txt.msgBody.width / 2, this.txt.msgBody.height / 2);
    this.txt.msgBody.position.set(utils.display.centerX, utils.display.centerY);

    this.el.result.pivot.set(this.el.result.width, this.el.result.height);
    this.el.result.position.set(conf.canvas_width - 40, conf.canvas_height - 200);
    this.rect.coverResult.interactive = this.rect.coverResult.buttonMode = true;

    this.game.stage.addChildAt(this.rect.background, 0);
    this.container.addChild(this.bgMsgFrom, this.txt.msgBody, this.el.result, this.rect.coverResult);
  }

  private showOutro(): void {
    this.container = new PIXI.Container();
    this.container.name = "container";

    this.el.outro.pivot.set(this.el.outro.width / 2, this.el.outro.height / 2);
    this.el.outro.position.set(utils.display.centerX, utils.display.centerY);

    const msgOutroStr = "あぁ〜 いっぱい 出た";
    
    this.txt["msgOutro"] = new PIXI.Text(msgOutroStr, {
      fill: utils.color.white,
      fontFamily: "Nu Kinako Mochi Ct",
      fontSize: 24,
      align: "center",
    });
    this.txt.msgOutro.pivot.set(this.txt.msgOutro.width / 2, 0);
    this.txt.msgOutro.position.set(utils.display.centerX, this.el.outro.y + (this.el.outro.height/2) + 30);
    this.rect.coverOutro.interactive = this.rect.coverOutro.buttonMode = true;

    this.container.addChild(this.el.outro, this.txt.msgOutro, this.rect.coverOutro);
    this.game.stage.addChild(this.container);
  }

  private initLayout(): void {
    this.showResult();
    this.game.ticker.start();
  }

  private attachEvent(): void {
    const nextSceneName = this.userData.load("nextSceneName");

    this.rect.coverResult.addListener("pointerdown", () => {
      this.sound.play("se", "po");

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
      this.sound.play("se", "po");

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

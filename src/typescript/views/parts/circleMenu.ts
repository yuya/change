import * as PIXI from "pixi.js";
import gsap from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { Howl, Howler } from "howler"
import { GameController } from "controllers/gameController";

export class CircleMenu {
  public element    : PIXI.Container;

  private game      : GameController;
  private textures  : any;
  private circles   : PIXI.Sprite[];
  private state     : { [key : string] : any };
  private pos       : { [key : string] : number };
  private idx       : { [key : string] : number };
  private deg       : { [key : string] : any };
  private direction : number[];
  private fn        : { [key : string] : any };

  public constructor() {
    this.element = new PIXI.Container();
    this.element.name = "circle_menu";

    this.game     = GameController.instance;
    this.textures = this.game.assetData.load("textures");
    this.circles  = [
      utils.createSprite(this.textures["ui_tunk.png"]),
      utils.createSprite(this.textures["ui_chat.png"]),
      utils.createSprite(this.textures["ui_beyo.png"]),
      utils.createSprite(this.textures["ui_menu_4.png"]),
      utils.createSprite(this.textures["ui_menu_5.png"]),
      utils.createSprite(this.textures["ui_prof.png"]),
      utils.createSprite(this.textures["ui_tunk.png"]),
      utils.createSprite(this.textures["ui_chat.png"]),
      utils.createSprite(this.textures["ui_beyo.png"]),
      utils.createSprite(this.textures["ui_menu_4.png"]),
      utils.createSprite(this.textures["ui_menu_5.png"]),
      utils.createSprite(this.textures["ui_prof.png"])
    ];

    this.state = {};
    this.pos   = {
      currentX : 0,
      currentY : 0,
      startX   : undefined,
      startY   : undefined,
      baseX    : undefined,
      baseY    : undefined
    };
    this.idx = {
      now : 0,
      mid : this.circles.length / 2,
      max : this.circles.length
    };
    this.deg = {
      min      : -180,
      max      : 180,
      current  : 0,
      distance : 360 * (1 / this.idx.max)
    };
    this.direction = [0, 0];
    this.fn  = {
      onTouchStart : (event) => this.onTouchStart(event),
      onTouchMove  : (event) => this.onTouchMove(event),
      onTouchEnd   : (event) => this.onTouchEnd(event),
      onClick      : (event) => this.onClick(event)
    };

    this.initLayout();
    this.element.addListener("pointerdown", this.fn.onTouchStart, this.element);
  }

  private initLayout(): void {
    // TODO
    const startDeg     : number = -89.530;
    const circleRadius : number = 64;
    const menutMargin  : number = -40;
    const menuRadius   : number = (conf.canvas_width - circleRadius*2 - menutMargin*2) / 2;
    const pi2          : number = Math.PI * 2;

    this.element.width = conf.canvas_width;
    this.element.height = conf.canvas_height;
    this.element.pivot.set(conf.canvas_width / 2, conf.canvas_height / 2);

    this.circles.forEach((circle, index) => {
      const cos = Math.cos(startDeg+index/this.idx.max * pi2);
      const sin = Math.sin(startDeg+index/this.idx.max * pi2);

      circle.pivot.set(circleRadius, circleRadius);
      circle.width = circle.height = circleRadius * 2;
      circle.x     = menuRadius*cos + utils.display.centerX;
      circle.y     = menuRadius*sin + utils.display.centerY;
      // if (index > 5) { circle.alpha = 0.75 }

      circle.rotation = this.deg.distance*index * PIXI.DEG_TO_RAD;
      this.element.addChild(circle);
    });

    this.element.x = conf.canvas_width / 2;
    this.element.y = conf.canvas_height / 2;

    this.element.interactive = this.element.buttonMode = true;
    this.element.y = conf.canvas_height + (this.element.height/4.5);
  }

  private getIndex() {
    this.deg.current = this.element.rotation;
    let newIndex = this.deg.current*PIXI.RAD_TO_DEG / this.deg.distance;

    if (this.deg.current < 0 && this.deg.current > this.deg.min) {
      newIndex = Math.abs(newIndex);
    }
    else if (this.deg.current < 0 && this.deg.current < this.deg.min) {
      newIndex = 0;
    }
    else if (this.deg.current > 0 && this.deg.current < this.deg.max) {
      newIndex = this.idx.max - newIndex;
    }
    else if (this.deg.current > 0 && this.deg.current > this.deg.max) {
      newIndex = this.idx.max - 1;
    }

    newIndex = Math.round(newIndex);
    return (newIndex >= this.idx.max) ? 0 : newIndex;
  }

  public moveToIndex(index: number) {
    let idx, deg, callback;

    if (index < this.idx.mid) {
      idx = index;
      deg = -index * this.deg.distance;
    }
    else if (index >= this.idx.mid && this.direction[0] > 0) {
      idx = index - this.idx.mid;
      deg = (this.idx.max - index) * this.deg.distance;
      callback = () => {
        this.idx.now = idx;
        this.element.rotation = -(this.idx.now * this.deg.distance) * PIXI.DEG_TO_RAD;
      };
    }
    else if (index >= this.idx.mid && this.direction[0] < 0) {
      idx = index - this.idx.mid;
      deg = -index * this.deg.distance;
      callback = () => {
        this.idx.now = idx;
        this.element.rotation = -(this.idx.now * this.deg.distance) * PIXI.DEG_TO_RAD;
      };
    }
    else {
      idx = this.idx.max - index;
      deg = idx * this.deg.distance;
    }

    this.setAngle(deg, callback);
    this.idx.now = idx;
  }

  private setAngle(r: number, callback?: any) {
    let animParam: gsap.AnimationVars = {
      duration: 0.5,
      ease: "power2.out",
      pixi: {
        rotation: r
      },
      onComplete: () => {
        if (callback) { callback() }
        this.triggerEvent(this.game.renderer.view, "onmovecomplete", false, false, {
          "currentIndex" : this.idx.now
        });
      }
    };

    // if (callback) { animParam.onComplete = () => { callback() } }
    gsap.to(this.element, animParam);
    this.deg.current = this.element.rotation;
  }

  private addAngle(r: number) {
    const deg = r - this.element.rotation;

    gsap.to(this.element, {
      duration: 0.5,
      ease: "power2.out",
      pixi: {
        rotation: `+=${deg}`
      }
    });

    this.deg.current = this.element.rotation;
    this.idx.now = this.getIndex();
  }

  private triggerEvent(element: HTMLElement, eventName: string, bubbles: boolean, cancelable: boolean, data?: object) {
    let detail = {};

    if (data) {
      Object.keys(data).forEach((key, index) => {
        detail[key] = data[key];
      });
    }

    const event = new CustomEvent(eventName, {
      "detail": detail
    });
    element.dispatchEvent(event);
  }

  private onTouchStart(event): void {
    const posX = event.data.global.x;
    const posY = event.data.global.y;

    this.state.isScrolling = true;
    this.state.isMoveReady = false;

    this.pos.startX = this.pos.baseX = posX;
    this.pos.startY = this.pos.baseY = posY;

    this.element.addListener("pointermove", this.fn.onTouchMove, this.element);
    document.addEventListener("pointerup", this.fn.onTouchEnd, false);

    this.triggerEvent(this.game.renderer.view, "ontouchstart", false, false);
  }

  private onTouchMove(event): void {
    const posX = event.data.global.x;
    const posY = event.data.global.y;

    const getNewDeg = (distX, distY) => {
      let newX = this.pos.currentX + distX;
      let newY = this.pos.currentY + distY;

      // TODO
      // if (newX >= 0) { newX - Math.round(this.pos.currentX + distX / 3) }
      // if (newY >= 0) { newY - Math.round(this.pos.currentY + distY / 3) }
      if (newX >= 0) { newX - Math.round(this.pos.currentX + distX) }
      if (newY >= 0) { newY - Math.round(this.pos.currentY + distY) }


      return newX;
    };

    if (this.state.isMoveReady) {
      event.stopped = true;

      const distX  = posX - this.pos.baseX;
      const distY  = posY - this.pos.baseY;
      const newDeg = getNewDeg(distX, distY);

      if (distX) { this.direction[0] = distX < 0 ? -1 : 1 }
      if (distY) { this.direction[1] = distY < 0 ? -1 : 1 }

      this.addAngle(newDeg);
    }
    else {
      const deltaX = Math.abs(posX - this.pos.startX);
      const deltaY = Math.abs(posY - this.pos.startY);

      if (deltaX > 5 || deltaY > 5) {
        event.stopped = true;

        this.state.isMoveReady = true;
        document.addEventListener("click", this.fn.onClick, true);
      }
    }

    this.pos.baseX = posX;
    this.pos.baseY = posY;
    this.triggerEvent(this.game.renderer.view, "ontouchmove", false, false);
  }

  private onTouchEnd(event): void {
    this.element.removeListener("pointermove", this.fn.onTouchMove, this.element);
    document.removeEventListener("pointerup", this.fn.onTouchEnd, false);

    if (!this.state.isScrolling) {
      return;
    }

    this.state.isScrolling = false;
    this.idx.now = this.getIndex();
    this.moveToIndex(this.idx.now);

    setTimeout(() => {
      document.removeEventListener("click", this.fn.onClick, true);
    }, 200);
    this.triggerEvent(this.game.renderer.view, "ontouchend", false, false);
  }

  private onClick(event): void {
    event.stopped = true;
  }
}
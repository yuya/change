import * as PIXI from "pixi.js";
import gsap from "gsap";
import { conf } from "conf";
import { utils } from "utils";
import { GameController, SoundController } from "controllers";

export class CircleMenu {
  public element    : PIXI.Container;

  private game      : GameController;
  private sound     : SoundController;
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
    this.sound    = SoundController.instance;
    this.textures = this.game.assetData.load("textures");
    this.circles  = [
      utils.createSprite(this.textures["menu_history"]),
      utils.createSprite(this.textures["menu_credit"]),
      utils.createSprite(this.textures["menu_about"]),
      utils.createSprite(this.textures["menu_beyooooonds"]),
      utils.createSprite(this.textures["menu_profile"]),
      utils.createSprite(this.textures["menu_favorite"]),
      utils.createSprite(this.textures["menu_history"]),
      utils.createSprite(this.textures["menu_credit"]),
      utils.createSprite(this.textures["menu_about"]),
      utils.createSprite(this.textures["menu_beyooooonds"]),
      utils.createSprite(this.textures["menu_profile"]),
      utils.createSprite(this.textures["menu_favorite"]),
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
    const circleRadius : number = 64;
    const menuRadius   : number = conf.canvas_width / 2;
    const pi2          : number = Math.PI * 2;

    this.element.width = conf.canvas_width;
    this.element.height = conf.canvas_width;
    this.element.x = conf.canvas_width / 2;
    this.element.y = conf.canvas_height + 200;
    this.element.pivot.set(this.element.width / 2, this.element.height / 2);
    this.element.interactive = this.element.buttonMode = true;

    this.circles.forEach((circle, index) => {
      const cos = Math.cos(index/this.idx.max * pi2);
      const sin = Math.sin(index/this.idx.max * pi2);

      circle.anchor.set(0.5, 0.5);
      circle.width  = circleRadius*2;
      circle.height = circleRadius*2;
      circle.x = menuRadius*cos;
      circle.y = menuRadius*sin;
      circle.rotation = (this.deg.distance*(index+3)) * PIXI.DEG_TO_RAD;

      this.element.addChild(circle);
    });
  }

  private getIndex(): number {
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

  public moveToIndex(index: number): void {
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

  public moveToNext(): void {
    this.moveToIndex(this.idx.now + 1);
  }

  public moveToPrev(): void {
    this.moveToIndex(this.idx.now - 1);
  }

  private setAngle(r: number, callback?: any): void {
    let animParam: gsap.AnimationVars = {
      duration: 0.5,
      ease: "power2.out",
      pixi: {
        rotation: r
      },
      onComplete: () => {
        if (callback) { callback() }
        
        this.sound.se["select"].play();
        this.game.eventHandler.emit("onmovecomplete", {
          "currentIndex" : this.idx.now
        });
      }
    };

    // if (callback) { animParam.onComplete = () => { callback() } }
    gsap.to(this.element, animParam);
    this.deg.current = this.element.rotation;
  }

  private addAngle(r: number): void {
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

  private onTouchStart(event): void {
    const posX = event.data.global.x;
    const posY = event.data.global.y;

    this.state.isScrolling = true;
    this.state.isMoveReady = false;

    this.pos.startX = this.pos.baseX = posX;
    this.pos.startY = this.pos.baseY = posY;

    this.element.addListener("pointermove", this.fn.onTouchMove, this.element);
    document.addEventListener(utils.pointer.up, this.fn.onTouchEnd, false);

    this.game.eventHandler.emit("ontouchstart");
  }

  private onTouchMove(event): void {
    const posX = event.data.global.x;
    const posY = event.data.global.y;

    const getNewDeg = (distX, distY) => {
      let newX = this.pos.currentX + distX;
      let newY = this.pos.currentY + distY;

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
    this.game.eventHandler.emit("ontouchmove");
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
    this.game.eventHandler.emit("ontouchend");
  }

  private onClick(event): void {
    event.stopped = true;
  }
}

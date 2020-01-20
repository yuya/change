export class Env {
  public static userAgent: string = navigator.userAgent.toLowerCase();
  public static hasTouch: boolean = ("ontouchstart" in window);
  public static screenWidth: number = Math.min(window.innerWidth, document.body.clientWidth);
  public static screenHeight: number = window.innerHeight;
  public static pixelRatio: number = window.devicePixelRatio || 1;

  public static touchStart: string    = Env.hasTouch ? "touchstart"  : "mousedown";
  public static touchMove: string     = Env.hasTouch ? "touchmove"   : "mousemove";
  public static touchEnd: string      = Env.hasTouch ? "touchend"    : "mouseup";
  public static touchCancel: string   = Env.hasTouch ? "touchcancel" : "mouseleave";

  public static setScreenWidth(width: number): void {
    Env.screenWidth = width;
  }

  public static setScreenHeight(height: number): void {
    Env.screenHeight = height;
  }
}

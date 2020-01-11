export class Env {
  public static userAgent: string = navigator.userAgent.toLowerCase();
  public static hasTouch: boolean = ("ontouchstart" in window);
  public static screenWidth: number = Math.min(window.innerWidth, document.body.clientWidth);
  public static screenHeight: number = window.innerHeight;
  public static pixelRatio: number = window.devicePixelRatio || 1;

  public static setScreenWidth(width: number): void {
    Env.screenWidth = width;
  }

  public static setScreenHeight(height: number): void {
    Env.screenHeight = height;
  }
}

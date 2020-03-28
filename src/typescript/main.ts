import * as WebFont from "webfontloader";
import { conf } from "conf";
import { util } from "util";
import { GameController } from "controllers";
import { AssetData } from "models";

const gameController: GameController = GameController.instance;
const assetData: AssetData = AssetData.instance;
const loadTarget: { [key:string] : string } = {
  "spritePath"  : "/assets/json/spritesheet_ui.json",
  "animation"   : "/assets/json/spritesheet_anim.json",
  "beyooOoonds" : "/assets/json/ingame_beyooooonds.json",
};
const loadTargetArr: string[] = Object.keys(loadTarget).map((key) => {
  return loadTarget[key];
});

const init = (): void => {
  const _hideSpinner = () => {
    conf.spinner_el.classList.add("hide");
  };

  const _routeScene = (): void => {
    const regex   = /\/(\w+)/;
    const matched = location.pathname.match(regex);

    gameController.route(matched ? matched[1] : "");
  };

  const _loadWebFont = (): void => {
    WebFont.load({
      custom: {
        families: ["Nu Kinako Mochi", "JF Dot M+H 10"]
      },
      active: () => {
        _hideSpinner();
        _routeScene();
      }
    });
  };

  gameController.loader
    .add(loadTargetArr)
    .load((loader, resources) => {
      assetData.save("textures", resources[loadTarget.spritePath].spritesheet.textures);
      assetData.save("animation", resources[loadTarget.animation]);
      assetData.save("beyooOoondsData", resources[loadTarget.beyooOoonds].data["data"]);

      _loadWebFont();
      // _hideSpinner();
      // _routeScene();
    })
  ;
};

window.addEventListener("DOMContentLoaded", init, false);

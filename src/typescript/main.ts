import * as WebFont from "webfontloader";
import { conf } from "conf";
import { util } from "util";
import { GameController } from "controllers";
import { UserData, AssetData } from "models";

const gameController: GameController = GameController.instance;
const userData: UserData = UserData.instance;
const assetData: AssetData = AssetData.instance;
const loadTarget: { [key:string] : string } = {
  "spriteSheetUi"   : "/assets/json/spritesheet_ui.json",
  "spriteSheetAnim" : "/assets/json/spritesheet_anim.json",
  "spriteSheetDom"  : "/assets/json/spritesheet_dom.json",
  "beyooOoonds"     : "/assets/json/ingame_beyooooonds.json",
};
const loadTargetArr: string[] = Object.keys(loadTarget).map((key) => {
  return loadTarget[key];
});

const init = (): void => {
  const _hideSpinner = () => {
    document.body.removeChild(conf.spinner_el);
    // conf.spinner_el.classList.add("hide");
  };

  const _setVolume = () => {
    const isMuteVolume = userData.load("is_mute_volume");

    if (isMuteVolume == null || isMuteVolume === true) {
      Howler.mute(true);
    }
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
        _setVolume();
        _hideSpinner();
        _routeScene();
      }
    });
  };

  gameController.loader
    .add(loadTargetArr)
    .load((loader, resources) => {
      assetData.save("textures", resources[loadTarget.spriteSheetUi].spritesheet.textures);
      assetData.save("spriteSheetUi", resources[loadTarget.spriteSheetUi]);
      assetData.save("animation", resources[loadTarget.spriteSheetAnim]);
      assetData.save("beyooOoondsData", resources[loadTarget.beyooOoonds].data["data"]);
      assetData.save("spriteSheetDom", resources[loadTarget.spriteSheetDom]);

      _loadWebFont();
      // _hideSpinner();
      // _routeScene();
    })
  ;
};

window.addEventListener("DOMContentLoaded", init, false);

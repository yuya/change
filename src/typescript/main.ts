import * as WebFont from "webfontloader";
import { conf } from "conf";
import { util } from "util";
import { GameController } from "controllers/gameController";
import { AssetData } from "models";

const gameController = GameController.instance;
const assetData      = AssetData.instance;
const spritePath     = "/assets/spritesheet.json";

const init = () => {
  const _hideSpinner = () => {
    const spinner = conf.spinner_el;
    spinner.style.display = "none";
  };

  const _routeScene = () => {
    const regex   = /\/(\w+)/;
    const matched = location.pathname.match(regex);

    gameController.route(matched ? matched[1] : "");
  };

  const _loadWebFont = () => {
    WebFont.load({
      custom: {
        // families: ["MisakiGothic2nd", "Nu Kinako Mochi Ct", "Pixel-Mplus"]
        families: ["Nu Kinako Mochi Ct"]
        // urls: ["/assets/style.css"]
      },
      active: () => {
        _hideSpinner();
        _routeScene();
      }
    });
  };

  gameController.loader
    .add(spritePath)
    .load((loader, resources) => {
      assetData.save("textures", resources[spritePath].spritesheet.textures);
      _loadWebFont();
      // _hideSpinner();
      // _routeScene();
    })
  ;
};

window.addEventListener("DOMContentLoaded", init, false);

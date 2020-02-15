import { CONST } from "config";
import { GameController } from "controllers/gameController";
import { AssetData } from "models/assetData";

const gameController = GameController.instance;
const assetData      = AssetData.instance;
const spritePath     = "/assets/texture.json";

const init = () => {
  const _hideSpinner = () => {
    const spinner = CONST.SPINNER_EL;
    spinner.style.display = "none";
  };

  const _routeScene = () => {
    const regex   = /\/(\w+)/;
    const matched = location.pathname.match(regex);

    gameController.route(matched ? matched[1] : "");
  };

  gameController.loader
    .add(spritePath)
    .load((loader, resources) => {
      assetData.save("textures", resources[spritePath].spritesheet.textures);

      _hideSpinner();
      _routeScene();
    })
  ;
};

window.addEventListener("DOMContentLoaded", init, false);

import { CONST } from "./config";
import { SceneController } from "./controllers/sceneController";

const init = () => {
  const sceneController = SceneController.instance;
  const _hideSpinner = () => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", _hideSpinner, false);
      return;
    }

    const spinner = CONST.SPINNER_EL;
    spinner.style.display = "none";
  };

  const _routeScene = () => {
    const regex   = /^#!(\w+)/;
    const matched = location.hash.match(regex);

    sceneController.route(matched ? matched[1] : "boot");
  };

  _hideSpinner();
  _routeScene();
};

window.addEventListener("load", init, false);

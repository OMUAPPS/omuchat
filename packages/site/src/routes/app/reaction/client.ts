import { ASSET_UPLOAD_PERMISSION_ID } from "@omujs/omu/extension/asset/asset-extension.js";
import { setClient } from "@omujs/ui";
import { BROWSER } from "esm-env";
import getApp from "./app.js";
import { Omu } from "@omujs/omu";

const app = getApp(BROWSER ? window.location.origin : "");
export const omu = new Omu(app);
setClient(omu);

omu.permissions.require(
  ASSET_UPLOAD_PERMISSION_ID,
  "com.omuapps:chatprovider/youtube/reaction",
);

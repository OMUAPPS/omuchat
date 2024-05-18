import { App } from "@omujs/omu";
import { Identifier } from "@omujs/omu/identifier.js";
import type { TagKey } from "../category.js";

export const IDENTIFIER = new Identifier("com.omuapps", "playqueue");

export default function getApp(origin: string) {
  return new App(IDENTIFIER, {
    url: origin + "/app/playqueue",
    metadata: {
      locale: "en",
      name: "Play Queue",
      icon: "player-track-next",
      tags: ["tool"] as TagKey[],
    },
  });
}

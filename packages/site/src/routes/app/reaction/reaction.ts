import { createRegistryStore } from "$lib/helper.js";
import { RegistryType } from "@omujs/omu/extension/registry/index.js";
import { SignalType, type Signal } from "@omujs/omu/extension/signal/signal.js";
import { Identifier } from "@omujs/omu/identifier.js";
import type { Writable } from "svelte/store";
import { IDENTIFIER } from "./app.js";
import type { Omu } from "@omujs/omu";

const PROVIDER_IDENTIFIER = new Identifier("com.omuapps", "chatprovider");
const YOUTUBE_IDENTIFIER = PROVIDER_IDENTIFIER.join("youtube");

type ReactionMessage = {
  room_id: string;
  reactions: {
    [key: string]: number;
  };
};

const REACTION_SIGNAL_TYPE = SignalType.createJson<ReactionMessage>(
  YOUTUBE_IDENTIFIER,
  {
    name: "reaction",
  },
);

type ReactionReplaceRegistry = Record<string, string | null>;

const REACTION_REPLACE_REGISTRY_TYPE =
  RegistryType.createJson<ReactionReplaceRegistry>(IDENTIFIER, {
    name: "reaction_replace",
    defaultValue: {
      "❤": null,
      "😄": null,
      "🎉": null,
      "😳": null,
      "💯": null,
    },
  });

export class ReactionApp {
  public readonly reactionSignal: Signal<ReactionMessage>;
  public readonly replaces: Writable<ReactionReplaceRegistry>;

  constructor(private readonly omu: Omu) {
    this.reactionSignal = omu.signal.get(REACTION_SIGNAL_TYPE);
    this.replaces = createRegistryStore(omu, REACTION_REPLACE_REGISTRY_TYPE);
  }

  public send(roomId: string, reactions: Record<string, number>) {
    this.reactionSignal.notify({
      room_id: roomId,
      reactions,
    });
  }
}

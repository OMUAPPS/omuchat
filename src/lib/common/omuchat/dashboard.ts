import type { Client } from "@omuchatjs/chat";
import { ModelTableType, type Table } from "@omuchatjs/omu/extension/table/table.js";

import { Identifier } from "@omuchatjs/omu/identifier.js";
import { Asset } from "./asset.js";
import { ChatApp } from "./chatapp.js";

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:dashboard');

export const AppsTableKey = ModelTableType.of(IDENTIFIER, {
    name: "apps",
    model: ChatApp
});
export const AssetsTableKey = ModelTableType.of(IDENTIFIER, {
    name: "assets",
    model: Asset
});

export class Dashboard {
    readonly apps: Table<ChatApp>;
    readonly assets: Table<Asset>;

    constructor(
        client: Client
    ) {
        this.apps = client.omu.tables.get(AppsTableKey);
        this.assets = client.omu.tables.get(AssetsTableKey);
    }
}

import type { Client } from "@omuchatjs/chat";
import { TableType, type Table } from "@omuchatjs/omu/extension/table/table.js";

import { Identifier } from "@omuchatjs/omu/identifier.js";
import { Asset } from "./asset.js";
import { AppMetadata } from "./app-metadata.js";

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:dashboard');

export const AppsTableKey = TableType.model(IDENTIFIER, {
    name: "apps",
    model: AppMetadata
});
export const AssetsTableKey = TableType.model(IDENTIFIER, {
    name: "assets",
    model: Asset
});

export class Dashboard {
    readonly apps: Table<AppMetadata>;
    readonly assets: Table<Asset>;

    constructor(
        client: Client
    ) {
        this.apps = client.omu.tables.get(AppsTableKey);
        this.assets = client.omu.tables.get(AssetsTableKey);
    }
}

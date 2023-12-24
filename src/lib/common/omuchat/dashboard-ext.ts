import { App, ExtensionInfo, ModelTableType, TableExtensionType, defineExtensionType, type AppJson, type Client, type Extension, type Table } from "@omuchat/omu.js";

import { Asset, type AssetJson } from "./asset";

export const DashboardExtensionType = defineExtensionType({
    info: ExtensionInfo.create("dashboard"),
    create: (client: Client) => new DashboardExtension(client),
    dependencies: () => [TableExtensionType],
});
export const AppsTableKey = ModelTableType.ofExtension<App, AppJson>(DashboardExtensionType, {
    name: "apps",
    model: App
});
export const AssetsTableKey = ModelTableType.ofExtension<Asset, AssetJson>(DashboardExtensionType, {
    name: "assets",
    model: Asset
});

export class DashboardExtension implements Extension {
    apps: Table<App>;
    assets: Table<Asset>;

    constructor(client: Client) {
        client.addListener(this);
        const listExtension = client.extensions.get(TableExtensionType);
        this.apps = listExtension.register(AppsTableKey);
        this.assets = listExtension.register(AssetsTableKey);
    }
}
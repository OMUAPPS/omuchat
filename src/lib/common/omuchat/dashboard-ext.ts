import { App, ExtensionInfo, ModelTableType, Serializer, TableExtensionType, TableInfo, defineExtensionType, type AppJson, type Client, type Extension, type Table } from "@omuchat/omu.js";

import { Asset, type AssetJson } from "./asset";

export const DashboardExtensionType = defineExtensionType(ExtensionInfo.create("dashboard"), (client: Client) => new DashboardExtension(client), () => [TableExtensionType]);
export const AppsTableKey = new ModelTableType<App, AppJson>(TableInfo.create(DashboardExtensionType, "apps"), Serializer.model(App.fromJson));
export const AssetsTableKey = new ModelTableType<Asset, AssetJson>(TableInfo.create(DashboardExtensionType, "assets"), Serializer.model(Asset.fromJson));

export class DashboardExtension implements Extension {
    apps: Table<App>;
    assets: Table<Asset>;

    constructor(client: Client) {
        client.addListener(this);
        const listExtension = client.extensions.get(TableExtensionType);
        this.apps = listExtension.register(AppsTableKey);
        this.assets = listExtension.register(AssetsTableKey);
    }

    onInitialized(): void {
        console.log("DashboardExtension initialized");
    }
}
import { App, TableExtensionType, defineExtensionType, defineTableTypeModel, type AppJson, type Client, type Extension, type Table } from "@omuchat/client";

export const DashboardExtensionType = defineExtensionType("dashboard", (client: Client) => new DashboardExtension(client), () => [TableExtensionType]);
export const AppsTableKey = defineTableTypeModel<App, AppJson>(DashboardExtensionType, "apps", (data) => new App(data));
export const AssetsTableKey = defineTableTypeModel<App, AppJson>(DashboardExtensionType, "assets", (data) => new App(data));

export class DashboardExtension implements Extension {
    apps: Table<App>;
    assets: Table<App>;
    
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
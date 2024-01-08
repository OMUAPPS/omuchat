import type { Client, ClientListener } from "@omuchat/omu.js";
import { defineExtensionType, type Extension } from "@omuchat/omu.js/extension/extension.js";
import { TableExtensionType } from "@omuchat/omu.js/extension/table/table-extension.js";
import { ModelTableType, type Table } from "@omuchat/omu.js/extension/table/table.js";

import { Asset } from "./asset.js";
import { ChatApp } from "./chatapp.js";

export const DashboardExtensionType = defineExtensionType('dashboard', {
    create: (client: Client) => new DashboardExtension(client),
    dependencies: () => [TableExtensionType],
});
export const AppsTableKey = ModelTableType.ofExtension(DashboardExtensionType, {
    name: "apps",
    model: ChatApp
});
export const AssetsTableKey = ModelTableType.ofExtension(DashboardExtensionType, {
    name: "assets",
    model: Asset
});

export class DashboardExtension implements Extension, ClientListener {
    apps: Table<ChatApp>;
    assets: Table<Asset>;

    constructor(client: Client) {
        const listExtension = client.extensions.get(TableExtensionType);
        this.apps = listExtension.register(AppsTableKey);
        this.assets = listExtension.register(AssetsTableKey);
        client.addListener(this);
    }

    onReady(): void {
        this.apps.add(ChatApp.fromJson({
            id: "emoji",
            url: "/apps/emoji",
            tags: []
        }));
        this.assets.add(Asset.fromJson({
            id: "comment-simple",
            thumbnail: "/img/assets/comment-thumbnail.png",
            url: "/assets/comment",
            tags: []
        }));
        this.assets.add(Asset.fromJson({
            id: "youtube-reaction",
            thumbnail: "/img/assets/youtube-reaction-thumbnail.png",
            url: "/assets/youtube-reaction",
            settingsUrl: "/assets/youtube-reaction/settings",
            tags: []
        }));
    }
}

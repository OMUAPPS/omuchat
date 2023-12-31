import { ExtensionInfo, ModelTableType, TableExtensionType, defineExtensionType, type Client, type ClientListener, type Extension, type Table } from "@omuchat/omu.js";

import { Asset } from "./asset";
import { ChatApp } from "./chatapp";

export const DashboardExtensionType = defineExtensionType({
    info: ExtensionInfo.create("dashboard"),
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
        this.apps.add(ChatApp.fromJson({
            id: "youtube-reaction",
            url: "/apps/youtube-reaction",
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
            tags: []
        }));
    }
}

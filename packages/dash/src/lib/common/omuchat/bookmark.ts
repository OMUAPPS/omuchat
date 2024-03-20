import type { Model } from "@omuchatjs/omu/extension/table/model.js";
import type { Keyable } from "@omuchatjs/omu/interface.js";

type BookmarkData = {
    readonly messageId: string;
    readonly addedAt: string; // ISO 8601
};

export class BookmarkEntry implements Model<BookmarkData>, Keyable {
    readonly messageId: string;
    readonly addedAt: Date;

    constructor(options: {
        messageId: string;
        addedAt: Date;
    }) {
        this.messageId = options.messageId;
        this.addedAt = options.addedAt;
    }

    key(): string {
        return this.messageId;
    }

    toJson(): BookmarkData {
        return {
            messageId: this.messageId,
            addedAt: this.addedAt.toISOString(),
        };
    }

    static fromJson(data: BookmarkData): BookmarkEntry {
        return new BookmarkEntry({
            messageId: data.messageId,
            addedAt: new Date(data.addedAt),
        });
    }
}

import type { Model } from '@omuchatjs/omu/extension/table/model.js';

export type GiftJson = {
    id: string;
    name: string;
    amount: number;
    is_paid: boolean;
    image_url?: string;
};

export class Gift implements Model<GiftJson> {
    id: string;
    name: string;
    amount: number;
    isPaid: boolean;
    imageUrl?: string;

    constructor(options: GiftJson) {
        this.id = options.id;
        this.name = options.name;
        this.amount = options.amount;
        this.imageUrl = options.image_url;
        this.isPaid = options.is_paid;
    }

    static fromJson(options: GiftJson): Gift {
        return new Gift({
            id: options.id,
            name: options.name,
            amount: options.amount,
            is_paid: options.is_paid,
            image_url: options.image_url,
        });
    }

    toJson(): GiftJson {
        return {
            id: this.id,
            name: this.name,
            amount: this.amount,
            is_paid: this.isPaid,
            image_url: this.imageUrl,
        };
    }

    toString(): string {
        return this.name;
    }
}

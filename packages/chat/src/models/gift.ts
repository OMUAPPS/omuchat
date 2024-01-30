import type { Model } from '@omuchatjs/omu/interface/index.js';

export type GiftJson = {
    id: string;
    name: string;
    amount: number;
    is_paid: boolean;
    image_url?: string;
}

export class Gift implements Model<GiftJson> {
    id: string;
    name: string;
    amount: number;
    is_paid: boolean;
    image_url?: string;

    constructor(options: {
        id: string;
        name: string;
        amount: number;
        is_paid: boolean;
        image_url?: string;
    }) {
        this.id = options.id;
        this.name = options.name;
        this.amount = options.amount;
        this.image_url = options.image_url;
        this.is_paid = options.is_paid;
    }

    static fromJson(info: GiftJson): Gift {
        return new Gift({
            id: info.id,
            name: info.name,
            amount: info.amount,
            is_paid: info.is_paid,
            image_url: info.image_url,
        });
    }

    toJson(): GiftJson {
        return {
            id: this.id,
            name: this.name,
            amount: this.amount,
            is_paid: this.is_paid,
            image_url: this.image_url,
        };
    }

    toString(): string {
        return this.name;
    }
}

import type { Keyable } from '@omuchatjs/omu/interface/keyable.js';
import type { Model } from '@omuchatjs/omu/interface/model.js';

type NotifyJson = {
    text: string;
    regex: string;
    soundUrl: string;
};
export class NotifyEntry implements Model<NotifyJson>, Keyable {
    constructor(
        public text: string,
        public regex: string,
        public soundUrl: string,
    ) {}

    static fromJson(json: NotifyJson) {
        return new NotifyEntry(json.text, json.regex, json.soundUrl);
    }

    toJson(): NotifyJson {
        return {
            text: this.text,
            regex: this.regex,
            soundUrl: this.soundUrl,
        };
    }

    key() {
        return this.text;
    }
}

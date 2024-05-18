import type { Keyable } from "@omujs/omu/interface.js";
import type { Model } from "@omujs/omu/model.js";

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

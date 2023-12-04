import type { models } from "@omuchat/client";



export type MessageFilter = (message: models.Message) => boolean;
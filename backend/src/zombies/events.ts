import { createEventDefinition } from "ts-bus";
import { Guild, User } from "discord.js";

export const gameCreate = createEventDefinition<{
    guild: Guild;
    participants: { id: string, username: string }[]
}>()("game.create");

export const gameDestroy = createEventDefinition<{
    guild: Guild;
}>()("game.destroy");
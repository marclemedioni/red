import { createEventDefinition } from "ts-bus";
import { Guild } from "discord.js";

export const gameCreate = createEventDefinition<{
    guild: Guild;
}>()("game.create");

export const gameDestroy = createEventDefinition<{
    guild: Guild;
}>()("game.destroy");
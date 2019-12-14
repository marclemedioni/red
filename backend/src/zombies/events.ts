import { createEventDefinition } from "ts-bus";
import { Guild } from "discord.js";
import { ZombiesPlayer } from "./Player";

export const gameCreate = createEventDefinition<{
    guild: Guild;
    participants: { id: string, username: string }[]
}>()("game.create");

export const gameDestroy = createEventDefinition<{
    guild: Guild;
}>()("game.destroy");

export const playerMove = createEventDefinition<{
    guildId: string;
    player: ZombiesPlayer;
    direction: string;
}>()("player.move")
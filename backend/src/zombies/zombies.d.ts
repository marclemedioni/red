import { Guild } from "discord.js";
import { CommandoClient } from "discord.js-commando";

export interface ITile {
    x: number
    y: number
    isCity?: boolean
}

export interface ILocation {
    x: number
    y: number
}

export interface IMap {
    size: number;
    cityLocation: ILocation
}

export interface IGame {
    client: CommandoClient;
    guild: Guild;
    players: IPlayer[];
}

export interface IGameData {
    players: IPlayer[];
}

export interface IEntity {
    name: string;
    type: 'player' | 'monster';
    hp: number;
    str: number;
}

export interface IPlayer extends IEntity {
    class: string;
}
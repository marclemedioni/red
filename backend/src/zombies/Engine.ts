import path from 'path';
import { CommandoClient } from "discord.js-commando";

import { IGame, IGameData } from './zombies';
import { ZombiesGame } from './Game';
import { gameCreate, gameDestroy } from "./events";
import { bus } from "./bus";

export class ZombiesEngine {
    private client: CommandoClient;
    private games: Map<string, IGame> = new Map();

    constructor(client: CommandoClient) {
        this.client = client;

        this.client.registry
            .registerGroups([
                ['zombies', 'Zombies - Try to survive'],
            ])

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'commands'));

        this.addListeners();
        this.start();
    }

    private start() {
        this.client.guilds.forEach(guild => {
            const gameData: IGameData = this.client.provider.get(guild, 'zombies', null);
            if (gameData) {
                this.games[guild.id] = new ZombiesGame(this.client, guild, gameData, null);
            }
        })
    }

    private addListeners() {
        // GAME
        bus.subscribe(gameCreate, event => {
            const { guild, players } = event.payload;

            this.games[guild.id] = new ZombiesGame(this.client, guild, null, players);
        });

        bus.subscribe(gameDestroy, async (event) => {
            const { guild } = event.payload;
            await (this.games[guild.id] as ZombiesGame).destroy();
            delete this.games[guild.id];
        });
    }
}
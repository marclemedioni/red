import path from 'path';
import { CommandoClient } from "discord.js-commando";

import { ZombiesMap } from './Map';
import { ZombiesGame } from './Game';
import { gameCreate, gameDestroy } from "./events";
import { bus } from "./bus";

export class ZombiesEngine {
    private client: CommandoClient;
    private games: Map<string, ZombiesGame> = new Map();

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
        this.client.guilds.forEach(async guild => {
            const gameData = this.client.provider.get(guild, 'zombies', null);
            if (gameData) {
                const game = new ZombiesGame(this.client);
                await game.load(guild)
                this.games[guild.id] = game;
            }
        })
    }

    private addListeners() {
        // GAME
        bus.subscribe(gameCreate, async event => {
            const { guild, participants } = event.payload;
            const game = new ZombiesGame(this.client);
            this.games[guild.id] = game;
            await game.init(guild, participants);
        });

        bus.subscribe(gameDestroy, async (event) => {
            const { guild } = event.payload;
            await (this.games[guild.id] as ZombiesGame).destroy();
            delete this.games[guild.id];
        });
    }
}
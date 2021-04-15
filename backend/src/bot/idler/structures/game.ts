import { TextChannel } from "discord.js";

export default class Game {
    private id: string;
    private idleChannel: TextChannel;

    constructor(gameId: string, idleChannel: TextChannel) {
        this.id = gameId;
        this.idleChannel = idleChannel
    }

    runTick() {
        this.idleChannel.send('tick')
    }
}
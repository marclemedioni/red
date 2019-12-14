import { Type } from "class-transformer";
import { Guild } from "discord.js";
import { ZombiesLocation } from "./Location";
import { bus } from "./bus";
import { playerMove } from "./events";
import { CommandoClient } from "discord.js-commando";

export class ZombiesPlayer {
    public id: string;
    public guildId: string;
    public name: string;
    public isThirsty: boolean;
    public isHungry: boolean;
    @Type(() => ZombiesLocation)
    public location: ZombiesLocation;

    move(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
        bus.publish(playerMove({ guildId: this.guildId, player: this, direction }))
    }

    save(client: CommandoClient) {

    }
}
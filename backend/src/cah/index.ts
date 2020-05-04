import { CommandoClient } from "discord.js-commando";
import path from 'path';

export function init(client: CommandoClient) {
    client.guilds.forEach(guild => {
        client.provider.set(guild, 'cah', {
            state: 'stopped'
        })
    })
    client.registry
            .registerGroups([
                ['cah', 'Card against humanity'],
            ])

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'commands'));    
}
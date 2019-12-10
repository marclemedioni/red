import { CommandoClient, CommandMessage, Command } from 'discord.js-commando';

/** Helper function to delete command messages */
export const deleteCommandMessages = (msg: CommandMessage, client: CommandoClient) => {
    if (msg.deletable) {
        msg.delete()
    };
};
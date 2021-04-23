import { TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import PlayerModel from '../models/player';

export default class IdleCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'idle',
      aliases: [],
      group: 'idler',
      memberName: 'idle',
      description: 'Join idler game.',
      examples: ['idel'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3,
      },
    });
  }

  //@ts-ignore
  public async run(msg: CommandoMessage) {
    if ((msg.channel as TextChannel).name !== 'commands') {
      return;
    }

    const existingPlayer = await PlayerModel.findOne({
      discordId: msg.author.id,
      guildId: msg.guild.id,
    });

    if (existingPlayer) {
      return msg.reply('Le personnage existe déjà');
    }

    const member = await msg.guild.members.fetch(msg.author.id);
    await PlayerModel.create({
      discordId: msg.author.id,
      guildId: msg.guild.id,
      name: member.displayName,
    })

    return msg.reply('Le personnage a été créé');
  }
}
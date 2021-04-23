import dotenvSafe from 'dotenv-safe';
import commando from 'discord.js-commando';
import path from 'path';
import { Idler } from './idler/idler';
import { MongoClient } from 'mongodb';
import { default as MongoDBProvider } from 'commando-mongodb';

dotenvSafe.config();

export const client = new commando.CommandoClient({
  owner: process.env!.ownerId!.split(','),
});

client.setProvider(
  MongoClient.connect(process.env.MONGO_URI as string, {
    useUnifiedTopology: true
  }).then(client => new MongoDBProvider(client, process.env.MONGO_BASE))
).catch(console.error);

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user?.username}#${client.user?.discriminator} (${client.user?.id})`);
    const idler = new Idler(client);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('commandError', (cmd, err, message, args, from) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  });

client.registry
  // Registers all built-in groups, commands, and argument types
  .registerDefaults()

  .registerGroups([
    ['info', 'Info - Discord info'],
    ['moderation', 'Moderation - Who\'s your dady ?'],
    ['music', 'Music - 🎵 Let\'s dance ! 🎵'],
    ['search', 'Search - Information'],
    ['tts', 'Text to speach - Blablablaaaaaaaaa'],
  ])

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'));
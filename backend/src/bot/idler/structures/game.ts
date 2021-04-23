import PlayerModel from '../models/player';
export default class Game {
  private PLAYERS_MAP = {};
  private guildId: string;

  constructor(guildId: string) {
    this.guildId = guildId;
  }

  async runTick() {
    console.log('tick');
    const players = await PlayerModel.find({ guildId: this.guildId });

    players.forEach(player => {
      let playerInMemory = this.PLAYERS_MAP[player._id];

      if (!playerInMemory) {
        playerInMemory = this.PLAYERS_MAP[player._id] = Object.assign({}, player);
      }

      if (!playerInMemory.timer) {
        playerInMemory.timer = setTimeout(() => {
          console.log('meuh')
          delete this.PLAYERS_MAP[player._id]
        }, 15000)
      }
    })
  }
}
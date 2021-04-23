import { TextChannel } from "discord.js";

export default class Game {
  private id: string;

  constructor(gameId: string) {
    this.id = gameId;
  }

  runTick() {
    console.log('tick')
  }
}
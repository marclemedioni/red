import { Document, Schema, model, Model } from 'mongoose';

export interface IGameDocument extends Document {
  guildId: string
}

export interface IGameModel extends Model<IGameDocument> {

}

const GameSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true }
});

export default model<IGameDocument, IGameModel>('Game', GameSchema);
import { model, Document, Schema, Model } from 'mongoose';

export interface IPlayerDocument extends Document {
  discordId: string;
  guildId: string;
  name: string;
  createdAt: Date,
  updatedAt: Date,
}

export interface IPlayerModel extends Model<IPlayerDocument> {

}

const PlayerSchema = new Schema({
  discordId: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    }
  },
  guildId: {
    type: String,
    default: 'None'
  },
  name: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

export const newPlayerObj = (discordId, guildId, name) => {
  return {
    discordId,
    guildId,
    name,
  };
};

export default model<IPlayerDocument, IPlayerModel>('Player', PlayerSchema)
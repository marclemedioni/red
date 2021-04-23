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
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
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
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    guildId: {type: String, required: true, unique: true, index: true}
});

let GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
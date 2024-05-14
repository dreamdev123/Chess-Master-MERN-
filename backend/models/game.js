const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerOne: {
    type: String,
  },
  playerTwo: {
    type: String,
  },
  withFriend: {
    type: Boolean,
    default: false,
  },
  startedBy: {
    type: String,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  started: {
    type: Boolean,
    default: false,
  },
  friendId: {
    type: String,
    default: '',
  },
  currentPlayer: {
    type: String,
  },
  fen: {
    type: String,
    default: '',
  },
  game: {
    type: mongoose.Schema.Types.Mixed,
  },
  history: {
    type: Array,
    default: [],
  },
  pieceSquare: {
    type: String,
    default: '',
  },
  squareStyles: {
    type: mongoose.Schema.Types.Mixed,
  },
  w: {
    type: String,
    default: '',
  },
  b: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Game', gameSchema);

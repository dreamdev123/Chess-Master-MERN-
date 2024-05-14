const mongoose = require('mongoose');

const seeksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  inGame: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Seeks', seeksSchema);

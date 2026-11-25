const mongoose = require('mongoose');

const tryOnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userImage: {
    type: String,
    required: true
  },
  clothingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clothing',
    required: true
  },
  resultImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TryOn', tryOnSchema);

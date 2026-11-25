const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['tshirt', 'shirt', 'kurta', 'jacket', 'hoodie', 'dress'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clothing', clothingSchema);

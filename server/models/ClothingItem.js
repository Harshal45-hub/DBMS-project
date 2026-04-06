const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['upperwear', 'lowerwear']
  },
  subCategory: {
    type: String,
    required: true,
    enum: ['shirt', 't-shirt', 'goggles', 'jeans', 'pants', 'innerwear']
  },
  color: {
    type: String,
    required: true
  },
  occasion: {
    type: [String],
    enum: ['casual', 'formal', 'party', 'sport', 'date', 'work', 'travel']
  },
  tags: [String],
  price: {
    type: Number,
    default: 0
  },
  timesWorn: {
    type: Number,
    default: 0
  },
  lastWorn: Date,
  dripScore: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
const mongoose = require('mongoose');

const outfitHistorySchema = new mongoose.Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  }],
  date: {
    type: Date,
    default: Date.now
  },
  occasion: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  dripScore: Number
});

module.exports = mongoose.model('OutfitHistory', outfitHistorySchema);
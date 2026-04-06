const mongoose = require('mongoose');

const stealHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  originalOutfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutfitHistory',
    required: true
  },
  stolenItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  }],
  likes: {
    type: Number,
    default: 0
  },
  stolenAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StealHistory', stealHistorySchema);
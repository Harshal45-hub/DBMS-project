const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  clothingItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutfitHistory'
  },
  userId: String,
  userName: String,
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['comment', 'suggestion', 'vote'],
    default: 'comment'
  },
  vote: {
    type: String,
    enum: ['drip', 'skip']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
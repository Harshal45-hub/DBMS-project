const mongoose = require('mongoose');

const giftSuggestionSchema = new mongoose.Schema({
  partnerWardrobeId: String,
  suggestedItems: [{
    type: {
      type: String,
      enum: ['upperwear', 'lowerwear', 'accessory']
    },
    color: String,
    reason: String,
    price: Number,
    confidence: Number
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GiftSuggestion', giftSuggestionSchema);
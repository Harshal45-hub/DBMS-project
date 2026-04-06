const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    category: String,
    color: String,
    price: Number,
    notes: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shared: {
    type: Boolean,
    default: false
  },
  shareToken: String
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
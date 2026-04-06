const mongoose = require('mongoose');

const couplePairSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
    unique: true
  },
  partnerToken: {
    type: String,
    required: true
  },
  coupleToken: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'connected', 'disconnected'],
    default: 'pending'
  },
  pairedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date,
  preferences: {
    sharedWardrobe: {
      type: Boolean,
      default: true
    },
    giftReminders: {
      type: Boolean,
      default: true
    },
    dateNightReminders: {
      type: Boolean,
      default: true
    }
  }
});

module.exports = mongoose.model('CouplePair', couplePairSchema);
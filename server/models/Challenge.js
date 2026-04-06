const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['daily', 'weekly', 'special']
  },
  requirements: {
    category: String,
    color: String,
    occasion: String
  },
  participants: [{
    userId: String,
    outfitId: mongoose.Schema.Types.ObjectId,
    votes: Number,
    submittedAt: Date
  }],
  startDate: Date,
  endDate: Date,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
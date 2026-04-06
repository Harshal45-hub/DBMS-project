const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const shareTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    default: uuidv4,
    unique: true
  },
  wardrobeId: {
    type: String,
    required: true
  },
  permissions: {
    view: { type: Boolean, default: true },
    suggest: { type: Boolean, default: false },
    comment: { type: Boolean, default: false },
    vote: { type: Boolean, default: false }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ShareToken', shareTokenSchema);
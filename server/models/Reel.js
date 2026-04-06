const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutfitHistory',
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  title: {
    type: String,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String
  }],
  savedBy: [{
    type: String
  }],
  comments: [{
    userId: String,
    userName: String,
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
reelSchema.index({ userId: 1, createdAt: -1 });
reelSchema.index({ likes: -1, views: -1 });
reelSchema.index({ tags: 1 });

// Virtual for time ago
reelSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
});

// Method to increment views
reelSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
reelSchema.methods.toggleLike = function(userId) {
  if (this.likedBy.includes(userId)) {
    this.likes -= 1;
    this.likedBy = this.likedBy.filter(id => id !== userId);
  } else {
    this.likes += 1;
    this.likedBy.push(userId);
  }
  return this.save();
};

module.exports = mongoose.model('Reel', reelSchema);
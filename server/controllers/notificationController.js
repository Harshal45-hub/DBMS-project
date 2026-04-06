const Notification = require('../models/Notification');

// Get all notifications for a user
exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, unreadOnly = false } = req.query;
    const userId = req.userId || 'default-user'; // In production, get from auth
    
    const query = { userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single notification
exports.getNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        error: 'Notification not found' 
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        error: 'Notification not found' 
      });
    }
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.userId || 'default-user';
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      },
      message: `Marked ${result.modifiedCount} notifications as read`
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        error: 'Notification not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.userId || 'default-user';
    
    const result = await Notification.deleteMany({ userId });
    
    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      },
      message: `Deleted ${result.deletedCount} notifications`
    });
  } catch (error) {
    next(error);
  }
};

// Create a new notification (internal use)
exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date()
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

// Create notification for comment
exports.createCommentNotification = async (userId, commenterName, itemName, itemId) => {
  return exports.createNotification(
    userId,
    'comment',
    'New Comment',
    `${commenterName} commented on ${itemName}`,
    { itemId, commenterName }
  );
};

// Create notification for suggestion
exports.createSuggestionNotification = async (userId, suggesterName, itemName, suggestionId) => {
  return exports.createNotification(
    userId,
    'suggestion',
    'New Outfit Suggestion',
    `${suggesterName} suggested an outfit for ${itemName}`,
    { suggestionId, suggesterName }
  );
};

// Create notification for vote
exports.createVoteNotification = async (userId, voterName, itemName, voteType) => {
  return exports.createNotification(
    userId,
    'vote',
    'New Vote',
    `${voterName} ${voteType === 'drip' ? 'liked' : 'skipped'} your ${itemName}`,
    { voteType, voterName }
  );
};

// Create notification for challenge
exports.createChallengeNotification = async (userId, challengeName, challengeId, action) => {
  const messages = {
    start: `A new challenge "${challengeName}" has started!`,
    end: `The challenge "${challengeName}" is ending soon!`,
    win: `Congratulations! You won the "${challengeName}" challenge!`
  };
  
  return exports.createNotification(
    userId,
    'challenge',
    `Challenge ${action}`,
    messages[action] || `Update on challenge "${challengeName}"`,
    { challengeId, challengeName, action }
  );
};

// Create notification for share
exports.createShareNotification = async (userId, sharerName, shareType, shareId) => {
  return exports.createNotification(
    userId,
    'share',
    'Wardrobe Shared',
    `${sharerName} shared their ${shareType} with you!`,
    { shareId, sharerName, shareType }
  );
};

// Create notification for couple
exports.createCoupleNotification = async (userId, partnerName, action) => {
  const messages = {
    connect: `${partnerName} wants to connect wardrobes with you!`,
    accept: `${partnerName} accepted your wardrobe connection!`,
    outfit: `${partnerName} suggested a couple outfit!`
  };
  
  return exports.createNotification(
    userId,
    'couple',
    'Couple Update',
    messages[action] || `${partnerName} updated your couple wardrobe`,
    { partnerName, action }
  );
};

// Get unread count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.userId || 'default-user';
    
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get notifications by type
exports.getNotificationsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const userId = req.userId || 'default-user';
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notifications = await Notification.find({ userId, type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments({ userId, type });
    
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk create notifications (for challenges, etc.)
exports.bulkCreateNotifications = async (userIds, type, title, message, data = {}) => {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date()
    }));
    
    const result = await Notification.insertMany(notifications);
    return result;
  } catch (error) {
    console.error('Failed to bulk create notifications:', error);
    return [];
  }
};
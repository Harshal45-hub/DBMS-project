const Wishlist = require('../models/Wishlist');
const { v4: uuidv4 } = require('uuid');

exports.getWishlist = async (req, res, next) => {
  try {
    const { userId } = req.query;
    
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
      await wishlist.save();
    }
    
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { userId, item } = req.body;
    
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    
    wishlist.items.push({
      ...item,
      addedAt: new Date()
    });
    
    await wishlist.save();
    
    res.status(201).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }
    
    wishlist.items = wishlist.items.filter(item => item._id.toString() !== itemId);
    await wishlist.save();
    
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.shareWishlist = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }
    
    const shareToken = uuidv4();
    wishlist.shared = true;
    wishlist.shareToken = shareToken;
    await wishlist.save();
    
    const shareUrl = `${process.env.CLIENT_URL}/wishlist/${shareToken}`;
    
    res.json({
      success: true,
      data: {
        shareUrl,
        shareToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSharedWishlist = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const wishlist = await Wishlist.findOne({ shareToken: token, shared: true });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found or not shared' });
    }
    
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};
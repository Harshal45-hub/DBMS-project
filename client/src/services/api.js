import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ Clothing Items ============
export const fetchClothingItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/clothing?${params}`);
  return response.data.data;
};

export const getClothingItem = async (id) => {
  const response = await api.get(`/clothing/${id}`);
  return response.data.data;
};

export const createClothingItem = async (item) => {
  const response = await api.post('/clothing', item);
  return response.data.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data.imageUrl;
};

export const updateClothingItem = async (id, updates) => {
  const response = await api.put(`/clothing/${id}`, updates);
  return response.data.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/clothing/${id}`);
  return response.data;
};

export const likeItem = async (id) => {
  const response = await api.post(`/clothing/${id}/like`);
  return response.data.data;
};

export const incrementWorn = async (id) => {
  const response = await api.post(`/clothing/${id}/worn`);
  return response.data.data;
};

// ============ Outfits ============
export const generateOutfit = async (occasion, excludeItems = []) => {
  const response = await api.post('/outfits/generate', { occasion, excludeItems });
  return response.data.data;
};

export const getOutfitHistory = async () => {
  const response = await api.get('/outfits/history');
  return response.data.data;
};

export const rateOutfit = async (outfitId, rating, feedback) => {
  const response = await api.post('/outfits/rate', { outfitId, rating, feedback });
  return response.data;
};

// ============ Sharing ============
export const createShareLink = async (permissions) => {
  const response = await api.post('/share', permissions);
  return response.data.data;
};

export const getSharedWardrobe = async (token) => {
  const response = await api.get(`/share/${token}`);
  return response.data.data;
};

export const submitSuggestion = async (suggestionData) => {
  const response = await api.post('/share/suggest', suggestionData);
  return response.data.data;
};

// ============ Social ============
export const addComment = async (commentData) => {
  const response = await api.post('/social/comments', commentData);
  return response.data.data;
};

export const getComments = async (itemId) => {
  const response = await api.get(`/social/comments/${itemId}`);
  return response.data.data;
};

export const castVote = async (voteData) => {
  const response = await api.post('/social/vote', voteData);
  return response.data.data;
};

export const getSocialFeed = async (limit = 20, page = 1) => {
  const response = await api.get(`/social/feed?limit=${limit}&page=${page}`);
  return response.data.data;
};

export const joinChallenge = async (challengeData) => {
  const response = await api.post('/social/challenges/join', challengeData);
  return response.data.data;
};

export const getActiveChallenges = async () => {
  const response = await api.get('/social/challenges/active');
  return response.data.data;
};

// ============ Couples ============
export const pairWardrobes = async (partnerToken) => {
  const response = await api.post('/couples/pair', partnerToken);
  return response.data.data;
};

export const getCoupleSuggestions = async (partnerWardrobeId) => {
  const response = await api.get(`/couples/suggestions/${partnerWardrobeId}`);
  return response.data.data;
};

export const planDateNight = async (dateNightData) => {
  const response = await api.post('/couples/date-night', dateNightData);
  return response.data.data;
};

export const getGiftSuggestions = async (partnerId) => {
  const response = await api.get(`/couples/gifts/${partnerId}`);
  return response.data.data;
};

// ============ Analytics ============
export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data.data;
};

export const getWearFrequency = async () => {
  const response = await api.get('/analytics/frequency');
  return response.data.data;
};

export const getStyleTrends = async () => {
  const response = await api.get('/analytics/trends');
  return response.data.data;
};

export const getSustainabilityMetrics = async () => {
  const response = await api.get('/analytics/sustainability');
  return response.data.data;
};

// ============ Planner ============
export const getPlannedOutfits = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const response = await api.get(`/planner?${params.toString()}`);
  return response.data.data;
};

export const scheduleOutfit = async (outfitData) => {
  const response = await api.post('/planner/schedule', outfitData);
  return response.data.data;
};

export const getOutfitSuggestionsForDate = async ({ date, occasion }) => {
  const response = await api.get(`/planner/suggestions?date=${date}&occasion=${occasion}`);
  return response.data.data;
};

export const getWearHistory = async (itemId) => {
  const response = await api.get(`/planner/history/${itemId}`);
  return response.data.data;
};

export const getMonthlySummary = async (year, month) => {
  const response = await api.get(`/planner/summary?year=${year}&month=${month}`);
  return response.data.data;
};

// ============ AI ============
export const sendChatMessage = async (message, sessionContext = null) => {
  const response = await api.post('/ai/chat', { message, sessionContext });
  return response.data;
};

export const analyzeWardrobe = async () => {
  const response = await api.get('/ai/analyze');
  return response.data;
};

export const getStyleAdvice = async (query) => {
  const response = await api.get('/ai/advice', { params: { query } });
  return response.data;
};

// ============ Notifications ============
export const getNotifications = async (limit = 20, page = 1, unreadOnly = false) => {
  const response = await api.get(`/notifications?limit=${limit}&page=${page}&unreadOnly=${unreadOnly}`);
  return response.data.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data;
};

export const getNotificationsByType = async (type, limit = 20, page = 1) => {
  const response = await api.get(`/notifications/type/${type}?limit=${limit}&page=${page}`);
  return response.data.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};

// ============ Wishlist ============
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data.data;
};

export const addToWishlist = async (item) => {
  const response = await api.post('/wishlist/items', { item });
  return response.data.data;
};

export const removeFromWishlist = async (userId, itemId) => {
  const response = await api.delete(`/wishlist/items/${userId}/${itemId}`);
  return response.data.data;
};

export const shareWishlist = async () => {
  const response = await api.post('/wishlist/share');
  return response.data.data;
};

export const getSharedWishlist = async (token) => {
  const response = await api.get(`/wishlist/shared/${token}`);
  return response.data.data;
};

// ============ Challenges ============
export const getAllChallenges = async (activeOnly = false) => {
  const response = await api.get(`/challenges?active=${activeOnly}`);
  return response.data.data;
};

export const getChallengeById = async (id) => {
  const response = await api.get(`/challenges/${id}`);
  return response.data.data;
};

export const createChallenge = async (challengeData) => {
  const response = await api.post('/challenges', challengeData);
  return response.data.data;
};

export const submitChallengeEntry = async (challengeId, outfitId) => {
  const response = await api.post(`/challenges/${challengeId}/submit`, { outfitId });
  return response.data.data;
};

export const voteChallengeEntry = async (challengeId, participantId) => {
  const response = await api.post(`/challenges/${challengeId}/vote/${participantId}`);
  return response.data.data;
};

export const getChallengeLeaderboard = async (challengeId) => {
  const response = await api.get(`/challenges/${challengeId}/leaderboard`);
  return response.data.data;
};

// ============ Steal This Fit ============
export const stealOutfit = async (stealData) => {
  const response = await api.post('/steal', stealData);
  return response.data.data;
};

export const getPopularOutfits = async () => {
  const response = await api.get('/steal/popular');
  return response.data.data;
};

export const getUserSteals = async (userId) => {
  const response = await api.get(`/steal/user/${userId}`);
  return response.data.data;
};

export const likeSteal = async (outfitId) => {
  const response = await api.post(`/steal/${outfitId}/like`);
  return response.data.data;
};

// ============ Reel Feed ============
export const getReelFeed = async () => {
  const response = await api.get('/reel/feed');
  return response.data.data;
};

export const getTrendingReels = async () => {
  const response = await api.get('/reel/trending');
  return response.data.data;
};

export const incrementReelViews = async (reelId) => {
  const response = await api.post(`/reel/${reelId}/view`);
  return response.data.data;
};

export const likeReel = async (reelId) => {
  const response = await api.post(`/reel/${reelId}/like`);
  return response.data.data;
};

export const createReel = async (reelData) => {
  const response = await api.post('/reel', reelData);
  return response.data.data;
};

export const deleteReel = async (reelId) => {
  const response = await api.delete(`/reel/${reelId}`);
  return response.data;
};

export const addReelComment = async (reelId, commentData) => {
  const response = await api.post(`/reel/${reelId}/comment`, commentData);
  return response.data.data;
};

// ============ Gift Suggestions ============
export const getPartnerGiftSuggestions = async (partnerId) => {
  const response = await api.get(`/gift/suggestions/${partnerId}`);
  return response.data.data;
};

export const purchaseGift = async (purchaseData) => {
  const response = await api.post('/gift/purchase', purchaseData);
  return response.data.data;
};

export const getGiftHistory = async (userId) => {
  const response = await api.get(`/gift/history/${userId}`);
  return response.data.data;
};

export const saveGiftSuggestion = async (giftData) => {
  const response = await api.post('/gift/save', giftData);
  return response.data.data;
};

// ============ QR Code Sharing ============
export const generateQRCode = async (outfitId) => {
  const response = await api.post(`/qr/generate/${outfitId}`);
  return response.data.data;
};

export const getQRCode = async (outfitId) => {
  const response = await api.get(`/qr/${outfitId}`);
  return response.data.data;
};

export const scanQRCode = async (token) => {
  const response = await api.get(`/qr/scan/${token}`);
  return response.data.data;
};

// ============ Error Interceptor ============
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        console.error('Unauthorized access');
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
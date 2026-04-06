const crypto = require('crypto');

exports.generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.calculateDripScore = (items) => {
  if (!items || items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + (item.dripScore || 0), 0);
  return Math.min(100, Math.floor(total / items.length));
};

exports.formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

exports.getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

exports.groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

exports.calculateColorHarmony = (colors) => {
  // Simple color harmony calculation
  const colorMap = {
    black: 0, white: 0, gray: 0,
    red: 1, blue: 2, green: 3,
    yellow: 4, purple: 5, pink: 6
  };
  
  const scores = colors.map(c => colorMap[c.toLowerCase()] || 0);
  const uniqueScores = [...new Set(scores)];
  
  return Math.min(100, Math.floor((uniqueScores.length / 7) * 100));
};
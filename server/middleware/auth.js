// Simple session-based authentication for single user
// In production, you'd use proper JWT authentication

const authenticate = (req, res, next) => {
  // For single-user mode, we just set a default user ID
  // In production, you'd verify the session token
  req.userId = 'default-user';
  next();
};

const generateSessionToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

module.exports = { authenticate, generateSessionToken };
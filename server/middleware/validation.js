const { body, param, query, validationResult } = require('express-validator');

exports.validateClothingItem = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['upperwear', 'lowerwear']).withMessage('Invalid category'),
  body('subCategory').isIn(['shirt', 't-shirt', 'goggles', 'jeans', 'pants', 'innerwear']),
  body('color').trim().notEmpty(),
  body('occasion').optional().isArray(),
  body('tags').optional().isArray(),
  body('price').optional().isNumeric()
];

exports.validateShareLink = [
  body('permissions').optional().isObject(),
  body('permissions.view').optional().isBoolean(),
  body('permissions.suggest').optional().isBoolean(),
  body('permissions.comment').optional().isBoolean()
];

exports.validateComment = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('type').optional().isIn(['comment', 'suggestion', 'vote'])
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};
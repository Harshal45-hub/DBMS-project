const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const clothingController = require('../controllers/clothingController');

router.get('/', clothingController.getAllItems);
router.get('/:id', clothingController.getItemById);
router.post('/',
  body('name').notEmpty().trim(),
  body('category').isIn(['upperwear', 'lowerwear']),
  body('subCategory').isIn(['shirt', 't-shirt', 'goggles', 'jeans', 'pants', 'innerwear']),
  body('color').notEmpty(),
  clothingController.createItem
);
router.put('/:id', clothingController.updateItem);
router.delete('/:id', clothingController.deleteItem);
router.post('/:id/like', clothingController.likeItem);
router.post('/:id/worn', clothingController.incrementWorn);

module.exports = router;
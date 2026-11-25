const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { getClothes, uploadClothing, deleteClothing } = require('../controllers/clothing.controller');

router.route('/')
  .get(getClothes)
  .post(upload.single('image'), uploadClothing);

router.route('/:id')
  .delete(deleteClothing);

module.exports = router;

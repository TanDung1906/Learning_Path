const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public read — controller tự ẩn DRAFT/HIDDEN với non-admin
router.get('/', newsController.getNewsList);
router.get('/:id', newsController.getNewsById);

// Ghi — chỉ Admin (protect + adminOnly)
router.post('/', protect, adminOnly, newsController.createNews);
router.put('/:id', protect, adminOnly, newsController.updateNews);
router.delete('/:id', protect, adminOnly, newsController.deleteNews);

module.exports = router;

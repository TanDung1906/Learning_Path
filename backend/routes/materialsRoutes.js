const express = require('express');

const router = express.Router();

const { uploadMaterial, fetchTextMaterialContent } = require('../controllers/materialUploadController');
const { materialUploadMiddleware } = require('../middlewares/materialUploadMiddleware');
const { MATERIAL_MAX_SIZE_MESSAGE } = require('../services/cloudinaryService');

router.get('/text-content', fetchTextMaterialContent);

router.post('/upload', (req, res, next) => {
  const contentType = String(req.headers['content-type'] ?? '');

  if (!contentType.includes('multipart/form-data')) {
    return uploadMaterial(req, res);
  }

  materialUploadMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: MATERIAL_MAX_SIZE_MESSAGE,
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'Không thể tải file lên.',
      });
    }
    return uploadMaterial(req, res);
  });});

module.exports = router;

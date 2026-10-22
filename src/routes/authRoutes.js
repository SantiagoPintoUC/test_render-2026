const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas con JWT
router.get('/me', authMiddleware, authController.getMe);
router.get('/me/likes', authMiddleware, likeController.getMisLikes);

module.exports = router;

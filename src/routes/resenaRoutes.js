const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');
const likeController = require('../controllers/likeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

// Rutas de reseñas (detección opcional de usuario en GET)
router.get('/', optionalAuthMiddleware, resenaController.getAllResenas);
router.get('/:id', optionalAuthMiddleware, resenaController.getResenaById);
router.post('/', authMiddleware, resenaController.createResena);

// Rutas de likes para reseñas (Diagrama XML: Usuario da like a Reseña)
router.post('/:id/like', authMiddleware, likeController.toggleLikeResena);
router.delete('/:id/like', authMiddleware, likeController.removeLikeResena);
router.get('/:id/likes', likeController.getResenaLikes);

module.exports = router;

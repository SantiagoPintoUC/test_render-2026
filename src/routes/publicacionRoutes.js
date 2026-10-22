const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const likeController = require('../controllers/likeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

// Endpoint para obtener todas las publicaciones para el feed (con detección opcional de usuario logueado para isLiked)
router.get('/', optionalAuthMiddleware, publicacionController.getAllPublicaciones);

// Endpoint para obtener una publicación específica
router.get('/:id', optionalAuthMiddleware, publicacionController.getPublicacionById);

// Endpoint protegido: requiere obligatoriamente token JWT (Bearer) para crear una publicación
router.post('/', authMiddleware, publicacionController.createPublicacion);

// Rutas de likes para publicaciones
router.post('/:id/like', authMiddleware, likeController.toggleLikePublicacion);
router.delete('/:id/like', authMiddleware, likeController.removeLikePublicacion);
router.get('/:id/likes', likeController.getPublicacionLikes);

module.exports = router;

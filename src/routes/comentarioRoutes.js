const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const likeController = require('../controllers/likeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas de comentarios
router.get('/', comentarioController.getAllComentarios);
router.get('/:id', comentarioController.getComentarioById);
router.post('/', authMiddleware, comentarioController.createComentario);

// Rutas de likes para comentarios (Diagrama XML: Usuario da like a Comentario)
router.post('/:id/like', authMiddleware, likeController.toggleLikeComentario);
router.delete('/:id/like', authMiddleware, likeController.removeLikeComentario);
router.get('/:id/likes', likeController.getComentarioLikes);

module.exports = router;

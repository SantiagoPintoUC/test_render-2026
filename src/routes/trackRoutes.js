const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const likeController = require('../controllers/likeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

// Rutas de tracks (detección opcional de usuario en GET)
router.get('/', optionalAuthMiddleware, trackController.getAllTracks);
router.get('/:id', optionalAuthMiddleware, trackController.getTrackById);
router.post('/', authMiddleware, trackController.createTrack);

// Rutas de likes para tracks (Diagrama XML: Usuario da like a Track)
router.post('/:id/like', authMiddleware, likeController.toggleLikeTrack);
router.delete('/:id/like', authMiddleware, likeController.removeLikeTrack);
router.get('/:id/likes', likeController.getTrackLikes);

module.exports = router;

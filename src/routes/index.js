const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const publicacionRoutes = require('./publicacionRoutes');
const trackRoutes = require('./trackRoutes');
const resenaRoutes = require('./resenaRoutes');
const comentarioRoutes = require('./comentarioRoutes');

router.use('/auth', authRoutes);
router.use('/publicaciones', publicacionRoutes);
router.use('/tracks', trackRoutes);
router.use('/resenas', resenaRoutes);
router.use('/comentarios', comentarioRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'Playgram Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRoutes = require('./routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Playgram API',
    version: '1.0.0',
    documentacion: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        meLikes: 'GET /api/auth/me/likes',
      },
      publicaciones: {
        getAll: 'GET /api/publicaciones (Endpoint para main page)',
        getById: 'GET /api/publicaciones/:id',
        create: 'POST /api/publicaciones',
        toggleLike: 'POST /api/publicaciones/:id/like',
        removeLike: 'DELETE /api/publicaciones/:id/like',
        getLikes: 'GET /api/publicaciones/:id/likes',
      },
      tracks: {
        getAll: 'GET /api/tracks',
        getById: 'GET /api/tracks/:id',
        create: 'POST /api/tracks',
        toggleLike: 'POST /api/tracks/:id/like',
        removeLike: 'DELETE /api/tracks/:id/like',
        getLikes: 'GET /api/tracks/:id/likes',
      },
      resenas: {
        getAll: 'GET /api/resenas',
        getById: 'GET /api/resenas/:id',
        create: 'POST /api/resenas',
        toggleLike: 'POST /api/resenas/:id/like',
        removeLike: 'DELETE /api/resenas/:id/like',
        getLikes: 'GET /api/resenas/:id/likes',
      },
      comentarios: {
        getAll: 'GET /api/comentarios',
        getById: 'GET /api/comentarios/:id',
        create: 'POST /api/comentarios',
        toggleLike: 'POST /api/comentarios/:id/like',
        removeLike: 'DELETE /api/comentarios/:id/like',
        getLikes: 'GET /api/comentarios/:id/likes',
      },
    },
  });
});

// Montaje de la API bajo el prefijo /api
app.use('/api', apiRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Manejo centralizado de errores (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

module.exports = app;

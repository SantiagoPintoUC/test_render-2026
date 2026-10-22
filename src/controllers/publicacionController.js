const {
  Publicacion,
  Usuario,
  LikePublicacion,
  Resena,
  Album,
  Comentario,
} = require('../models');

// GET /api/publicaciones (Endpoint principal para poblar la main page)
const getAllPublicaciones = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const { count, rows: publicaciones } = await Publicacion.findAndCountAll({
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id_usuario', 'username', 'avatar_url', 'bio', 'rol'],
        },
        {
          model: LikePublicacion,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
        {
          model: Resena,
          as: 'resena',
          include: [
            {
              model: Album,
              as: 'album',
              attributes: ['id_album', 'titulo', 'portada_url'],
            },
          ],
        },
        {
          model: Comentario,
          as: 'comentarios',
          attributes: ['id_comentario', 'texto', 'id_usuario', 'fecha_creacion'],
        },
      ],
      order: [['fecha_creacion', 'DESC']],
      limit,
      offset,
    });

    // Formatear para compatibilidad con feed y frontend
    const publicacionesFormateadas = publicaciones.map((p) => {
      const data = p.toJSON();
      const numLikes = data.likes ? data.likes.length : 0;
      const isLiked = userId && data.likes ? data.likes.some((l) => l.id_usuario === userId) : false;

      data.id = data.id_publicacion;
      data.totalLikes = numLikes;
      data.likesCount = numLikes;
      data.likes = numLikes;
      data.isLiked = isLiked;

      // Metadatos para renderizado en frontend
      data.type = data.resena ? 'review' : 'post';
      data.title = data.resena && data.resena.album
        ? `${data.resena.album.titulo}`
        : `Publicación de ${data.autor?.username || 'Playgram'}`;

      if (data.resena) {
        data.rating =
          '★'.repeat(data.resena.calificacion) +
          '☆'.repeat(5 - data.resena.calificacion) +
          ` (${data.resena.calificacion}/5)`;
      } else {
        data.rating = null;
      }
      data.content = data.texto;

      return data;
    });

    return res.status(200).json({
      total: count,
      limit,
      offset,
      publicaciones: publicacionesFormateadas,
    });
  } catch (error) {
    console.error('Error en getAllPublicaciones:', error);
    return res.status(500).json({
      error: 'Ocurrió un error interno al obtener las publicaciones.',
    });
  }
};

// GET /api/publicaciones/:id
const getPublicacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const publicacion = await Publicacion.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id_usuario', 'username', 'avatar_url', 'bio', 'rol'],
        },
        {
          model: LikePublicacion,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
        {
          model: Resena,
          as: 'resena',
          include: [
            {
              model: Album,
              as: 'album',
            },
          ],
        },
        {
          model: Comentario,
          as: 'comentarios',
          include: [
            {
              model: Usuario,
              as: 'autor',
              attributes: ['id_usuario', 'username', 'avatar_url'],
            },
          ],
        },
      ],
    });

    if (!publicacion) {
      return res.status(404).json({
        error: `No se encontró la publicación con ID ${id}.`,
      });
    }

    const data = publicacion.toJSON();
    const numLikes = data.likes ? data.likes.length : 0;
    const isLiked = userId && data.likes ? data.likes.some((l) => l.id_usuario === userId) : false;

    data.id = data.id_publicacion;
    data.totalLikes = numLikes;
    data.likesCount = numLikes;
    data.likes = numLikes;
    data.isLiked = isLiked;
    data.type = data.resena ? 'review' : 'post';
    data.title = data.resena && data.resena.album
      ? `${data.resena.album.titulo}`
      : `Publicación de ${data.autor?.username || 'Playgram'}`;

    if (data.resena) {
      data.rating =
        '★'.repeat(data.resena.calificacion) +
        '☆'.repeat(5 - data.resena.calificacion) +
        ` (${data.resena.calificacion}/5)`;
    } else {
      data.rating = null;
    }
    data.content = data.texto;

    return res.status(200).json({
      publicacion: data,
    });
  } catch (error) {
    console.error('Error en getPublicacionById:', error);
    return res.status(500).json({
      error: 'Ocurrió un error interno al obtener la publicación.',
    });
  }
};

// POST /api/publicaciones (Crear una nueva publicación - Requiere Token JWT)
const createPublicacion = async (req, res) => {
  try {
    const { texto, calificacion, id_album, album_titulo, texto_critico } = req.body;

    if (!texto || texto.trim() === '') {
      return res.status(400).json({
        error: 'El contenido de la publicación no puede estar vacío.',
      });
    }

    // El autor se extrae estrictamente del token JWT verificado por authMiddleware
    const autorId = req.usuario.id_usuario;

    // Verificar que el usuario exista en la base de datos
    const usuarioExiste = await Usuario.findByPk(autorId);
    if (!usuarioExiste) {
      return res.status(404).json({
        error: 'El usuario autenticado no existe en el sistema.',
      });
    }

    // Crear la publicación base
    const nuevaPublicacion = await Publicacion.create({
      texto: texto.trim(),
      id_usuario: autorId,
    });

    // Si se incluye reseña (calificación), crear la relación 1:0..1 Reseña
    if (calificacion !== undefined && calificacion !== null) {
      let album = null;
      if (id_album) {
        album = await Album.findByPk(id_album);
      } else if (album_titulo && album_titulo.trim()) {
        album = await Album.findOne({ where: { titulo: album_titulo.trim() } });
        if (!album) {
          album = await Album.create({
            titulo: album_titulo.trim(),
            portada_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
          });
        }
      } else {
        album = await Album.findOne();
      }

      if (album) {
        await Resena.create({
          id_publicacion: nuevaPublicacion.id_publicacion,
          id_album: album.id_album,
          calificacion: parseInt(calificacion, 10),
          texto_critico: texto_critico || texto.trim(),
        });
      }
    }

    // Obtener la publicación recién creada con la información de su autor y posible reseña
    const publicacionConAutor = await Publicacion.findByPk(
      nuevaPublicacion.id_publicacion,
      {
        include: [
          {
            model: Usuario,
            as: 'autor',
            attributes: ['id_usuario', 'username', 'avatar_url', 'bio', 'rol'],
          },
          {
            model: Resena,
            as: 'resena',
            include: [
              {
                model: Album,
                as: 'album',
                attributes: ['id_album', 'titulo', 'portada_url'],
              },
            ],
          },
          {
            model: Comentario,
            as: 'comentarios',
            attributes: ['id_comentario', 'texto', 'id_usuario', 'fecha_creacion'],
          },
        ],
      }
    );

    const data = publicacionConAutor.toJSON();
    data.id = data.id_publicacion;
    data.totalLikes = 0;
    data.likesCount = 0;
    data.likes = 0;
    data.isLiked = false;
    data.type = data.resena ? 'review' : 'post';
    data.title = data.resena && data.resena.album
      ? `${data.resena.album.titulo}`
      : `Publicación de ${data.autor?.username || 'Playgram'}`;

    if (data.resena) {
      data.rating =
        '★'.repeat(data.resena.calificacion) +
        '☆'.repeat(5 - data.resena.calificacion) +
        ` (${data.resena.calificacion}/5)`;
    } else {
      data.rating = null;
    }
    data.content = data.texto;

    return res.status(201).json({
      message: data.resena
        ? 'Publicación con reseña creada exitosamente.'
        : 'Publicación creada exitosamente.',
      publicacion: data,
    });
  } catch (error) {
    console.error('Error en createPublicacion:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map((e) => e.message).join(', '),
      });
    }
    return res.status(500).json({
      error: 'Ocurrió un error interno al crear la publicación.',
    });
  }
};

module.exports = {
  getAllPublicaciones,
  getPublicacionById,
  createPublicacion,
};

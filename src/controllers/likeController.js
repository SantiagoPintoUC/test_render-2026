const {
  Usuario,
  Track,
  Resena,
  Comentario,
  Publicacion,
  LikeTrack,
  LikeResena,
  LikeComentario,
  LikePublicacion,
} = require('../models');

// ==========================================
// 1. LIKES EN TRACKS (Canciones / Pistas)
// ==========================================

// POST /api/tracks/:id/like (Toggle like: da like si no lo tiene, quita si ya lo tiene)
const toggleLikeTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ error: `No se encontró el track con ID ${id}.` });
    }

    const likeExistente = await LikeTrack.findOne({
      where: { id_usuario, id_track: id },
    });

    if (likeExistente) {
      await likeExistente.destroy();
      const totalLikes = await LikeTrack.count({ where: { id_track: id } });
      return res.status(200).json({
        message: 'Like removido del track.',
        isLiked: false,
        totalLikes,
      });
    } else {
      const nuevoLike = await LikeTrack.create({ id_usuario, id_track: id });
      const totalLikes = await LikeTrack.count({ where: { id_track: id } });
      return res.status(201).json({
        message: 'Like agregado exitosamente al track.',
        isLiked: true,
        like: nuevoLike,
        totalLikes,
      });
    }
  } catch (error) {
    console.error('Error en toggleLikeTrack:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar el like del track.' });
  }
};

// DELETE /api/tracks/:id/like (Quitar like explícitamente)
const removeLikeTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const like = await LikeTrack.findOne({ where: { id_usuario, id_track: id } });
    if (!like) {
      return res.status(404).json({ error: 'No se encontró un like del usuario para este track.' });
    }

    await like.destroy();
    const totalLikes = await LikeTrack.count({ where: { id_track: id } });
    return res.status(200).json({
      message: 'Like eliminado del track.',
      isLiked: false,
      totalLikes,
    });
  } catch (error) {
    console.error('Error en removeLikeTrack:', error);
    return res.status(500).json({ error: 'Error interno al remover el like del track.' });
  }
};

// GET /api/tracks/:id/likes (Obtener lista y conteo de likes de un track)
const getTrackLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ error: `No se encontró el track con ID ${id}.` });
    }

    const likes = await LikeTrack.findAll({
      where: { id_track: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
      ],
      order: [['fecha_like', 'DESC']],
    });

    return res.status(200).json({
      id_track: parseInt(id, 10),
      totalLikes: likes.length,
      likes,
    });
  } catch (error) {
    console.error('Error en getTrackLikes:', error);
    return res.status(500).json({ error: 'Error interno al obtener los likes del track.' });
  }
};

// ==========================================
// 2. LIKES EN RESEÑAS
// ==========================================

// POST /api/resenas/:id/like (Toggle like a una reseña)
const toggleLikeResena = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const resena = await Resena.findByPk(id);
    if (!resena) {
      return res.status(404).json({ error: `No se encontró la reseña con ID ${id}.` });
    }

    const likeExistente = await LikeResena.findOne({
      where: { id_usuario, id_resena: id },
    });

    if (likeExistente) {
      await likeExistente.destroy();
      const totalLikes = await LikeResena.count({ where: { id_resena: id } });
      return res.status(200).json({
        message: 'Like removido de la reseña.',
        isLiked: false,
        totalLikes,
      });
    } else {
      const nuevoLike = await LikeResena.create({ id_usuario, id_resena: id });
      const totalLikes = await LikeResena.count({ where: { id_resena: id } });
      return res.status(201).json({
        message: 'Like agregado exitosamente a la reseña.',
        isLiked: true,
        like: nuevoLike,
        totalLikes,
      });
    }
  } catch (error) {
    console.error('Error en toggleLikeResena:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar el like de la reseña.' });
  }
};

// DELETE /api/resenas/:id/like
const removeLikeResena = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const like = await LikeResena.findOne({ where: { id_usuario, id_resena: id } });
    if (!like) {
      return res.status(404).json({ error: 'No se encontró un like del usuario para esta reseña.' });
    }

    await like.destroy();
    const totalLikes = await LikeResena.count({ where: { id_resena: id } });
    return res.status(200).json({
      message: 'Like eliminado de la reseña.',
      isLiked: false,
      totalLikes,
    });
  } catch (error) {
    console.error('Error en removeLikeResena:', error);
    return res.status(500).json({ error: 'Error interno al remover el like de la reseña.' });
  }
};

// GET /api/resenas/:id/likes
const getResenaLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const resena = await Resena.findByPk(id);
    if (!resena) {
      return res.status(404).json({ error: `No se encontró la reseña con ID ${id}.` });
    }

    const likes = await LikeResena.findAll({
      where: { id_resena: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
      ],
      order: [['fecha_like', 'DESC']],
    });

    return res.status(200).json({
      id_resena: parseInt(id, 10),
      totalLikes: likes.length,
      likes,
    });
  } catch (error) {
    console.error('Error en getResenaLikes:', error);
    return res.status(500).json({ error: 'Error interno al obtener los likes de la reseña.' });
  }
};

// ==========================================
// 3. LIKES EN COMENTARIOS
// ==========================================

// POST /api/comentarios/:id/like (Toggle like a un comentario)
const toggleLikeComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: `No se encontró el comentario con ID ${id}.` });
    }

    const likeExistente = await LikeComentario.findOne({
      where: { id_usuario, id_comentario: id },
    });

    if (likeExistente) {
      await likeExistente.destroy();
      const totalLikes = await LikeComentario.count({ where: { id_comentario: id } });
      return res.status(200).json({
        message: 'Like removido del comentario.',
        isLiked: false,
        totalLikes,
      });
    } else {
      const nuevoLike = await LikeComentario.create({ id_usuario, id_comentario: id });
      const totalLikes = await LikeComentario.count({ where: { id_comentario: id } });
      return res.status(201).json({
        message: 'Like agregado exitosamente al comentario.',
        isLiked: true,
        like: nuevoLike,
        totalLikes,
      });
    }
  } catch (error) {
    console.error('Error en toggleLikeComentario:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar el like del comentario.' });
  }
};

// DELETE /api/comentarios/:id/like
const removeLikeComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const like = await LikeComentario.findOne({ where: { id_usuario, id_comentario: id } });
    if (!like) {
      return res.status(404).json({ error: 'No se encontró un like del usuario para este comentario.' });
    }

    await like.destroy();
    const totalLikes = await LikeComentario.count({ where: { id_comentario: id } });
    return res.status(200).json({
      message: 'Like eliminado del comentario.',
      isLiked: false,
      totalLikes,
    });
  } catch (error) {
    console.error('Error en removeLikeComentario:', error);
    return res.status(500).json({ error: 'Error interno al remover el like del comentario.' });
  }
};

// GET /api/comentarios/:id/likes
const getComentarioLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: `No se encontró el comentario con ID ${id}.` });
    }

    const likes = await LikeComentario.findAll({
      where: { id_comentario: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
      ],
      order: [['fecha_like', 'DESC']],
    });

    return res.status(200).json({
      id_comentario: parseInt(id, 10),
      totalLikes: likes.length,
      likes,
    });
  } catch (error) {
    console.error('Error en getComentarioLikes:', error);
    return res.status(500).json({ error: 'Error interno al obtener los likes del comentario.' });
  }
};

// ==========================================
// 4. LIKES EN PUBLICACIONES
// ==========================================

// POST /api/publicaciones/:id/like (Toggle like a una publicación)
const toggleLikePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ error: `No se encontró la publicación con ID ${id}.` });
    }

    const likeExistente = await LikePublicacion.findOne({
      where: { id_usuario, id_publicacion: id },
    });

    if (likeExistente) {
      await likeExistente.destroy();
      const totalLikes = await LikePublicacion.count({ where: { id_publicacion: id } });
      return res.status(200).json({
        message: 'Like removido de la publicación.',
        isLiked: false,
        totalLikes,
      });
    } else {
      const nuevoLike = await LikePublicacion.create({ id_usuario, id_publicacion: id });
      const totalLikes = await LikePublicacion.count({ where: { id_publicacion: id } });
      return res.status(201).json({
        message: 'Like agregado exitosamente a la publicación.',
        isLiked: true,
        like: nuevoLike,
        totalLikes,
      });
    }
  } catch (error) {
    console.error('Error en toggleLikePublicacion:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar el like de la publicación.' });
  }
};

// DELETE /api/publicaciones/:id/like
const removeLikePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    const like = await LikePublicacion.findOne({ where: { id_usuario, id_publicacion: id } });
    if (!like) {
      return res.status(404).json({ error: 'No se encontró un like del usuario para esta publicación.' });
    }

    await like.destroy();
    const totalLikes = await LikePublicacion.count({ where: { id_publicacion: id } });
    return res.status(200).json({
      message: 'Like eliminado de la publicación.',
      isLiked: false,
      totalLikes,
    });
  } catch (error) {
    console.error('Error en removeLikePublicacion:', error);
    return res.status(500).json({ error: 'Error interno al remover el like de la publicación.' });
  }
};

// GET /api/publicaciones/:id/likes
const getPublicacionLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ error: `No se encontró la publicación con ID ${id}.` });
    }

    const likes = await LikePublicacion.findAll({
      where: { id_publicacion: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
      ],
      order: [['fecha_like', 'DESC']],
    });

    return res.status(200).json({
      id_publicacion: parseInt(id, 10),
      totalLikes: likes.length,
      likes,
    });
  } catch (error) {
    console.error('Error en getPublicacionLikes:', error);
    return res.status(500).json({ error: 'Error interno al obtener los likes de la publicación.' });
  }
};

// ==========================================
// 5. MIS LIKES (Consultar todo lo que el usuario ha likeado)
// ==========================================

// GET /api/auth/me/likes (o GET /api/usuarios/me/likes)
const getMisLikes = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;

    const [tracksLiked, resenasLiked, comentariosLiked, publicacionesLiked] = await Promise.all([
      LikeTrack.findAll({
        where: { id_usuario },
        include: [{ model: Track, as: 'track' }],
        order: [['fecha_like', 'DESC']],
      }),
      LikeResena.findAll({
        where: { id_usuario },
        include: [{ model: Resena, as: 'resena' }],
        order: [['fecha_like', 'DESC']],
      }),
      LikeComentario.findAll({
        where: { id_usuario },
        include: [{ model: Comentario, as: 'comentario' }],
        order: [['fecha_like', 'DESC']],
      }),
      LikePublicacion.findAll({
        where: { id_usuario },
        include: [{ model: Publicacion, as: 'publicacion' }],
        order: [['fecha_like', 'DESC']],
      }),
    ]);

    return res.status(200).json({
      id_usuario,
      resumen: {
        totalTracks: tracksLiked.length,
        totalResenas: resenasLiked.length,
        totalComentarios: comentariosLiked.length,
        totalPublicaciones: publicacionesLiked.length,
      },
      tracksLiked,
      resenasLiked,
      comentariosLiked,
      publicacionesLiked,
    });
  } catch (error) {
    console.error('Error en getMisLikes:', error);
    return res.status(500).json({ error: 'Error interno al obtener los likes del usuario.' });
  }
};

module.exports = {
  toggleLikeTrack,
  removeLikeTrack,
  getTrackLikes,
  toggleLikeResena,
  removeLikeResena,
  getResenaLikes,
  toggleLikeComentario,
  removeLikeComentario,
  getComentarioLikes,
  toggleLikePublicacion,
  removeLikePublicacion,
  getPublicacionLikes,
  getMisLikes,
};

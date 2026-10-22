const { Resena, Publicacion, Album, Usuario, LikeResena } = require('../models');

const getAllResenas = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const { count, rows: resenas } = await Resena.findAndCountAll({
      include: [
        {
          model: Publicacion,
          as: 'publicacion',
          include: [
            {
              model: Usuario,
              as: 'autor',
              attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
            },
          ],
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id_album', 'titulo', 'portada_url', 'fecha_lanzamiento'],
        },
        {
          model: LikeResena,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
      order: [['fecha_creacion', 'DESC']],
      limit,
      offset,
    });

    const resenasFormat = resenas.map((r) => {
      const data = r.toJSON();
      data.totalLikes = data.likes ? data.likes.length : 0;
      data.likesCount = data.totalLikes;
      data.likes = data.totalLikes;
      data.isLiked = userId && data.likes ? data.likes.some((l) => l.id_usuario === userId) : false;
      return data;
    });

    return res.status(200).json({
      total: count,
      limit,
      offset,
      resenas: resenasFormat,
    });
  } catch (error) {
    console.error('Error en getAllResenas:', error);
    return res.status(500).json({ error: 'Error interno al obtener las reseñas.' });
  }
};

const getResenaById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const resena = await Resena.findByPk(id, {
      include: [
        {
          model: Publicacion,
          as: 'publicacion',
          include: [
            {
              model: Usuario,
              as: 'autor',
              attributes: ['id_usuario', 'username', 'avatar_url', 'bio', 'rol'],
            },
          ],
        },
        {
          model: Album,
          as: 'album',
        },
        {
          model: LikeResena,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
    });

    if (!resena) {
      return res.status(404).json({ error: `No se encontró la reseña con ID ${id}.` });
    }

    const data = resena.toJSON();
    data.totalLikes = data.likes ? data.likes.length : 0;
    data.likesCount = data.totalLikes;
    data.likes = data.totalLikes;
    data.isLiked = userId && data.likes ? data.likes.some((l) => l.id_usuario === userId) : false;

    return res.status(200).json({ resena: data });
  } catch (error) {
    console.error('Error en getResenaById:', error);
    return res.status(500).json({ error: 'Error interno al obtener la reseña.' });
  }
};

const createResena = async (req, res) => {
  try {
    const { id_album, calificacion, texto_critico, texto_publicacion } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!id_album || calificacion === undefined) {
      return res.status(400).json({
        error: 'El id_album y la calificacion (1-5) son obligatorios.',
      });
    }

    const album = await Album.findByPk(id_album);
    if (!album) {
      return res.status(404).json({ error: `No se encontró el álbum con ID ${id_album}.` });
    }

    // Una reseña está incluida en una publicación base según el diagrama E/R
    const publicacion = await Publicacion.create({
      texto: texto_publicacion || texto_critico || `Reseña de ${album.titulo}`,
      id_usuario,
    });

    const nuevaResena = await Resena.create({
      id_publicacion: publicacion.id_publicacion,
      id_album,
      calificacion: parseInt(calificacion, 10),
      texto_critico: texto_critico || null,
    });

    const resenaCompleta = await Resena.findByPk(nuevaResena.id_resena, {
      include: [
        {
          model: Publicacion,
          as: 'publicacion',
          include: [{ model: Usuario, as: 'autor', attributes: ['id_usuario', 'username', 'avatar_url'] }],
        },
        {
          model: Album,
          as: 'album',
        },
      ],
    });

    const data = resenaCompleta.toJSON();
    data.totalLikes = 0;
    data.likesCount = 0;
    data.likes = 0;
    data.isLiked = false;

    return res.status(201).json({
      message: 'Reseña creada exitosamente.',
      resena: data,
    });
  } catch (error) {
    console.error('Error en createResena:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map((e) => e.message).join(', '),
      });
    }
    return res.status(500).json({ error: 'Error interno al crear la reseña.' });
  }
};

module.exports = {
  getAllResenas,
  getResenaById,
  createResena,
};

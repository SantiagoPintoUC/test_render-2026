const { Comentario, Usuario, Publicacion, LikeComentario } = require('../models');

const getAllComentarios = async (req, res) => {
  try {
    const { id_publicacion } = req.query;
    const whereClause = {};
    if (id_publicacion) {
      whereClause.id_publicacion = id_publicacion;
    }

    const comentarios = await Comentario.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
        {
          model: LikeComentario,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
      order: [['fecha_creacion', 'ASC']],
    });

    const comentariosFormat = comentarios.map((c) => {
      const data = c.toJSON();
      data.totalLikes = data.likes ? data.likes.length : 0;
      return data;
    });

    return res.status(200).json({
      total: comentarios.length,
      comentarios: comentariosFormat,
    });
  } catch (error) {
    console.error('Error en getAllComentarios:', error);
    return res.status(500).json({ error: 'Error interno al obtener los comentarios.' });
  }
};

const getComentarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await Comentario.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
        {
          model: LikeComentario,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
    });

    if (!comentario) {
      return res.status(404).json({ error: `No se encontró el comentario con ID ${id}.` });
    }

    const data = comentario.toJSON();
    data.totalLikes = data.likes ? data.likes.length : 0;

    return res.status(200).json({ comentario: data });
  } catch (error) {
    console.error('Error en getComentarioById:', error);
    return res.status(500).json({ error: 'Error interno al obtener el comentario.' });
  }
};

const createComentario = async (req, res) => {
  try {
    const { id_publicacion, texto } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!id_publicacion || !texto || texto.trim() === '') {
      return res.status(400).json({
        error: 'El id_publicacion y el texto son obligatorios.',
      });
    }

    const publicacion = await Publicacion.findByPk(id_publicacion);
    if (!publicacion) {
      return res.status(404).json({ error: `No se encontró la publicación con ID ${id_publicacion}.` });
    }

    const nuevoComentario = await Comentario.create({
      id_publicacion,
      id_usuario,
      texto: texto.trim(),
    });

    const comentarioCompleto = await Comentario.findByPk(nuevoComentario.id_comentario, {
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
      ],
    });

    return res.status(201).json({
      message: 'Comentario creado exitosamente.',
      comentario: comentarioCompleto,
    });
  } catch (error) {
    console.error('Error en createComentario:', error);
    return res.status(500).json({ error: 'Error interno al crear el comentario.' });
  }
};

module.exports = {
  getAllComentarios,
  getComentarioById,
  createComentario,
};

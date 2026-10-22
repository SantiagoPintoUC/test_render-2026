const { Track, Usuario, Album, LikeTrack } = require('../models');

const getAllTracks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const { count, rows: tracks } = await Track.findAndCountAll({
      include: [
        {
          model: Usuario,
          as: 'artista',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id_album', 'titulo', 'portada_url'],
        },
        {
          model: LikeTrack,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
      order: [['id_track', 'DESC']],
      limit,
      offset,
    });

    const tracksFormat = tracks.map((t) => {
      const data = t.toJSON();
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
      tracks: tracksFormat,
    });
  } catch (error) {
    console.error('Error en getAllTracks:', error);
    return res.status(500).json({ error: 'Error interno al obtener los tracks.' });
  }
};

const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.usuario ? req.usuario.id_usuario : null;

    const track = await Track.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'artista',
          attributes: ['id_usuario', 'username', 'avatar_url', 'bio', 'rol'],
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id_album', 'titulo', 'fecha_lanzamiento', 'portada_url'],
        },
        {
          model: LikeTrack,
          as: 'likes',
          attributes: ['id_usuario', 'fecha_like'],
        },
      ],
    });

    if (!track) {
      return res.status(404).json({ error: `No se encontró el track con ID ${id}.` });
    }

    const data = track.toJSON();
    data.totalLikes = data.likes ? data.likes.length : 0;
    data.likesCount = data.totalLikes;
    data.likes = data.totalLikes;
    data.isLiked = userId && data.likes ? data.likes.some((l) => l.id_usuario === userId) : false;

    return res.status(200).json({ track: data });
  } catch (error) {
    console.error('Error en getTrackById:', error);
    return res.status(500).json({ error: 'Error interno al obtener el track.' });
  }
};

const createTrack = async (req, res) => {
  try {
    const { titulo, duracion, archivo_audio, estado, id_album } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!titulo || !duracion || !archivo_audio) {
      return res.status(400).json({
        error: 'Los campos titulo, duracion y archivo_audio son obligatorios.',
      });
    }

    const nuevoTrack = await Track.create({
      titulo: titulo.trim(),
      duracion: parseInt(duracion, 10),
      archivo_audio: archivo_audio.trim(),
      estado: estado || 'publicado',
      id_usuario,
      id_album: id_album || null,
    });

    const trackCompleto = await Track.findByPk(nuevoTrack.id_track, {
      include: [
        {
          model: Usuario,
          as: 'artista',
          attributes: ['id_usuario', 'username', 'avatar_url', 'rol'],
        },
        {
          model: Album,
          as: 'album',
        },
      ],
    });

    const data = trackCompleto.toJSON();
    data.totalLikes = 0;
    data.likesCount = 0;
    data.likes = 0;
    data.isLiked = false;

    return res.status(201).json({
      message: 'Track creado exitosamente.',
      track: data,
    });
  } catch (error) {
    console.error('Error en createTrack:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map((e) => e.message).join(', '),
      });
    }
    return res.status(500).json({ error: 'Error interno al crear el track.' });
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
};

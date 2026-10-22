const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Album = require('./Album');
const Track = require('./Track');
const Resena = require('./Resena');
const Comentario = require('./Comentario');
const LikeTrack = require('./LikeTrack');
const LikeResena = require('./LikeResena');
const LikeComentario = require('./LikeComentario');
const LikePublicacion = require('./LikePublicacion');

// --- Relaciones Base E/R ---

// 1. Usuario <-> Publicación (1:N)
Usuario.hasMany(Publicacion, {
  foreignKey: 'id_usuario',
  as: 'publicaciones',
  onDelete: 'CASCADE',
});
Publicacion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'autor',
});

// 2. Álbum <-> Track (1:N)
Album.hasMany(Track, {
  foreignKey: 'id_album',
  as: 'tracks',
  onDelete: 'SET NULL',
});
Track.belongsTo(Album, {
  foreignKey: 'id_album',
  as: 'album',
});

// 3. Usuario <-> Track ("sube", 1:N)
Usuario.hasMany(Track, {
  foreignKey: 'id_usuario',
  as: 'tracks',
  onDelete: 'CASCADE',
});
Track.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'artista',
});

// 4. Publicación <-> Reseña ("incluye", 1:0..1)
Publicacion.hasOne(Resena, {
  foreignKey: 'id_publicacion',
  as: 'resena',
  onDelete: 'CASCADE',
});
Resena.belongsTo(Publicacion, {
  foreignKey: 'id_publicacion',
  as: 'publicacion',
});

// 5. Álbum <-> Reseña ("reseña", 1:N)
Album.hasMany(Resena, {
  foreignKey: 'id_album',
  as: 'resenas',
  onDelete: 'CASCADE',
});
Resena.belongsTo(Album, {
  foreignKey: 'id_album',
  as: 'album',
});

// 6. Usuario <-> Comentario ("comenta", 1:N)
Usuario.hasMany(Comentario, {
  foreignKey: 'id_usuario',
  as: 'comentarios',
  onDelete: 'CASCADE',
});
Comentario.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'autor',
});

// 7. Publicación <-> Comentario ("tiene", 1:N)
Publicacion.hasMany(Comentario, {
  foreignKey: 'id_publicacion',
  as: 'comentarios',
  onDelete: 'CASCADE',
});
Comentario.belongsTo(Publicacion, {
  foreignKey: 'id_publicacion',
  as: 'publicacion',
});

// --- Relaciones de LIKES (Muchos a Muchos según Diagrama XML) ---

// 8. Usuario <-> Track (Likes N:M "da like")
Usuario.belongsToMany(Track, {
  through: LikeTrack,
  foreignKey: 'id_usuario',
  otherKey: 'id_track',
  as: 'tracksLiked',
});
Track.belongsToMany(Usuario, {
  through: LikeTrack,
  foreignKey: 'id_track',
  otherKey: 'id_usuario',
  as: 'usuariosLikes',
});
Usuario.hasMany(LikeTrack, {
  foreignKey: 'id_usuario',
  as: 'likesTracks',
  onDelete: 'CASCADE',
});
LikeTrack.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
Track.hasMany(LikeTrack, {
  foreignKey: 'id_track',
  as: 'likes',
  onDelete: 'CASCADE',
});
LikeTrack.belongsTo(Track, {
  foreignKey: 'id_track',
  as: 'track',
});

// 9. Usuario <-> Reseña (Likes N:M "da like")
Usuario.belongsToMany(Resena, {
  through: LikeResena,
  foreignKey: 'id_usuario',
  otherKey: 'id_resena',
  as: 'resenasLiked',
});
Resena.belongsToMany(Usuario, {
  through: LikeResena,
  foreignKey: 'id_resena',
  otherKey: 'id_usuario',
  as: 'usuariosLikes',
});
Usuario.hasMany(LikeResena, {
  foreignKey: 'id_usuario',
  as: 'likesResenas',
  onDelete: 'CASCADE',
});
LikeResena.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
Resena.hasMany(LikeResena, {
  foreignKey: 'id_resena',
  as: 'likes',
  onDelete: 'CASCADE',
});
LikeResena.belongsTo(Resena, {
  foreignKey: 'id_resena',
  as: 'resena',
});

// 10. Usuario <-> Comentario (Likes N:M "da like")
Usuario.belongsToMany(Comentario, {
  through: LikeComentario,
  foreignKey: 'id_usuario',
  otherKey: 'id_comentario',
  as: 'comentariosLiked',
});
Comentario.belongsToMany(Usuario, {
  through: LikeComentario,
  foreignKey: 'id_comentario',
  otherKey: 'id_usuario',
  as: 'usuariosLikes',
});
Usuario.hasMany(LikeComentario, {
  foreignKey: 'id_usuario',
  as: 'likesComentarios',
  onDelete: 'CASCADE',
});
LikeComentario.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
Comentario.hasMany(LikeComentario, {
  foreignKey: 'id_comentario',
  as: 'likes',
  onDelete: 'CASCADE',
});
LikeComentario.belongsTo(Comentario, {
  foreignKey: 'id_comentario',
  as: 'comentario',
});

// 11. Usuario <-> Publicación (Likes N:M para el feed de la plataforma)
Usuario.belongsToMany(Publicacion, {
  through: LikePublicacion,
  foreignKey: 'id_usuario',
  otherKey: 'id_publicacion',
  as: 'publicacionesLiked',
});
Publicacion.belongsToMany(Usuario, {
  through: LikePublicacion,
  foreignKey: 'id_publicacion',
  otherKey: 'id_usuario',
  as: 'usuariosLikes',
});
Usuario.hasMany(LikePublicacion, {
  foreignKey: 'id_usuario',
  as: 'likesPublicaciones',
  onDelete: 'CASCADE',
});
LikePublicacion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
Publicacion.hasMany(LikePublicacion, {
  foreignKey: 'id_publicacion',
  as: 'likes',
  onDelete: 'CASCADE',
});
LikePublicacion.belongsTo(Publicacion, {
  foreignKey: 'id_publicacion',
  as: 'publicacion',
});

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Album,
  Track,
  Resena,
  Comentario,
  LikeTrack,
  LikeResena,
  LikeComentario,
  LikePublicacion,
};

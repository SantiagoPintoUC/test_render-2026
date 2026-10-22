const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeComentario = sequelize.define(
  'LikeComentario',
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'id_usuario',
      references: {
        model: 'usuarios',
        key: 'id_usuario',
      },
      onDelete: 'CASCADE',
    },
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'id_comentario',
      references: {
        model: 'comentarios',
        key: 'id_comentario',
      },
      onDelete: 'CASCADE',
    },
    fecha_like: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_like',
    },
  },
  {
    tableName: 'likes_comentarios',
    timestamps: false,
  }
);

module.exports = LikeComentario;

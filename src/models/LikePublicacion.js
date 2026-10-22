const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikePublicacion = sequelize.define(
  'LikePublicacion',
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
    id_publicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'id_publicacion',
      references: {
        model: 'publicaciones',
        key: 'id_publicacion',
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
    tableName: 'likes_publicaciones',
    timestamps: false,
  }
);

module.exports = LikePublicacion;

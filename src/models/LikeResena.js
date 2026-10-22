const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeResena = sequelize.define(
  'LikeResena',
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
    id_resena: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'id_resena',
      references: {
        model: 'resenas',
        key: 'id_resena',
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
    tableName: 'likes_resenas',
    timestamps: false,
  }
);

module.exports = LikeResena;

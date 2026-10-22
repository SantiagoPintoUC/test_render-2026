const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeTrack = sequelize.define(
  'LikeTrack',
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
    id_track: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'id_track',
      references: {
        model: 'tracks',
        key: 'id_track',
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
    tableName: 'likes_tracks',
    timestamps: false,
  }
);

module.exports = LikeTrack;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Track = sequelize.define(
  'Track',
  {
    id_track: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_track',
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título del track no puede estar vacío' },
      },
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'La duración debe ser un número entero en segundos' },
        min: { args: [1], msg: 'La duración debe ser de al menos 1 segundo' },
      },
      comment: 'Duración en segundos',
    },
    archivo_audio: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'archivo_audio',
      validate: {
        notEmpty: { msg: 'La URL o ruta del archivo de audio es requerida' },
      },
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'publicado',
      validate: {
        isIn: {
          args: [['borrador', 'publicado', 'archivado']],
          msg: 'El estado debe ser borrador, publicado o archivado',
        },
      },
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_usuario',
      references: {
        model: 'usuarios',
        key: 'id_usuario',
      },
      onDelete: 'CASCADE',
    },
    id_album: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_album',
      references: {
        model: 'albumes',
        key: 'id_album',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    tableName: 'tracks',
    timestamps: false,
  }
);

module.exports = Track;

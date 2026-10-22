const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define(
  'Album',
  {
    id_album: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_album',
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título del álbum no puede estar vacío' },
      },
    },
    fecha_lanzamiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'fecha_lanzamiento',
    },
    portada_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'portada_url',
    },
  },
  {
    tableName: 'albumes',
    timestamps: false,
  }
);

module.exports = Album;

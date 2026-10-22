const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resena = sequelize.define(
  'Resena',
  {
    id_resena: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_resena',
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'id_publicacion',
      references: {
        model: 'publicaciones',
        key: 'id_publicacion',
      },
      onDelete: 'CASCADE',
    },
    id_album: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_album',
      references: {
        model: 'albumes',
        key: 'id_album',
      },
      onDelete: 'CASCADE',
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'La calificación debe ser un número entero' },
        min: { args: [1], msg: 'La calificación mínima es 1' },
        max: { args: [5], msg: 'La calificación máxima es 5' },
      },
    },
    texto_critico: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'texto_critico',
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion',
    },
  },
  {
    tableName: 'resenas',
    timestamps: false,
  }
);

module.exports = Resena;

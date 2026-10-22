const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publicacion = sequelize.define(
  'Publicacion',
  {
    id_publicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_publicacion',
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El texto de la publicación no puede estar vacío',
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
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion',
    },
  },
  {
    tableName: 'publicaciones',
    timestamps: false,
  }
);

module.exports = Publicacion;

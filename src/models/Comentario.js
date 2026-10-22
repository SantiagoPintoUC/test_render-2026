const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define(
  'Comentario',
  {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_comentario',
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El texto del comentario no puede estar vacío' },
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
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_publicacion',
      references: {
        model: 'publicaciones',
        key: 'id_publicacion',
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
    tableName: 'comentarios',
    timestamps: false,
  }
);

module.exports = Comentario;

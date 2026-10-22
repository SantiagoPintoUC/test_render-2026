const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_usuario',
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'El nombre de usuario ya se encuentra registrado',
      },
      validate: {
        notEmpty: { msg: 'El nombre de usuario no puede estar vacío' },
        len: { args: [3, 50], msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres' },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'El correo electrónico ya se encuentra registrado',
      },
      validate: {
        isEmail: { msg: 'Debe ingresar un correo electrónico válido' },
        notEmpty: { msg: 'El correo electrónico no puede estar vacío' },
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'El avatar debe ser una URL válida',
          // Permitir vacío o nulo
          args: true,
        },
      },
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'moderador', 'admin'),
      allowNull: false,
      defaultValue: 'usuario',
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_registro',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password_hash && !usuario.password_hash.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password_hash') && !usuario.password_hash.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
        }
      },
    },
  }
);

// Método de instancia para verificar contraseña
Usuario.prototype.validarPassword = async function (passwordPlano) {
  return await bcrypt.compare(passwordPlano, this.password_hash);
};

// Evitar exponer password_hash al serializar JSON
Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

module.exports = Usuario;

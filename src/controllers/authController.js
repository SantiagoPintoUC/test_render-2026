const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Usuario } = require('../models');

// Generador de Token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET || 'playgram_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password, bio, avatar_url, rol } = req.body;

    // Validaciones básicas de entrada
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Los campos username, email y password son obligatorios.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres.',
      });
    }

    // Verificar si ya existe el username o email
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (usuarioExistente) {
      if (usuarioExistente.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({
          error: 'El nombre de usuario ya se encuentra registrado.',
        });
      }
      if (usuarioExistente.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({
          error: 'El correo electrónico ya se encuentra registrado.',
        });
      }
    }

    // Crear el nuevo usuario (el hook beforeCreate hashea el password automáticamente)
    const nuevoUsuario = await Usuario.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash: password,
      bio: bio || '',
      avatar_url: avatar_url || null,
      rol: rol && ['usuario', 'moderador', 'admin'].includes(rol) ? rol : 'usuario',
    });

    // Generar token JWT para iniciar sesión de inmediato
    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente en Playgram.',
      token,
      usuario: nuevoUsuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en register:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map((e) => e.message).join(', '),
      });
    }
    return res.status(500).json({
      error: 'Ocurrió un error interno al registrar el usuario.',
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginIdentifier = email || username || identifier;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        error: 'Debe ingresar su usuario o email y su contraseña.',
      });
    }

    // Buscar por correo o por username
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { email: loginIdentifier.trim().toLowerCase() },
          { username: loginIdentifier.trim() },
        ],
      },
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas. Usuario o contraseña incorrectos.',
      });
    }

    // Validar contraseña hasheada
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas. Usuario o contraseña incorrectos.',
      });
    }

    // Generar token JWT
    const token = generarToken(usuario);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      error: 'Ocurrió un error interno al iniciar sesión.',
    });
  }
};

// GET /api/auth/me (Verificar sesión actual)
const getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado.',
      });
    }

    return res.status(200).json({
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    return res.status(500).json({
      error: 'Ocurrió un error interno al obtener el perfil.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso no autorizado. Debe proporcionar un token Bearer en el encabezado Authorization.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'playgram_super_secret_jwt_key_2026'
    );
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido o expirado. Por favor, inicie sesión nuevamente.',
    });
  }
};

// Middleware opcional: si se envía un token válido, se asocia el usuario; si no, se permite el acceso como anónimo
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'playgram_super_secret_jwt_key_2026'
      );
      req.usuario = decoded;
    } catch (error) {
      // Token inválido o expirado en ruta pública se ignora
      req.usuario = null;
    }
  } else {
    req.usuario = null;
  }
  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};

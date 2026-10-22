const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    // sinc modelos en desarrollo (crea las tablas si no existen)
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor Playgram corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Error al iniciar el servidor o conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();

const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('../models');

async function initDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida exitosamente.');

    console.log('🔄 Sincronizando modelos con la base de datos...');
    // sync({ alter: true }) actualiza las tablas sin borrar datos existentes
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas correctamente en PostgreSQL:');
    console.log('   - usuarios');
    console.log('   - publicaciones');
    console.log('   - albumes');
    console.log('   - tracks');
    console.log('   - resenas');
    console.log('   - comentarios');
    console.log('   - likes_tracks (Relación Usuario <-> Track)');
    console.log('   - likes_resenas (Relación Usuario <-> Reseña)');
    console.log('   - likes_comentarios (Relación Usuario <-> Comentario)');
    console.log('   - likes_publicaciones (Relación Usuario <-> Publicación)');

    console.log('🎉 Estructura de base de datos lista.');
    console.log('💡 Si desea poblar la base de datos con datos de prueba iniciales, ejecute: npm run db:seed\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();

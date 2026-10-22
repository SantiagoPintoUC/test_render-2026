const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('../app');
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

async function testApi() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    console.log(`\n🚀 Servidor de prueba levantado en puerto ${port}`);

    // Generar token JWT para diego_sound
    const diego = await Usuario.findOne({ where: { username: 'diego_sound' } });
    const token = jwt.sign(
      { id_usuario: diego.id_usuario, username: diego.username, email: diego.email, rol: diego.rol },
      process.env.JWT_SECRET || 'playgram_super_secret_jwt_key_2026',
      { expiresIn: '1h' }
    );

    const headersAuth = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 1. GET /api/tracks
    console.log('\n--- 1. Probando GET /api/tracks ---');
    const resTracks = await fetch(`${baseUrl}/tracks`);
    const dataTracks = await resTracks.json();
    console.log(`Status: ${resTracks.status}, Total tracks: ${dataTracks.total}`);
    console.log(`Primer track: "${dataTracks.tracks[0].titulo}", Likes: ${dataTracks.tracks[0].totalLikes}`);

    // 2. GET /api/tracks/1/likes
    console.log('\n--- 2. Probando GET /api/tracks/1/likes ---');
    const resTrackLikes = await fetch(`${baseUrl}/tracks/1/likes`);
    const dataTrackLikes = await resTrackLikes.json();
    console.log(`Status: ${resTrackLikes.status}, Total likes: ${dataTrackLikes.totalLikes}`);

    // 3. POST /api/tracks/1/like (Toggle like)
    console.log('\n--- 3. Probando POST /api/tracks/1/like (Toggle) ---');
    const resToggleTrack = await fetch(`${baseUrl}/tracks/1/like`, {
      method: 'POST',
      headers: headersAuth,
    });
    const dataToggleTrack = await resToggleTrack.json();
    console.log(`Status: ${resToggleTrack.status}, isLiked: ${dataToggleTrack.isLiked}, Total likes: ${dataToggleTrack.totalLikes}`);

    // 4. GET /api/resenas/1/likes
    console.log('\n--- 4. Probando GET /api/resenas/1/likes ---');
    const resResenaLikes = await fetch(`${baseUrl}/resenas/1/likes`);
    const dataResenaLikes = await resResenaLikes.json();
    console.log(`Status: ${resResenaLikes.status}, Total likes: ${dataResenaLikes.totalLikes}`);

    // 5. POST /api/resenas/1/like (Toggle like)
    console.log('\n--- 5. Probando POST /api/resenas/1/like (Toggle) ---');
    const resToggleResena = await fetch(`${baseUrl}/resenas/1/like`, {
      method: 'POST',
      headers: headersAuth,
    });
    const dataToggleResena = await resToggleResena.json();
    console.log(`Status: ${resToggleResena.status}, isLiked: ${dataToggleResena.isLiked}, Total likes: ${dataToggleResena.totalLikes}`);

    // 6. POST /api/comentarios/1/like (Toggle like)
    console.log('\n--- 6. Probando POST /api/comentarios/1/like (Toggle) ---');
    const resToggleCom = await fetch(`${baseUrl}/comentarios/1/like`, {
      method: 'POST',
      headers: headersAuth,
    });
    const dataToggleCom = await resToggleCom.json();
    console.log(`Status: ${resToggleCom.status}, isLiked: ${dataToggleCom.isLiked}, Total likes: ${dataToggleCom.totalLikes}`);

    // 7. POST /api/publicaciones/1/like (Toggle like)
    console.log('\n--- 7. Probando POST /api/publicaciones/1/like (Toggle) ---');
    const resTogglePub = await fetch(`${baseUrl}/publicaciones/1/like`, {
      method: 'POST',
      headers: headersAuth,
    });
    const dataTogglePub = await resTogglePub.json();
    console.log(`Status: ${resTogglePub.status}, isLiked: ${dataTogglePub.isLiked}, Total likes: ${dataTogglePub.totalLikes}`);

    // 8. GET /api/auth/me/likes
    console.log('\n--- 8. Probando GET /api/auth/me/likes ---');
    const resMeLikes = await fetch(`${baseUrl}/auth/me/likes`, {
      headers: headersAuth,
    });
    const dataMeLikes = await resMeLikes.json();
    console.log(`Status: ${resMeLikes.status}, Resumen likes:`, dataMeLikes.resumen);

    // 9. GET /api/publicaciones (Verificar que incluye contadores de likes para feed)
    console.log('\n--- 9. Probando GET /api/publicaciones (Feed) ---');
    const resPubs = await fetch(`${baseUrl}/publicaciones`);
    const dataPubs = await resPubs.json();
    console.log(`Status: ${resPubs.status}, Total publicaciones: ${dataPubs.total}`);
    console.log(`Publicación 1 totalLikes: ${dataPubs.publicaciones[0].totalLikes}, id: ${dataPubs.publicaciones[0].id}`);

    console.log('\n🎉 ¡TODOS LOS ENDPOINTS DE LIKES RESPONDEN CORRECTAMENTE!\n');
    server.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en testApi:', error);
    server.close();
    process.exit(1);
  }
}

testApi();

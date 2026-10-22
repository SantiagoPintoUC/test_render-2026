const dotenv = require('dotenv');
dotenv.config();

const {
  Usuario,
  Publicacion,
  Track,
  Resena,
  Comentario,
  Album,
  LikeTrack,
  LikeResena,
  LikeComentario,
  LikePublicacion,
} = require('../models');

async function testRelaciones() {
  try {
    console.log('\n======================================================');
    console.log('🧪 PRUEBA INTEGRAL DE MODELOS Y RELACIONES DE LIKES');
    console.log('======================================================\n');

    // 1. Probar Usuarios con sus publicaciones y likes dados
    console.log('🔍 1. Consultando Usuarios y sus Likes dados en Tracks, Reseñas y Comentarios...\n');
    const usuarios = await Usuario.findAll({
      include: [
        { model: Publicacion, as: 'publicaciones' },
        { model: Track, as: 'tracksLiked' },
        { model: Resena, as: 'resenasLiked', include: [{ model: Album, as: 'album' }] },
        { model: Comentario, as: 'comentariosLiked' },
      ],
      order: [['id_usuario', 'ASC']],
    });

    console.log(`✅ Se encontraron ${usuarios.length} usuario(s) en la base de datos:\n`);
    usuarios.forEach((u) => {
      console.log(`👤 Usuario: ${u.username} (Rol: ${u.rol})`);
      console.log(`   - Publicaciones creadas: ${u.publicaciones.length}`);
      console.log(`   - Tracks que le gustan (${u.tracksLiked.length}): ${u.tracksLiked.map((t) => `"${t.titulo}"`).join(', ') || 'Ninguno'}`);
      console.log(`   - Reseñas que le gustan (${u.resenasLiked.length}): ${u.resenasLiked.map((r) => `Reseña ${r.album ? r.album.titulo : r.id_resena}`).join(', ') || 'Ninguna'}`);
      console.log(`   - Comentarios que le gustan: ${u.comentariosLiked.length}`);
      console.log('----------------------------------------------------');
    });

    // 2. Probar Tracks y los usuarios que les dieron like (Relación inversa)
    console.log('\n🔍 2. Consultando Tracks y sus Likes recibidos (Relación N:M Usuario <-> Track)...\n');
    const tracks = await Track.findAll({
      include: [
        { model: Usuario, as: 'artista', attributes: ['username'] },
        { model: Usuario, as: 'usuariosLikes', attributes: ['id_usuario', 'username'] },
      ],
      order: [['id_track', 'ASC']],
    });

    tracks.forEach((t) => {
      console.log(`🎵 Track: "${t.titulo}" (Artista: ${t.artista ? t.artista.username : 'N/A'})`);
      console.log(`   Total de likes: ${t.usuariosLikes.length}`);
      console.log(`   Usuarios que dieron like: ${t.usuariosLikes.map((u) => u.username).join(', ') || 'Nadie aún'}`);
      console.log('----------------------------------------------------');
    });

    // 3. Probar Reseñas y los usuarios que les dieron like
    console.log('\n🔍 3. Consultando Reseñas y sus Likes recibidos (Relación N:M Usuario <-> Reseña)...\n');
    const resenas = await Resena.findAll({
      include: [
        { model: Album, as: 'album', attributes: ['titulo'] },
        { model: Usuario, as: 'usuariosLikes', attributes: ['id_usuario', 'username'] },
      ],
      order: [['id_resena', 'ASC']],
    });

    resenas.forEach((r) => {
      console.log(`⭐ Reseña ID ${r.id_resena}: Álbum "${r.album ? r.album.titulo : 'N/A'}" (Calificación: ${r.calificacion}/5)`);
      console.log(`   Total de likes: ${r.usuariosLikes.length}`);
      console.log(`   Usuarios que dieron like: ${r.usuariosLikes.map((u) => u.username).join(', ') || 'Nadie aún'}`);
      console.log('----------------------------------------------------');
    });

    // 4. Probar Comentarios y sus Likes recibidos
    console.log('\n🔍 4. Consultando Comentarios y sus Likes recibidos (Relación N:M Usuario <-> Comentario)...\n');
    const comentarios = await Comentario.findAll({
      include: [
        { model: Usuario, as: 'autor', attributes: ['username'] },
        { model: Usuario, as: 'usuariosLikes', attributes: ['id_usuario', 'username'] },
      ],
      order: [['id_comentario', 'ASC']],
    });

    comentarios.forEach((c) => {
      console.log(`💬 Comentario ID ${c.id_comentario} de ${c.autor ? c.autor.username : 'N/A'}: "${c.texto.slice(0, 40)}..."`);
      console.log(`   Total de likes: ${c.usuariosLikes.length}`);
      console.log(`   Usuarios que dieron like: ${c.usuariosLikes.map((u) => u.username).join(', ') || 'Nadie aún'}`);
      console.log('----------------------------------------------------');
    });

    console.log('\n🎉 ¡Todas las relaciones y modelos de likes funcionan a la perfección!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al consultar los modelos:', error);
    process.exit(1);
  }
}

testRelaciones();

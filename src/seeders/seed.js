const dotenv = require('dotenv');
dotenv.config();

const {
  sequelize,
  Usuario,
  Publicacion,
  Album,
  Track,
  Resena,
  Comentario,
  LikeTrack,
  LikeResena,
  LikeComentario,
  LikePublicacion,
} = require('../models');

const datosUsuarios = [
  {
    username: 'diego_sound',
    email: 'diego@playgram.cl',
    password_hash: 'Password123!',
    bio: 'Productor musical aficionado y estudiante UC.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    rol: 'usuario',
  },
  {
    username: 'seba_beats',
    email: 'seba@playgram.cl',
    password_hash: 'Password123!',
    bio: 'Beatmaker, tecladista y coleccionista de sintetizadores analógicos.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rol: 'usuario',
  },
  {
    username: 'santiago_critic',
    email: 'santiago@playgram.cl',
    password_hash: 'Password123!',
    bio: 'Crítico de rock progresivo, indie y jazz fusión.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    rol: 'usuario',
  },
  {
    username: 'moderador_playgram',
    email: 'mod@playgram.cl',
    password_hash: 'ModPass2026!',
    bio: 'Cuenta de moderación oficial de la comunidad Playgram.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    rol: 'moderador',
  },
];

const datosAlbumes = [
  {
    titulo: 'Random Access Memories',
    fecha_lanzamiento: '2013-05-17',
    portada_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
  },
  {
    titulo: 'Melodrama',
    fecha_lanzamiento: '2017-06-16',
    portada_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
  },
  {
    titulo: 'Currents',
    fecha_lanzamiento: '2015-07-17',
    portada_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
  },
];

const datosPublicaciones = [
  {
    usernameAutor: 'diego_sound',
    texto: '¡Bienvenidos a Playgram! Acabo de compartir mi primera reseña y nuevo sample en la plataforma 🎵🔥',
  },
  {
    usernameAutor: 'diego_sound',
    texto: '¿Alguien ha probado mezclar sintetizadores analógicos con beats lo-fi? Dejen sus recomendaciones abajo 👇',
  },
  {
    usernameAutor: 'seba_beats',
    texto: 'Terminé una nueva maqueta instrumental inspirada en Daft Punk y Justice. Estará disponible en mi perfil esta semana 🎹🚀',
  },
  {
    usernameAutor: 'santiago_critic',
    texto: 'Acabo de escuchar por décima vez "Random Access Memories" en vinilo. La producción acústica y electrónica sigue siendo insuperable. ¿Cuál es su tema favorito del disco? 🎧✨',
  },
  {
    usernameAutor: 'moderador_playgram',
    texto: 'Recordatorio para toda la comunidad: respeten las opiniones críticas de otros usuarios en reseñas y comentarios. ¡A disfrutar la música juntos! 🤝🎶',
  },
];

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos para sembrado...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');

    console.log('🌱 Iniciando sembrado de datos (Seeds)...');

    // 1. Sembrar Usuarios
    const usuariosCreados = {};
    for (const dataUser of datosUsuarios) {
      let usuario = await Usuario.findOne({ where: { username: dataUser.username } });
      if (!usuario) {
        usuario = await Usuario.create(dataUser);
        console.log(`   + Usuario creado: ${usuario.username} (${usuario.rol})`);
      } else {
        console.log(`   = Usuario ya existente: ${usuario.username}`);
      }
      usuariosCreados[usuario.username] = usuario;
    }

    // 2. Sembrar Álbumes
    const albumesCreados = {};
    for (const dataAlb of datosAlbumes) {
      let album = await Album.findOne({ where: { titulo: dataAlb.titulo } });
      if (!album) {
        album = await Album.create(dataAlb);
        console.log(`   + Álbum creado: "${album.titulo}"`);
      } else {
        console.log(`   = Álbum ya existente: "${album.titulo}"`);
      }
      albumesCreados[album.titulo] = album;
    }

    // 3. Sembrar Tracks (asociados a usuarios y álbumes)
    const datosTracks = [
      {
        titulo: 'Get Lucky',
        duracion: 369,
        archivo_audio: 'https://cdn.playgram.cl/audio/get-lucky.mp3',
        estado: 'publicado',
        usernameArtista: 'diego_sound',
        tituloAlbum: 'Random Access Memories',
      },
      {
        titulo: 'Instant Crush (feat. Julian Casablancas)',
        duracion: 337,
        archivo_audio: 'https://cdn.playgram.cl/audio/instant-crush.mp3',
        estado: 'publicado',
        usernameArtista: 'diego_sound',
        tituloAlbum: 'Random Access Memories',
      },
      {
        titulo: 'Green Light',
        duracion: 234,
        archivo_audio: 'https://cdn.playgram.cl/audio/green-light.mp3',
        estado: 'publicado',
        usernameArtista: 'seba_beats',
        tituloAlbum: 'Melodrama',
      },
      {
        titulo: 'The Less I Know The Better',
        duracion: 216,
        archivo_audio: 'https://cdn.playgram.cl/audio/less-i-know.mp3',
        estado: 'publicado',
        usernameArtista: 'santiago_critic',
        tituloAlbum: 'Currents',
      },
    ];

    const tracksCreados = {};
    for (const dataTrack of datosTracks) {
      let track = await Track.findOne({ where: { titulo: dataTrack.titulo } });
      const artista = usuariosCreados[dataTrack.usernameArtista];
      const album = albumesCreados[dataTrack.tituloAlbum];

      if (!track && artista) {
        track = await Track.create({
          titulo: dataTrack.titulo,
          duracion: dataTrack.duracion,
          archivo_audio: dataTrack.archivo_audio,
          estado: dataTrack.estado,
          id_usuario: artista.id_usuario,
          id_album: album ? album.id_album : null,
        });
        console.log(`   + Track creado: "${track.titulo}" por ${artista.username}`);
      } else if (track) {
        console.log(`   = Track ya existente: "${track.titulo}"`);
      }
      tracksCreados[dataTrack.titulo] = track;
    }

    // 4. Sembrar Publicaciones asociadas
    const publicacionesCreadas = [];
    for (const dataPub of datosPublicaciones) {
      const autor = usuariosCreados[dataPub.usernameAutor];
      if (autor) {
        let pub = await Publicacion.findOne({
          where: {
            texto: dataPub.texto,
            id_usuario: autor.id_usuario,
          },
        });

        if (!pub) {
          pub = await Publicacion.create({
            texto: dataPub.texto,
            id_usuario: autor.id_usuario,
          });
          console.log(`   + Publicación creada para ${autor.username} (ID: ${pub.id_publicacion})`);
        } else {
          console.log(`   = Publicación ya existente para ${autor.username}`);
        }
        publicacionesCreadas.push(pub);
      }
    }

    // 5. Sembrar Reseñas asociadas a Publicación y Álbum
    const albRam = albumesCreados['Random Access Memories'];
    const albMelo = albumesCreados['Melodrama'];
    const resenasCreadas = [];

    if (albRam && publicacionesCreadas.length > 3) {
      const pubSanti = publicacionesCreadas[3]; // Publicación de santiago_critic
      let resenaRam = await Resena.findOne({ where: { id_publicacion: pubSanti.id_publicacion } });
      if (!resenaRam) {
        resenaRam = await Resena.create({
          id_publicacion: pubSanti.id_publicacion,
          id_album: albRam.id_album,
          calificacion: 5,
          texto_critico: 'Una obra cumbre que conjuga baterías orgánicas, vocoders celestiales y groove atemporal.',
        });
        console.log(`   + Reseña creada para RAM (ID: ${resenaRam.id_resena})`);
      }
      resenasCreadas.push(resenaRam);
    }

    if (albMelo && publicacionesCreadas.length > 0) {
      const pubDiego = publicacionesCreadas[0];
      let resenaMelo = await Resena.findOne({ where: { id_publicacion: pubDiego.id_publicacion } });
      if (!resenaMelo) {
        resenaMelo = await Resena.create({
          id_publicacion: pubDiego.id_publicacion,
          id_album: albMelo.id_album,
          calificacion: 5,
          texto_critico: 'Pop melancólico y catártico. La producción vocal de Jack Antonoff y Lorde es magistral.',
        });
        console.log(`   + Reseña creada para Melodrama (ID: ${resenaMelo.id_resena})`);
      }
      resenasCreadas.push(resenaMelo);
    }

    // 6. Sembrar Comentarios en publicaciones
    const comentariosCreados = [];
    if (publicacionesCreadas.length > 1) {
      const pubLofi = publicacionesCreadas[1]; // pregunta por lo-fi
      const sebaUser = usuariosCreados['seba_beats'];
      let comentario1 = await Comentario.findOne({
        where: { id_publicacion: pubLofi.id_publicacion, id_usuario: sebaUser.id_usuario },
      });
      if (!comentario1) {
        comentario1 = await Comentario.create({
          id_publicacion: pubLofi.id_publicacion,
          id_usuario: sebaUser.id_usuario,
          texto: '¡Te recomiendo pasar el Juno por una cinta de cassette TDK vieja, le da una textura analógica increíble!',
        });
        console.log(`   + Comentario creado por ${sebaUser.username} en publicación ${pubLofi.id_publicacion}`);
      }
      comentariosCreados.push(comentario1);
    }

    // 7. Sembrar LIKES (relaciones N:M del diagrama XML)
    console.log('\n❤️ Sembrando relaciones de Likes de usuarios...');

    const diego = usuariosCreados['diego_sound'];
    const seba = usuariosCreados['seba_beats'];
    const santiago = usuariosCreados['santiago_critic'];

    // 7.1 Likes a Tracks (r_like: Usuario <-> Track)
    const trackGetLucky = tracksCreados['Get Lucky'];
    const trackGreenLight = tracksCreados['Green Light'];
    const trackInstantCrush = tracksCreados['Instant Crush (feat. Julian Casablancas)'];

    if (trackGetLucky) {
      for (const u of [seba, santiago].filter(Boolean)) {
        await LikeTrack.findOrCreate({
          where: { id_usuario: u.id_usuario, id_track: trackGetLucky.id_track },
        });
        console.log(`   ❤️ Like a Track: ${u.username} -> "${trackGetLucky.titulo}"`);
      }
    }

    if (trackGreenLight && diego) {
      await LikeTrack.findOrCreate({
        where: { id_usuario: diego.id_usuario, id_track: trackGreenLight.id_track },
      });
      console.log(`   ❤️ Like a Track: ${diego.username} -> "${trackGreenLight.titulo}"`);
    }

    if (trackInstantCrush && santiago) {
      await LikeTrack.findOrCreate({
        where: { id_usuario: santiago.id_usuario, id_track: trackInstantCrush.id_track },
      });
      console.log(`   ❤️ Like a Track: ${santiago.username} -> "${trackInstantCrush.titulo}"`);
    }

    // 7.2 Likes a Reseñas (mKcNrvIlspAVrXcI15Lf-1: Usuario <-> Reseña)
    if (resenasCreadas.length > 0) {
      const resena1 = resenasCreadas[0];
      for (const u of [diego, seba].filter(Boolean)) {
        await LikeResena.findOrCreate({
          where: { id_usuario: u.id_usuario, id_resena: resena1.id_resena },
        });
        console.log(`   ❤️ Like a Reseña: ${u.username} -> Reseña ID ${resena1.id_resena}`);
      }
    }

    // 7.3 Likes a Comentarios (i4YsU-L0NwfI3-M9YQAn-1: Usuario <-> Comentario)
    if (comentariosCreados.length > 0 && diego) {
      const com1 = comentariosCreados[0];
      await LikeComentario.findOrCreate({
        where: { id_usuario: diego.id_usuario, id_comentario: com1.id_comentario },
      });
      console.log(`   ❤️ Like a Comentario: ${diego.username} -> Comentario ID ${com1.id_comentario}`);
    }

    // 7.4 Likes a Publicaciones (para el feed)
    if (publicacionesCreadas.length > 0) {
      const pub1 = publicacionesCreadas[0];
      for (const u of [seba, santiago].filter(Boolean)) {
        await LikePublicacion.findOrCreate({
          where: { id_usuario: u.id_usuario, id_publicacion: pub1.id_publicacion },
        });
        console.log(`   ❤️ Like a Publicación: ${u.username} -> Publicación ID ${pub1.id_publicacion}`);
      }
    }

    console.log('\n🎉 Sembrado completo de entidades y relaciones de likes exitoso.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el sembrado de datos (seed):', error);
    process.exit(1);
  }
}

seedDatabase();

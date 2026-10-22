# Modelo Relacional - Playgram

Este documento formaliza la transformación del Diagrama Entidad-Relación (E/R) de la Entrega 0 al **Modelo Relacional** de la plataforma **Playgram**, detallando tablas, columnas, tipos de datos, restricciones de integridad (PK, FK, UNIQUE, NOT NULL) y justificaciones de diseño.

---

## 1. Justificaciones de Diseño y Mapeo E/R a Relacional

1. **Jerarquías de Herencia (`MODERADOR isA USUARIO` y `ADMIN isA USUARIO`):**
   * En el diagrama E/R conceptual, `MODERADOR` y `ADMIN` son subtipos de `USUARIO`.
   * Dado que no presentan atributos adicionales propios en el diagrama conceptual, se aplica la técnica de **Single Table Inheritance (Tabla Única)**.
   * Se agrega a la tabla `usuarios` el atributo discriminador `rol` (`ENUM('usuario', 'moderador', 'admin')`). Esto evita `JOINs` innecesarios y optimiza el rendimiento y la autenticación basada en roles.

2. **Especialización `RESEÑA` respecto a `PUBLICACIÓN`:**
   * Una reseña es una publicación especializada con atributos adicionales (`calificacion`, `texto_critico`) y asociada a un `álbum`.
   * Se mapea como tabla `resenas`, cuya clave primaria `id_publicacion` actúa simultáneamente como Clave Foránea (FK) hacia `publicaciones.id_publicacion` (relación 1 a 0..1).

3. **Relaciones N:M (Muchos a Muchos) de Likes (según Diagrama E/R en XML):**
   * **Usuario $\leftrightarrow$ Track (Likes):** Mapeada mediante la tabla intermedia `likes_tracks`, incorporando la marca temporal `fecha_like`. Corresponde a la relación `da like` entre `USUARIO` y `TRACK` en la página 2 del diagrama.
   * **Usuario $\leftrightarrow$ Reseña (Likes):** Mapeada mediante la tabla intermedia `likes_resenas`, incorporando la marca temporal `fecha_like`. Corresponde a la relación `da like` entre `USUARIO` y `RESENA` en la página 2 del diagrama.
   * **Usuario $\leftrightarrow$ Comentario (Likes):** Mapeada mediante la tabla intermedia `likes_comentarios`, incorporando la marca temporal `fecha_like`. Corresponde a la relación `da like` entre `USUARIO` y `COMENTARIO` en la página 2 del diagrama.
   * **Usuario $\leftrightarrow$ Publicación (Likes):** Mapeada mediante la tabla intermedia `likes_publicaciones`, permitiendo persistir interacciones en las publicaciones del feed social.

4. **Otras Relaciones N:M:**
   * **Track $\leftrightarrow$ Género:** Mapeada mediante la tabla intermedia `track_generos`.
   * **Playlist $\leftrightarrow$ Track:** Mapeada mediante la tabla intermedia `playlist_tracks`, incorporando el atributo de orden.

---

## 2. Definición Tabular del Esquema Relacional

### 2.1. Modelos Base Implementados para la Entrega

#### Tabla: `usuarios`
Representa a cualquier usuario registrado en la plataforma (oyente, creador/artista, moderador o administrador).

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | **PK**, AUTO_INCREMENT | Identificador único del usuario |
| `username` | `VARCHAR(50)` | UNIQUE, NOT NULL | Nombre de usuario único para menciones y login |
| `email` | `VARCHAR(100)` | UNIQUE, NOT NULL | Correo electrónico de contacto/acceso |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Contraseña cifrada con algoritmo seguro (bcrypt) |
| `bio` | `TEXT` | NULL | Biografía o descripción del perfil |
| `avatar_url` | `VARCHAR(255)` | NULL | Enlace a la imagen de perfil |
| `rol` | `ENUM` | NOT NULL, DEFAULT `'usuario'` | Rol del usuario (`'usuario'`, `'moderador'`, `'admin'`) |
| `fecha_registro` | `TIMESTAMP` | NOT NULL, DEFAULT NOW | Fecha y hora de creación de la cuenta |

#### Tabla: `publicaciones` *(Entidad Principal de la Propuesta)*
Representa los posts o publicaciones creadas por los usuarios que componen el feed de la página principal.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_publicacion` | `INTEGER` | **PK**, AUTO_INCREMENT | Identificador único de la publicación |
| `texto` | `TEXT` | NOT NULL | Contenido textual de la publicación |
| `id_usuario` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL | Autor que creó la publicación |
| `fecha_creacion` | `TIMESTAMP` | NOT NULL, DEFAULT NOW | Fecha y hora de publicación |

* **Relación:** `usuarios (1)` $\rightarrow$ `publicaciones (N)` (ON DELETE CASCADE).

---

### 2.2. Resto del Esquema Relacional (Plan Completo del Proyecto)

#### Tabla: `albumes`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_album` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `titulo` | `VARCHAR(150)` | NOT NULL |
| `fecha_lanzamiento` | `DATE` | NULL |
| `portada_url` | `VARCHAR(255)` | NULL |

#### Tabla: `resenas`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_resena` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `id_publicacion` | `INTEGER` | **FK** $\rightarrow$ `publicaciones(id_publicacion)`, UNIQUE, NOT NULL |
| `id_album` | `INTEGER` | **FK** $\rightarrow$ `albumes(id_album)`, NOT NULL |
| `calificacion` | `INTEGER` | CHECK (calificacion BETWEEN 1 AND 5), NOT NULL |
| `texto_critico` | `TEXT` | NULL |

#### Tabla: `comentarios`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_comentario` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `texto` | `TEXT` | NOT NULL |
| `id_usuario` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL |
| `id_publicacion` | `INTEGER` | **FK** $\rightarrow$ `publicaciones(id_publicacion)`, NOT NULL |
| `fecha_creacion` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `tracks`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_track` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `titulo` | `VARCHAR(150)` | NOT NULL |
| `duracion` | `INTEGER` | NOT NULL (en segundos) |
| `archivo_audio` | `VARCHAR(255)` | NOT NULL |
| `estado` | `VARCHAR(50)` | DEFAULT `'publicado'` (`'borrador'`, `'publicado'`) |
| `id_usuario` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL |
| `id_album` | `INTEGER` | **FK** $\rightarrow$ `albumes(id_album)`, NULL |

#### Tabla: `generos`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_genero` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `nombre` | `VARCHAR(80)` | UNIQUE, NOT NULL |

#### Tabla: `track_generos` (N:M)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_track` | `INTEGER` | **PK, FK** $\rightarrow$ `tracks(id_track)` |
| `id_genero` | `INTEGER` | **PK, FK** $\rightarrow$ `generos(id_genero)` |

#### Tabla: `playlists`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_playlist` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `nombre` | `VARCHAR(100)` | NOT NULL |
| `descripcion` | `TEXT` | NULL |
| `id_usuario` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL |
| `fecha_creacion` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `playlist_tracks` (N:M)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_playlist` | `INTEGER` | **PK, FK** $\rightarrow$ `playlists(id_playlist)` |
| `id_track` | `INTEGER` | **PK, FK** $\rightarrow$ `tracks(id_track)` |
| `orden` | `INTEGER` | NOT NULL |

#### Tabla: `likes_tracks` (N:M - Usuario da like a Track)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | **PK, FK** $\rightarrow$ `usuarios(id_usuario)` ON DELETE CASCADE |
| `id_track` | `INTEGER` | **PK, FK** $\rightarrow$ `tracks(id_track)` ON DELETE CASCADE |
| `fecha_like` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `likes_resenas` (N:M - Usuario da like a Reseña)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | **PK, FK** $\rightarrow$ `usuarios(id_usuario)` ON DELETE CASCADE |
| `id_resena` | `INTEGER` | **PK, FK** $\rightarrow$ `resenas(id_resena)` ON DELETE CASCADE |
| `fecha_like` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `likes_comentarios` (N:M - Usuario da like a Comentario)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | **PK, FK** $\rightarrow$ `usuarios(id_usuario)` ON DELETE CASCADE |
| `id_comentario` | `INTEGER` | **PK, FK** $\rightarrow$ `comentarios(id_comentario)` ON DELETE CASCADE |
| `fecha_like` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `likes_publicaciones` (N:M - Usuario da like a Publicación)
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | **PK, FK** $\rightarrow$ `usuarios(id_usuario)` ON DELETE CASCADE |
| `id_publicacion` | `INTEGER` | **PK, FK** $\rightarrow$ `publicaciones(id_publicacion)` ON DELETE CASCADE |
| `fecha_like` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `salas_chat`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_sala` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `nombre` | `VARCHAR(100)` | NOT NULL |
| `id_genero` | `INTEGER` | **FK** $\rightarrow$ `generos(id_genero)`, NOT NULL |

#### Tabla: `mensajes`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_mensaje` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `contenido` | `TEXT` | NOT NULL |
| `id_usuario` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL |
| `id_sala` | `INTEGER` | **FK** $\rightarrow$ `salas_chat(id_sala)`, NOT NULL |
| `fecha_envio` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |

#### Tabla: `reportes`
| Columna | Tipo de Dato | Restricciones |
| :--- | :--- | :--- |
| `id_reporte` | `INTEGER` | **PK**, AUTO_INCREMENT |
| `motivo` | `TEXT` | NOT NULL |
| `estado` | `VARCHAR(50)` | DEFAULT `'pendiente'` (`'pendiente'`, `'revisado'`, `'descartado'`) |
| `fecha_reporte` | `TIMESTAMP` | NOT NULL, DEFAULT NOW |
| `id_usuario_reportante` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NOT NULL |
| `id_publicacion` | `INTEGER` | **FK** $\rightarrow$ `publicaciones(id_publicacion)`, NULL |
| `id_comentario` | `INTEGER` | **FK** $\rightarrow$ `comentarios(id_comentario)`, NULL |
| `id_moderador` | `INTEGER` | **FK** $\rightarrow$ `usuarios(id_usuario)`, NULL |

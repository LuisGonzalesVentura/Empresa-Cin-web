import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const usuario_id = (req.query.usuario_id || "").trim();

  if (!usuario_id) {
    return res.status(400).json({ error: "usuario_id es obligatorio" });
  }

  try {
    // Datos de la tabla `usuarios`
    const usuarios = await sql`
      SELECT *
      FROM usuarios
      WHERE id = ${usuario_id}
      LIMIT 1;
    `;

    if (usuarios.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];

    // Datos de la tabla `auth.users` (correo)
    const auth = await sql`
      SELECT email
      FROM auth.users
      WHERE id = ${usuario_id}
      LIMIT 1;
    `;

    const email = auth[0]?.email ?? null;

    res.status(200).json({
      usuario: {
        ...usuario,
        email, // añadimos el correo al objeto del usuario
      },
    });
  } catch (error) {
    console.error("Error en /api/usuario_ver:", error);
    res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

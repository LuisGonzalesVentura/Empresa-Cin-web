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
    const pedidos = await sql`
      SELECT * FROM pedidos
      WHERE usuario_id = ${usuario_id}
      ORDER BY fecha_creacion DESC;
    `;

    if (pedidos.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron pedidos para este usuario" });
    }

    res.status(200).json({ pedidos });
  } catch (error) {
    console.error("Error en /api/pedidos_usuario:", error);
    res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

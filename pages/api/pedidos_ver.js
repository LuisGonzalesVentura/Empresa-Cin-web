import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const qr_id = (req.query.qr_id || "").trim();

  if (!qr_id) {
    return res.status(400).json({ error: "qr_id es obligatorio" });
  }

  try {
    const pedidos = await sql`
      SELECT * FROM pedidos
      WHERE qr_id = ${qr_id}
      ORDER BY fecha_creacion DESC;
    `;

    if (pedidos.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.status(200).json({ pedido: pedidos[0] });
  } catch (error) {
    console.error("Error en /api/pedidos_ver:", error);
    res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

import postgres from "postgres";
import {
  generarTokenBNB,
  generarQRConImagenBNB,
} from "../../lib/servicios_bnb/api_bnb";

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  console.log("Headers:", req.headers);
  console.log("Body recibido:", req.body);
  const {
    usuario_id,
    descripcion,
    monto_total,
    ubicacion_texto,
    ubicacion_maps,
    datosQR,
  } = req.body;

  if (!usuario_id || !descripcion || !monto_total || !datosQR) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    // 1. Generar token BNB
    const token = await generarTokenBNB();

    // 2. Preparar datos QR con monto total
    const qrData = {
      ...datosQR,
      amount: monto_total,
    };

    // 3. Generar QR con la API de BNB
    const qrRespuesta = await generarQRConImagenBNB(token, qrData);

    if (!qrRespuesta.success) {
      return res
        .status(500)
        .json({ error: "Error generando QR: " + qrRespuesta.message });
    }

    // 4. Guardar pedido en DB con qr_id
    const pedidoCreado = await sql`
      INSERT INTO pedidos (usuario_id, descripcion, monto_total, estado, qr_id, ubicacion_texto, ubicacion_maps)
      VALUES (${usuario_id}, ${descripcion}, ${monto_total}, 'pendiente', ${qrRespuesta.id}, ${ubicacion_texto || null}, ${ubicacion_maps || null})
      RETURNING *;
    `;

    res.status(201).json({ pedido: pedidoCreado[0], qr: qrRespuesta.qr });
  } catch (error) {
    console.error("Error en /api/pedidos:", error);
    res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

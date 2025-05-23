// pages/api/test-estado-qr.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  generarTokenBNB,
  obtenerEstadoQRporId,
} from "@/lib/servicios_bnb/api_bnb"; // ajusta la ruta aquí

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Solo se permite GET" });
  }

  const qrId = Number(req.query.qrId);

  if (isNaN(qrId)) {
    return res.status(400).json({ message: "qrId inválido" });
  }

  try {
    const token = await generarTokenBNB();
    const estado = await obtenerEstadoQRporId(token, qrId);
    return res.status(200).json({ estado });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

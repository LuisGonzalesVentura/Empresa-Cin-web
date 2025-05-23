// /pages/api/qrs-generados.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generarTokenBNB, getQRporFechaBNB } from "@/lib/servicios_bnb/api_bnb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido" });
  }

  const { fecha } = req.body;

  if (!fecha) {
    return res
      .status(400)
      .json({ success: false, message: "Fecha no proporcionada" });
  }

  try {
    const token = await generarTokenBNB();
    const resultado = await getQRporFechaBNB(token, fecha);
    return res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error en API /qrs-generados:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener los QRs generados" });
  }
}

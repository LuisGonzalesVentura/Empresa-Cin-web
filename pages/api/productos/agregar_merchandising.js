import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL);

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el body parser por defecto
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/public/uploads"); // Configurar directorio de carga
    form.keepExtensions = true; // Mantener la extensión del archivo

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error al procesar el formulario:", err);
        res.status(500).json({ error: "Error al procesar el formulario." });
        return;
      }

      const { nombre_producto, precio, descuento, id_ciudad } = fields;

      // Validación de campos obligatorios
      if (!nombre_producto || !precio || !id_ciudad) {
        return res.status(400).json({
          error: "Por favor, completa todos los campos obligatorios.",
        });
      }

      const foto = files.foto ? files.foto[0].newFilename : null; // Foto es opcional
      const descuentoValue = descuento ? descuento : 0; // Si no hay descuento, lo dejamos en 0

      try {
        const result = await sql`
          INSERT INTO tb_productos_merchandising (
            nombre_producto_merchandising,
            precio_merchandising,
            descuento_merchandising,
            foto_merchandising,
            id_ciudad_merchandising
          ) VALUES (
            ${nombre_producto},
            ${precio},
            ${descuentoValue},
            ${foto},
            ${id_ciudad}
          ) RETURNING id_producto_merchandising, nombre_producto_merchandising, precio_merchandising, descuento_merchandising, foto_merchandising, id_ciudad_merchandising
        `;

        res.status(200).json(result[0]); // Enviar el nuevo producto de merchandising como respuesta
      } catch (error) {
        console.error("Error al insertar el producto de merchandising:", error);
        res
          .status(500)
          .json({ error: "Error al insertar en la base de datos" });
      }
    });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

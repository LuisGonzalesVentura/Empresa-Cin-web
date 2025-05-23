//**pages/api/productos/agregar_hervidos

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/public/uploads");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error al procesar el formulario." });
        return;
      }

      const {
        nombre_producto_hervidos,
        precio_hervidos,
        descuento_hervidos,
        id_ciudad_hervidos,
      } = fields;

      // Validación de campos obligatorios
      if (
        !nombre_producto_hervidos ||
        !precio_hervidos ||
        !id_ciudad_hervidos
      ) {
        return res.status(400).json({ error: "Faltan campos requeridos." });
      }

      const foto_hervidos = files.foto_hervidos[0].newFilename; // Foto del producto

      // Insertar los datos en la base de datos
      try {
        const result = await sql`
          INSERT INTO tb_productos_hervidos (nombre_producto_hervidos, precio_hervidos, descuento_hervidos, id_ciudad_hervidos, foto_hervidos)
          VALUES (${nombre_producto_hervidos}, ${precio_hervidos}, ${descuento_hervidos || 0}, ${id_ciudad_hervidos}, ${foto_hervidos})
          RETURNING id_producto_hervidos, nombre_producto_hervidos, precio_hervidos, descuento_hervidos, foto_hervidos, id_ciudad_hervidos;
        `;

        return res.status(200).json(result[0]);
      } catch (error) {
        console.error("Error al insertar el producto:", error);
        return res.status(500).json({
          error: "Error al insertar el producto en la base de datos.",
        });
      }
    });
  }
}

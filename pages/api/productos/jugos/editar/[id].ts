import { sql } from "@vercel/postgres"; // Importa correctamente el cliente SQL
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// Evitar el parseo automático del body
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ProductoFields {
  nombre_producto: string;
  precio: string;
  descuento: string;
  ciudad: string;
}

interface ProductoFiles {
  imagen:
    | {
        filepath: string;
        originalFilename: string;
        mimetype: string;
        size: number;
      }
    | undefined;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "/public/uploads"),
      keepExtensions: true,
    });

    form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ mensaje: "Error al procesar el formulario" });
      }

      // Verificación de la existencia de campos antes de realizar el type assertion
      if (
        !fields.nombre_producto ||
        !fields.precio ||
        !fields.descuento ||
        !fields.ciudad
      ) {
        return res.status(400).json({ mensaje: "Faltan campos requeridos" });
      }

      const { nombre_producto, precio, descuento, ciudad } =
        fields as unknown as ProductoFields;

      let nombreImagen = "";

      // Comprobación para asegurar que `imagen` no es undefined
      if (files.imagen && !Array.isArray(files.imagen)) {
        const imagen = files.imagen as ProductoFiles["imagen"];

        // Asegúrate de que la propiedad `filepath` está disponible antes de usarla
        if (imagen?.filepath) {
          nombreImagen = path.basename(imagen.filepath);
        } else {
          return res
            .status(400)
            .json({ mensaje: "La imagen no tiene una ruta válida." });
        }
      }

      const productoData = {
        nombre: nombre_producto,
        precio,
        descuento: descuento || "0.00",
        ciudad,
        nombreImagen,
      };

      // Obtener el id del producto desde los parámetros de la URL
      const idProducto = req.query.id;

      if (!idProducto || Array.isArray(idProducto)) {
        return res.status(400).json({ mensaje: "ID del producto no válido" });
      }

      try {
        // Realiza la actualización del producto en la base de datos
        const result = await sql`
          UPDATE tb_productos_jugos
          SET nombre_producto = ${productoData.nombre},
              precio = ${productoData.precio},
              descuento = ${productoData.descuento},
              id_ciudad = ${productoData.ciudad},
              foto = ${productoData.nombreImagen}
          WHERE id_producto = ${idProducto}
        `;

        if (result.rowCount === 0) {
          return res
            .status(404)
            .json({ mensaje: "Producto no encontrado para actualizar." });
        }

        return res
          .status(200)
          .json({ mensaje: "Producto actualizado correctamente" });
      } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
          message: "Error connecting to the database",
          error: error instanceof Error ? error.message : error,
        });

        return res
          .status(500)
          .json({ mensaje: "Error desconocido al actualizar el producto" });
      }
    });
  } else {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }
}

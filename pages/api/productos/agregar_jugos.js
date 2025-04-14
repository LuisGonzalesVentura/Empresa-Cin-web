import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/public/uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error al procesar el formulario.' });
        return;
      }

      const { nombre_producto, precio, descuento, ciudad } = fields;

      // Validación de campos obligatorios
      if (!nombre_producto || !precio || !ciudad) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios.' });
      }

      const foto = files.foto ? files.foto[0].newFilename : null;  // Foto es opcional
      const descuentoValue = descuento ? descuento : null;  // Descuento es opcional

      try {
        const result = await sql`
          INSERT INTO tb_productos_jugos (nombre_producto, precio, descuento, foto, id_ciudad)
          VALUES (${nombre_producto}, ${precio}, ${descuentoValue}, ${foto}, ${ciudad})
          RETURNING id_producto, nombre_producto, precio, descuento, foto, id_ciudad
        `;

        res.status(200).json(result[0]);  // Enviar el nuevo producto como respuesta
      } catch (error) {
        console.error('Error al insertar el producto:', error);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
      }
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
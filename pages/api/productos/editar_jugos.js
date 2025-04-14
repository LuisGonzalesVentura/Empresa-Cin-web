import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { IncomingForm } from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req, { params }) {
    const id_producto = params.id;

  const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    multiples: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al parsear el formulario:', err);
        return resolve(NextResponse.json({ error: 'Error en el formulario' }, { status: 500 }));
      }

      const nombre = fields.nombre?.[0];
      const precio = parseFloat(fields.precio?.[0]);
      const descuento = fields.descuento?.[0] ? parseFloat(fields.descuento[0]) : null;
      const ciudad = parseInt(fields.ciudad?.[0]);
      const nombreImagen = files.foto?.[0]?.newFilename || fields.nombreImagen?.[0] || null;

      try {
        await sql`
          UPDATE tb_productos_jugos
          SET nombre_producto = ${nombre},
              precio = ${precio},
              descuento = ${descuento},
              id_ciudad = ${ciudad},
              foto = ${nombreImagen}
          WHERE id_producto = ${id_producto}
        `;

        return resolve(NextResponse.json({ message: 'Producto actualizado correctamente' }));
      } catch (error) {
        console.error('Error al actualizar en la base de datos:', error);
        return resolve(NextResponse.json({ error: 'Error en el servidor' }, { status: 500 }));
      }
    });
  });
}

import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';  // Importamos bcrypt para encriptar la contraseña

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

      const { nombre, apellido, nombre_factura, ci_nit, correo, fecha_nacimiento, contrasena, telefono } = fields;

      // Validación de campos obligatorios
      if (!nombre || !apellido || !ci_nit || !correo || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
      }

      try {
        // Verificar si ya existe un usuario con el mismo correo
        const existingUserByEmail = await sql`
          SELECT id FROM "public"."usuarios" WHERE correo = ${correo};
        `;
        if (existingUserByEmail.length > 0) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

    

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Asignar tipo de usuario automáticamente (por ejemplo, 'registrado')
        const tipo_usuario = 'registrado'; 

        // Insertar los datos en la base de datos
        const result = await sql`
          INSERT INTO "public"."usuarios" 
          ("nombre", "apellido", "nombre_factura", "ci_nit", "correo", "fecha_nacimiento", "contrasena", "tipo_usuario", "telefono", "fecha_creacion") 
          VALUES 
          (${nombre}, ${apellido}, ${nombre_factura || null}, ${ci_nit}, ${correo}, ${fecha_nacimiento || null}, ${hashedPassword}, ${tipo_usuario}, ${telefono || null}, NOW()) 
          RETURNING *;  -- Retorna todos los campos de la fila insertada
        `;

        return res.status(200).json(result[0]);
      } catch (error) {
        console.error('Error al insertar el usuario:', error);
        return res.status(500).json({ error: 'Error al insertar el usuario en la base de datos.' });
      }
    });
  } else {
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}

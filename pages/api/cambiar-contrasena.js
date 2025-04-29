import { IncomingForm } from 'formidable';
import path from 'path';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

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
        return res.status(500).json({ error: 'Error al procesar el formulario.' });
      }

      const { correo, contrasena_actual, nueva_contrasena, confirmar_nueva_contrasena } = fields;

      // Validar campos requeridos
      if (!correo || !contrasena_actual || !nueva_contrasena || !confirmar_nueva_contrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
      }

      // Validar que las contraseñas coincidan
      if (nueva_contrasena !== confirmar_nueva_contrasena) {
        return res.status(400).json({ error: 'Las contraseñas nuevas no coinciden.' });
      }

      try {
        // Buscar el usuario por correo
        const usuarios = await sql`
          SELECT id, contrasena FROM "public"."usuarios" WHERE correo = ${correo};
        `;

        if (usuarios.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const usuario = usuarios[0];

        // Verificar contraseña actual
        const match = await bcrypt.compare(contrasena_actual, usuario.contrasena);
        if (!match) {
          return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
        }

        // Encriptar nueva contraseña
        const hashedNueva = await bcrypt.hash(nueva_contrasena, 10);

        // Actualizar contraseña en la base de datos
        await sql`
          UPDATE "public"."usuarios"
          SET contrasena = ${hashedNueva}
          WHERE id = ${usuario.id};
        `;

        return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });

      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ error: 'Error al cambiar la contraseña.' });
      }
    });
  } else {
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}

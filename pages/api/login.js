//pages/api/LogIn.js




import postgres from 'postgres';
import bcrypt from 'bcryptjs';  // Importamos bcrypt para verificar la contraseña

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, contrasena } = req.body;

    // Validar campos
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }

    try {
      // Verificar si el usuario existe en la base de datos por correo
      const userResult = await sql`
        SELECT * 
        FROM "public"."usuarios" 
        WHERE correo = ${correo};
      `;

      if (userResult.length === 0) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      const user = userResult[0];

      // Verificar si la contraseña proporcionada coincide con la almacenada (encriptada)
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);

      if (!isMatch) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      // Si las credenciales son correctas, devolver todos los datos del usuario
      return res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          nombre_factura: user.nombre_factura,
          ci_nit: user.ci_nit,
          correo: user.correo,
          fecha_nacimiento: user.fecha_nacimiento,
          telefono: user.telefono,
          tipo_usuario: user.tipo_usuario,
          fecha_creacion: user.fecha_creacion
        },
      });
    } catch (error) {
      console.error('Error al consultar el usuario:', error);
      return res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}

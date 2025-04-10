import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  try {
    // Intentamos hacer una consulta simple para verificar la conexión
    await sql`SELECT NOW()`;
    console.log('Conexión a la base de datos exitosa');

    // Consultar todas las ciudades de la tabla tb_ciudades
    const ciudades = await sql`SELECT id_ciudad, nombre_ciudad FROM tb_ciudades`;

    // Enviar respuesta con las ciudades
    res.status(200).json(ciudades);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);

    // Enviar error detallado para ayudar a la depuración
    res.status(500).json({ 
      error: 'Error al conectar a la base de datos',
      details: error.message 
    });
  }
}

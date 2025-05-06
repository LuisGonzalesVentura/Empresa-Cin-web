import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  try {
    // Verificar conexión
    await sql`SELECT NOW()`;
    console.log('Conexión a la base de datos exitosa');

    // Consultar todos los productos de tb_productos_merchandising con unión a tb_ciudades
    const productos = await sql`
      SELECT 
        p.id_producto_merchandising AS id_producto, 
        p.nombre_producto_merchandising AS nombre_producto, 
        p.precio_merchandising AS precio, 
        p.descuento_merchandising AS descuento, 
        p.foto_merchandising AS foto, 
        p.id_ciudad_merchandising AS id_ciudad, 
        c.nombre_ciudad
      FROM tb_productos_merchandising p
      JOIN tb_ciudades c ON p.id_ciudad_merchandising = c.id_ciudad
      WHERE p.estado_merchandising = true
    `;

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos de merchandising:', error);

    res.status(500).json({
      error: 'Error al conectar o consultar la base de datos',
      details: error.message
    });
  }
}

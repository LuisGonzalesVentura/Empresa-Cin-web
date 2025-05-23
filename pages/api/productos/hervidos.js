// api/productos/hervidos.js

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  try {
    // Intentamos hacer una consulta simple para verificar la conexión
    await sql`SELECT NOW()`;
    console.log("Conexión a la base de datos exitosa");

    // Consultar todos los productos de la tabla tb_productos_hervidos
    // y hacer una unión con la tabla tb_ciudades
    const productos = await sql`
      SELECT 
        p.id_producto_hervidos AS id_producto, 
        p.nombre_producto_hervidos AS nombre_producto, 
        p.precio_hervidos AS precio, 
        p.descuento_hervidos AS descuento, 
        p.foto_hervidos AS foto, 
        p.id_ciudad_hervidos AS id_ciudad, 
        c.nombre_ciudad
      FROM tb_productos_hervidos p
      JOIN tb_ciudades c ON p.id_ciudad_hervidos = c.id_ciudad
    `;

    // Enviar respuesta con los productos y la ciudad relacionada
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);

    // Enviar error detallado para ayudar a la depuración
    res.status(500).json({
      error: "Error al conectar a la base de datos",
      details: error.message,
    });
  }
}

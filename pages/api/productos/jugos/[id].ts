import { NextApiRequest, NextApiResponse } from 'next';
import postgres from 'postgres';

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  throw new Error('La URL de PostgreSQL no está definida en las variables de entorno');
}

const sql = postgres(POSTGRES_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (req.method === 'GET') {
    try {
     const producto = await sql`
  SELECT 
    p.id_producto, 
    p.nombre_producto, 
    p.precio, 
    p.descuento, 
    p.foto, 
    p.id_ciudad, 
    c.nombre_ciudad
  FROM tb_productos_jugos p
  JOIN tb_ciudades c ON p.id_ciudad = c.id_ciudad
  WHERE p.id_producto = ${id}
`;


      if (producto.length === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      res.status(200).json(producto[0]);
    } catch (error) {
      // Cast explícito del error a tipo Error
      const err = error as Error;
      console.error('Error al obtener el producto:', err.message);
      res.status(500).json({
        error: 'Error al conectar a la base de datos',
        details: err.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}

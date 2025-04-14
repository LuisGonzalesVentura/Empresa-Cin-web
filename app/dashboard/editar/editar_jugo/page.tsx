'use client'; // Esto indica que el componente debe ser renderizado en el cliente


import { useEffect, useState } from 'react';
import Link from 'next/link';

// Definir el tipo Producto en este archivo
type Producto = {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number | null;
  foto: string | null;
  id_ciudad: number;
  nombre_ciudad: string;
};

export default function Jugo() {
  const [productos, setProductos] = useState<Producto[]>([]);  // Asegúrate de usar Producto[]

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch('/api/productos/jugos');
      const data: Producto[] = await response.json();
      setProductos(data);
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Listado de Jugos</h1>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Nombre</th>
              <th className="px-4 py-2 text-left border-b">Precio</th>
              <th className="px-4 py-2 text-left border-b">Descuento</th>
              <th className="px-4 py-2 text-left border-b">Ciudad</th>
              <th className="px-4 py-2 text-left border-b">Foto</th>
              <th className="px-4 py-2 text-left border-b">Acciones</th>
              <th className="px-4 py-2 text-left border-b">Acciones</th>

            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{producto.nombre_producto}</td>
                <td className="px-4 py-2 border-b">${producto.precio}</td>
                <td className="px-4 py-2 border-b">{producto.descuento ? `${producto.descuento}%` : 'N/A'}</td>
                <td className="px-4 py-2 border-b">{producto.nombre_ciudad}</td>
                <td className="px-4 py-2 border-b">
                  {producto.foto ? (
                    <img src={`/uploads/${producto.foto}`} alt={producto.nombre_producto} className="w-16 h-16 object-cover" />
                  ) : (
                    'No disponible'
                  )}
                </td>
                <td className="px-4 py-2 border-b text-center">
  <Link
    href={`/dashboard/editar/editar_jugo/from_jugo/jugo/${producto.id_producto}`}
    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
  >
    Editar
  </Link>
</td>


                <td className="px-4 py-2 border-b text-center">
                  <Link href={`/dashboard/editar/jugo/${producto.id_producto}`} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Eliminar 
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";  // Asegúrate de que esta línea esté presente

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number;
  foto: string;
  nombre_ciudad: string;
}

interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
}

export default function ListadoProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);  // Estado para los productos
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);  // Estado para las ciudades
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga
  const [error, setError] = useState<string | null>(null);  // Estado de error

  // Estados para el formulario
  const [nombreProducto, setNombreProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [descuento, setDescuento] = useState('');
  const [ciudad, setCiudad] = useState<number | ''>('');  // Ahora ciudad es un número
  const [foto, setFoto] = useState<File | null>(null);

  // Estados para la búsqueda y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'nombre_producto' | 'precio' | 'descuento' | 'nombre_ciudad'>('nombre_producto');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function fetchProductos() {
      try {
        const response = await fetch('/api/productos/jugos');
        if (response.ok) {
          const data = await response.json();
          setProductos(data);  // Guardamos los productos en el estado
        } else {
          setError('No se pudieron cargar los productos.');
        }
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Ocurrió un error al obtener los productos.');
      } finally {
        setLoading(false);
      }
    }

    async function fetchCiudades() {
      try {
        const response = await fetch('/api/ciudades');  // Endpoint para obtener las ciudades
        if (response.ok) {
          const data = await response.json();
          setCiudades(data);  // Guardamos las ciudades en el estado
        } else {
          setError('No se pudieron cargar las ciudades.');
        }
      } catch (err) {
        console.error('Error al obtener ciudades:', err);
        setError('Ocurrió un error al obtener las ciudades.');
      }
    }

    fetchProductos();
    fetchCiudades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProducto || !precio || !ciudad || !foto) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_producto', nombreProducto);
    formData.append('precio', precio);
    formData.append('descuento', descuento || '0');
    formData.append('ciudad', ciudad.toString());
    formData.append('foto', foto);

    try {
      const response = await fetch('/api/productos/agregar_jugos', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProductos([...productos, data]);
        setError(null);
        setNombreProducto('');
        setPrecio('');
        setDescuento('');
        setCiudad('');
        setFoto(null);
        alert('Producto agregado exitosamente');
      } else {
        setError('Hubo un problema al insertar el producto.');
      }
    } catch (err) {
      console.error('Error al insertar el producto:', err);
      setError('Ocurrió un error al insertar el producto.');
    }
  };

  const handleSort = (key: 'nombre_producto' | 'precio' | 'descuento' | 'nombre_ciudad') => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
  };

  const filteredProducts = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
  
    // Asegurarnos de que tanto aValue como bValue son valores válidos antes de compararlos
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // Si ambos valores son cadenas, usamos localeCompare para la comparación lexicográfica
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      // Si ambos valores son números, hacemos la comparación aritmética
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      // Si los valores no son del mismo tipo, por ejemplo, si uno es string y el otro number, se pueden comparar directamente
      // En este caso, para evitar errores, podemos devolver 0 (sin cambiar el orden) o manejarlo según sea necesario
      return 0;
    }
  });
  
  // Si la variable de carga es verdadera, mostrar un mensaje de carga
  if (loading) return <p>Cargando productos...</p>;
  
  // Si hay un error, mostrar el mensaje de error
  if (error) return <p>{error}</p>;
  
  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full flex justify-end -mt-2 mr-24">
        <Link href="/dashboard" passHref>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </button>
        </Link>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Agregar Nuevo Jugo</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="nombreProducto" className="font-semibold">Nombre del Producto</label>
            <input
              type="text"
              id="nombreProducto"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="precio" className="font-semibold">Precio</label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="descuento" className="font-semibold">Descuento (%)</label>
            <input
              type="number"
              id="descuento"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="ciudad" className="font-semibold">Ciudad</label>
            <select
              id="ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Selecciona una ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre_ciudad}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="foto" className="font-semibold">Foto del Producto</label>
            <input
              type="file"
              id="foto"
              onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg mt-4">
            Agregar Producto
          </button>
        </form>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Listado de Jugos</h1>

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('nombre_producto')}
              >
                Nombre del Producto
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('precio')}
              >
                Precio
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('descuento')}
              >
                Descuento
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('nombre_ciudad')}
              >
                Ciudad
              </th>
              <th className="px-4 py-2 border">Foto</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((producto) => (
              <tr key={producto.id_producto} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{producto.nombre_producto}</td>
                <td className="px-4 py-2 border">Bs. {producto.precio}</td>
                <td className="px-4 py-2 border">{producto.descuento}%</td>
                <td className="px-4 py-2 border">{producto.nombre_ciudad}</td>
                <td className="px-4 py-2 border">
                  <img 
                    src={`/uploads/${producto.foto}`} 
                    alt={producto.nombre_producto} 
                    className="w-20 h-20 object-cover rounded-lg" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

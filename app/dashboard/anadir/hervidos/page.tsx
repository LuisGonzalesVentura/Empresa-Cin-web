"use client";  // Asegúrate de que esta línea esté presente


import { useState, useEffect } from 'react'; // Importación de hooks de React
import Link from 'next/link'; // Importación para generar enlaces en Next.js
import { FaArrowLeft } from "react-icons/fa"; // Icono para el botón de "volver atrás"

interface Producto { // Definición de la interfaz para un producto
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number;
  foto: string;
  nombre_ciudad: string;
}

interface Ciudad { // Definición de la interfaz para una ciudad
  id_ciudad: number;
  nombre_ciudad: string;
}

export default function ListadoHervidos() { // Componente principal
  const [productos, setProductos] = useState<Producto[]>([]); // Estado para almacenar productos
  const [ciudades, setCiudades] = useState<Ciudad[]>([]); // Estado para almacenar ciudades
  const [loading, setLoading] = useState(true); // Estado de carga, inicialmente true mientras se cargan los datos
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

const [nombreProductoHervidos, setNombreProductoHervidos] = useState('');
const [precioHervidos, setPrecioHervidos] = useState('');
const [descuentoHervidos, setDescuentoHervidos] = useState('');
const [idCiudadHervidos, setIdCiudadHervidos] = useState<number | ''>('');
const [fotoHervidos, setFotoHervidos] = useState<File | null>(null);


  // Estado para filtrar y ordenar los productos
  const [searchTerm, setSearchTerm] = useState(''); // Para la búsqueda por nombre
  const [sortKey, setSortKey] = useState<'nombre_producto' | 'precio' | 'descuento' | 'nombre_ciudad'>('nombre_producto'); // Clave por la cual ordenar
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Orden de la clasificación (ascendente o descendente)

  useEffect(() => { // Hook para cargar datos cuando el componente se monta
    // Función para obtener los productos desde la API
    async function fetchProductos() {
      try {
        const response = await fetch('/api/productos/hervidos'); // Llamada a la API
        if (response.ok) {
          const data = await response.json(); // Convertir la respuesta en formato JSON
          setProductos(data); // Actualizar el estado de productos
        } else {
          setError('No se pudieron cargar los hervidos.');
        }
      } catch (err) {
        console.error('Error al obtener hervidos:', err);
        setError('Ocurrió un error al obtener los hervidos.');
      } finally {
        setLoading(false); // Indicar que la carga ha terminado
      }
    }

    // Función para obtener las ciudades desde la API
    async function fetchCiudades() {
      try {
        const response = await fetch('/api/ciudades');
        if (response.ok) {
          const data = await response.json();
          setCiudades(data); // Actualizar el estado de las ciudades
        } else {
          setError('No se pudieron cargar las ciudades.');
        }
      } catch (err) {
        console.error('Error al obtener ciudades:', err);
        setError('Ocurrió un error al obtener las ciudades.');
      }
    }

    fetchProductos(); // Llamada a la función de productos
    fetchCiudades(); // Llamada a la función de ciudades
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

 // Función para manejar el envío del formulario de agregar un hervido
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevenir comportamiento por defecto

  if (!nombreProductoHervidos || !precioHervidos || !idCiudadHervidos || !fotoHervidos) {
    setError('Por favor, completa todos los campos.');
    return;
  }

  const formData = new FormData();
  formData.append('nombre_producto_hervidos', nombreProductoHervidos);
  formData.append('precio_hervidos', precioHervidos);
  formData.append('descuento_hervidos', descuentoHervidos || '0');
  formData.append('id_ciudad_hervidos', idCiudadHervidos.toString());
  formData.append('foto_hervidos', fotoHervidos);
  
  // Log de FormData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  

  try {
    const response = await fetch('/api/productos/agregar_hervidos', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const nuevoProducto = await response.json();
      console.log('Producto hervido agregado:', nuevoProducto);
      alert('¡Producto hervido agregado exitosamente!');
      
      // Opcional: resetear estados
      setNombreProductoHervidos('');
      setPrecioHervidos('');
      setDescuentoHervidos('');
      setIdCiudadHervidos('');
      setFotoHervidos(null);
      setError('');
    } else {
      const errorData = await response.json();
      
      console.error('Error al agregar producto:', errorData);
      setError('Error al agregar producto. Revisa los campos e intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    setError('Hubo un problema al enviar los datos. Intenta más tarde.');
  }
};
  // Función para manejar el ordenamiento de la tabla de productos
  const handleSort = (key: typeof sortKey) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'; // Cambiar el orden de clasificación
    setSortKey(key); // Actualizar la clave por la cual ordenar
    setSortOrder(order); // Actualizar el orden
  };

  // Filtrar los productos según el término de búsqueda
  const filteredProducts = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar los productos según la clave y el orden
  const sortedProducts = filteredProducts.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  if (loading) return <p>Cargando hervidos...</p>; // Mensaje de carga
  if (error) return <p>{error}</p>; // Mensaje de error

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      {/* Sección para volver al inicio */}
      <div className="w-full flex justify-end -mt-2 mr-24">
        <Link href="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </button>
        </Link>
      </div>

      {/* Formulario para agregar un nuevo hervido */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Agregar Nuevo Hervido</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
  {/* Nombre del Producto */}
  <div className="flex flex-col">
    <label className="font-semibold">Nombre del Producto</label>
    <input
      type="text"
      value={nombreProductoHervidos}
      onChange={(e) => setNombreProductoHervidos(e.target.value)}
      className="border rounded-lg p-2"
      required
    />
  </div>

  {/* Precio */}
  <div className="flex flex-col">
    <label className="font-semibold">Precio</label>
    <input
      type="number"
      value={precioHervidos}
      onChange={(e) => setPrecioHervidos(e.target.value)}
      className="border rounded-lg p-2"
      required
    />
  </div>

  {/* Descuento */}
  <div className="flex flex-col">
    <label className="font-semibold">Descuento (%)</label>
    <input
      type="number"
      value={descuentoHervidos}
      onChange={(e) => setDescuentoHervidos(e.target.value)}
      className="border rounded-lg p-2"
    />
  </div>

  {/* Ciudad */}
  <div className="flex flex-col">
    <label className="font-semibold">Ciudad</label>
    <select
      value={idCiudadHervidos}
      onChange={(e) => setIdCiudadHervidos(Number(e.target.value))}
      className="border rounded-lg p-2"
      required
    >
      <option value="">Selecciona una ciudad</option>
      {ciudades.map((c) => (
        <option key={c.id_ciudad} value={c.id_ciudad}>
          {c.nombre_ciudad}
        </option>
      ))}
    </select>
  </div>

  {/* Foto */}
  <div className="flex flex-col">
    <label className="font-semibold">Foto del Producto</label>
    <input
      type="file"
      onChange={(e) => setFotoHervidos(e.target.files?.[0] || null)}
      className="border rounded-lg p-2"
      required
    />
  </div>

  {/* Botón de Enviar */}
  <button
    type="submit"
    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg mt-4"
  >
    Agregar Hervido
  </button>
</form>

      </div>

      {/* Listado de hervidos */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Listado de Hervidos</h1>

        {/* Campo de búsqueda */}
        <input type="text" placeholder="Buscar por nombre" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-4 w-full px-4 py-2 border rounded-lg" />

        {/* Tabla de productos */}
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-orange-500 text-white">
            {/* Cabecera de la tabla con opción de ordenamiento */}
            <tr>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('nombre_producto')}>Nombre</th>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('precio')}>Precio</th>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('descuento')}>Descuento</th>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('nombre_ciudad')}>Ciudad</th>
              <th className="px-4 py-2 border">Foto</th>
            </tr>
          </thead>
          <tbody>
            {/* Mostrar los productos ordenados y filtrados */}
            {sortedProducts.map((producto) => (
              <tr key={producto.id_producto} className="text-center">
                <td className="px-4 py-2 border">{producto.nombre_producto}</td>
                <td className="px-4 py-2 border">Bs {producto.precio}</td>
                <td className="px-4 py-2 border">{producto.descuento}%</td>
                <td className="px-4 py-2 border">{producto.nombre_ciudad}</td>
                <td className="px-4 py-2 border">
                  <img src={`/uploads/${producto.foto}`} alt={producto.nombre_producto} className="h-20 mx-auto object-cover rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Producto = {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number | null;
  id_ciudad: number;
  foto: string; // en el tipo Producto
};

type Ciudad = {
  id_ciudad: number;
  nombre_ciudad: string;
};

export default function EditarProducto() {
  const params = useParams() as { id: string };
  const router = useRouter();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]); // Estado para almacenar las ciudades
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio: '',
    descuento: '',
    ciudad: '',
    imagen: null as File | null, // Para manejar la imagen
  });

  const id = params?.id;

  useEffect(() => {
    // Obtener el producto
    const obtenerProducto = async () => {
      try {
        const res = await fetch(`/api/productos/jugos/${id}`);
        const data = await res.json();
        setProducto(data);
        setFormData({
          nombre_producto: data.nombre_producto,
          precio: data.precio,
          descuento: data.descuento || '',
          ciudad: data.id_ciudad.toString(),
          imagen: null, // Para cargar la imagen al principio
        });
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    // Obtener las ciudades disponibles
    const obtenerCiudades = async () => {
      try {
        const res = await fetch('/api/ciudades'); // Asegúrate de que este endpoint devuelva las ciudades
        const data = await res.json();
        setCiudades(data); // Guardar las ciudades en el estado
      } catch (error) {
        console.error('Error al obtener las ciudades:', error);
      }
    };

    if (id) {
      obtenerProducto();
      obtenerCiudades();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('nombre_producto', formData.nombre_producto);
    form.append('precio', parseFloat(formData.precio).toString()); // Asegurarse de que el precio sea un número
    form.append('descuento', formData.descuento ? parseFloat(formData.descuento).toString() : ''); // Verifica si hay descuento
    form.append('ciudad', formData.ciudad);
    if (formData.imagen) {
      form.append('foto', formData.imagen); // Agregar la imagen al formulario
    }
    const res = await fetch(`/api/productos/jugos/editar/${id}`, {
        method: 'POST',
        body: form,
      });
      
      

      if (res.ok) {
        alert('Producto actualizado correctamente');
        router.push('/dashboard/editar/editar_jugo');
      } else {
        const errorData = await res.json();
        console.error('Error al actualizar el producto:', errorData);
        alert('Error al actualizar el producto');
      }
  };

  if (!producto || ciudades.length === 0) return <p className="text-center pt-10">Cargando producto...</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Editar Producto</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Descuento</label>
            <input
              type="number"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Ciudad</label>
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre_ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar la imagen del producto actual */}
          {producto.foto ? (
  <img
    src={`/uploads/${producto.foto}`}
    alt="Imagen del producto"
    className="w-full h-auto mb-2 rounded-lg shadow"
  />
) : (
  <p className="text-sm text-gray-500 italic">No hay imagen disponible.</p>
)}






          {/* Campo para cargar una nueva imagen */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nueva Imagen</label>
            <input
              type="file"
              name="imagen"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

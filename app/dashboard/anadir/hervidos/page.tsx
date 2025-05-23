"use client";

import { useHervidosViewModel } from "@/lib/anadir/useHervidosViewModel";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ListadoHervidos() {
  const {
    nombre,
    setNombre,
    precio,
    setPrecio,
    descuento,
    setDescuento,
    idCiudad,
    setIdCiudad,
    foto,
    setFoto,
    loading,
    error,
    ciudades,
    handleSubmit,
    searchTerm,
    setSearchTerm,
    handleSort,
    productos,
  } = useHervidosViewModel();

  if (loading) return <p>Cargando hervidos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      {/* Botón de regreso */}
      <div className="w-full flex justify-end -mt-2 mr-24">
        <Link href="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </button>
        </Link>
      </div>

      {/* Formulario de nuevo hervido */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Agregar Nuevo Hervido
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold">Nombre del Producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Descuento (%)</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Ciudad</label>
            <select
              value={idCiudad}
              onChange={(e) => setIdCiudad(Number(e.target.value))}
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

          <div className="flex flex-col">
            <label className="font-semibold">Foto del Producto</label>
            <input
              type="file"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg mt-4"
          >
            Agregar Hervido
          </button>
        </form>
      </div>

      {/* Listado de productos */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Listado de Hervidos
        </h1>

        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-lg"
        />

        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("nombre_producto")}
              >
                Nombre
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("precio")}
              >
                Precio
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("descuento")}
              >
                Descuento
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("nombre_ciudad")}
              >
                Ciudad
              </th>
              <th className="px-4 py-2 border">Foto</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto} className="text-center">
                <td className="px-4 py-2 border">{producto.nombre_producto}</td>
                <td className="px-4 py-2 border">Bs {producto.precio}</td>
                <td className="px-4 py-2 border">{producto.descuento}%</td>
                <td className="px-4 py-2 border">{producto.nombre_ciudad}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={`/uploads/${producto.foto}`}
                    alt={producto.nombre_producto}
                    className="h-20 mx-auto object-cover rounded"
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

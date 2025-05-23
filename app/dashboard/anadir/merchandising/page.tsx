"use client"; // Asegúrate de que esta línea esté presente

import { FaArrowLeft } from "react-icons/fa";
import { useMerchandisingViewModel } from "@/lib/anadir/useMerchandisingViewModel";
import Link from "next/link";

export default function ListadoProductosMechardinsig() {
  const {
    productos,
    ciudades,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortedProducts,
    handleSubmitMerchandising,
    nombreProducto,
    setNombreProducto,
    precio,
    setPrecio,
    descuento,
    setDescuento,
    ciudad,
    setCiudad,
    foto,
    setFoto,
  } = useMerchandisingViewModel();

  if (loading) return <p>Cargando productos...</p>;

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
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Agregar Nuevo Merchadinsing
        </h1>

        <form onSubmit={handleSubmitMerchandising} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="nombreProducto" className="font-semibold">
              Nombre del Producto
            </label>
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
            <label htmlFor="precio" className="font-semibold">
              Precio
            </label>
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
            <label htmlFor="descuento" className="font-semibold">
              Descuento (%)
            </label>
            <input
              type="number"
              id="descuento"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="ciudad" className="font-semibold">
              Ciudad
            </label>
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
            <label htmlFor="foto" className="font-semibold">
              Foto del Producto
            </label>
            <input
              type="file"
              id="foto"
              onChange={(e) =>
                setFoto(e.target.files ? e.target.files[0] : null)
              }
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg mt-4"
          >
            Agregar Producto de Merchandising
          </button>
        </form>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-5xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Listado de Merchadinsing
        </h1>

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
                onClick={() => handleSort("nombre_producto")}
              >
                Nombre del Producto
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

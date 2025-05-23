"use client";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useFiltradoViewModel } from "../../../lib/busqueda/useFiltradoViewModel";

export default function FiltradoBusqueda() {
  const {
    productosHervidosRender,
    productosJugosRender,
    query,
    cargando,
    agregarProducto,
  } = useFiltradoViewModel();

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-700 px-6 text-center">
        <Loader2 className="animate-spin w-10 h-10 text-orange-500 mb-6" />
        <h2 className="text-xl font-semibold mb-2">Cargando productos...</h2>
        <p className="text-sm text-gray-600">
          Estamos preparando todo para ti. Esto tomará solo unos segundos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-3xl font-semibold mt-12 mb-8 text-orange-600">
          Resultados para: "{query}"
        </h2>
        <Link
          href="/dashboard"
          className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
        >
          <FaArrowLeft />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <h3 className="text-2xl font-bold mt-4 mb-6 text-orange-600">
        Hervidos encontrados
      </h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {productosHervidosRender.length > 0 ? (
          productosHervidosRender.map((producto) => (
            <div
              key={producto.keyId}
              className="border rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
            >
              <img
                src={`/uploads/${producto.foto}`}
                alt={producto.nombre_producto}
                className="w-full h-100 object-cover rounded-xl mb-4"
              />
              <p className="text-lg font-semibold text-gray-800">
                {producto.nombre_producto}
              </p>

              {producto.descuento > 0 && (
                <div className="mt-2 text-sm text-red-700 font-semibold bg-red-100 py-1 px-3 inline-block rounded-full">
                  {`Descuento: ${producto.descuento}% `}
                  <span className="line-through text-gray-400 ml-1">
                    {`Bs. ${producto.precioOriginal.toFixed(2)}`}
                  </span>
                </div>
              )}

              <p className="text-green-600 font-bold text-xl mt-2">
                {`Bs. ${producto.precioFinal.toFixed(2)}`}
              </p>

              {producto.cantidad === 0 ? (
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full"
                  onClick={() => agregarProducto(producto, producto.origen, 1)}
                >
                  Agregar
                </button>
              ) : (
                <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner">
                  <button
                    onClick={() =>
                      agregarProducto(producto, producto.origen, -1)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                    {producto.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      agregarProducto(producto, producto.origen, 1)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No se encontraron hervidos con ese nombre en tu ciudad.</p>
        )}
      </section>

      <h3 className="text-2xl font-bold mt-12 mb-6">Jugos encontrados</h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {productosJugosRender.length > 0 ? (
          productosJugosRender.map((producto) => (
            <div
              key={producto.keyId}
              className="border rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
            >
              <img
                src={`/uploads/${producto.foto}`}
                alt={producto.nombre_producto}
                className="w-full h-100 object-cover rounded-xl mb-4"
              />
              <p className="text-lg font-semibold text-gray-800">
                {producto.nombre_producto}
              </p>

              {producto.descuento > 0 && (
                <div className="mt-2 text-sm text-red-700 font-semibold bg-red-100 py-1 px-3 inline-block rounded-full">
                  {`Descuento: ${producto.descuento}% `}
                  <span className="line-through text-gray-400 ml-1">
                    {`Bs. ${producto.precioOriginal.toFixed(2)}`}
                  </span>
                </div>
              )}

              <p className="text-green-600 font-bold text-xl mt-2">
                {`Bs. ${producto.precioFinal.toFixed(2)}`}
              </p>

              {producto.cantidad === 0 ? (
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full"
                  onClick={() => agregarProducto(producto, producto.origen, 1)}
                >
                  Agregar
                </button>
              ) : (
                <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner">
                  <button
                    onClick={() =>
                      agregarProducto(producto, producto.origen, -1)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                    {producto.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      agregarProducto(producto, producto.origen, 1)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No se encontraron jugos con ese nombre en tu ciudad.</p>
        )}
      </section>
    </div>
  );
}

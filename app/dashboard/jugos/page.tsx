"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBottleWater } from "@fortawesome/free-solid-svg-icons";
import { useJugosViewModel } from "@/lib/jugos/useJugosViewModel";

export default function Page() {
  const { jugosRenderizados } = useJugosViewModel();

  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-orange-600 text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          Jugos
        </h2>
        <Link
          href="/dashboard"
          className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
        >
          <FaArrowLeft />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {jugosRenderizados.map(({ volumen, productos }) => (
        <div key={volumen}>
          <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-3 text-left">
            {volumen}
            <FontAwesomeIcon
              icon={faBottleWater}
              className="text-3xl text-orange-500"
            />
          </h3>

          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {productos.map((p) => (
              <div
                key={p.id}
                className="border border-gray-200 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
              >
                <img
                  src={`/uploads/${p.foto}`}
                  alt={p.nombre}
                  className="w-full h-100 object-cover rounded-xl mb-4"
                />
                <p className="text-lg font-semibold text-gray-800">
                  {p.nombre}
                </p>

                {p.tieneDescuento && (
                  <div className="mt-2 text-sm text-red-700 font-semibold bg-red-100 py-1 px-3 inline-block rounded-full">
                    Descuento: {p.descuentoRaw}%
                    <span className="line-through text-gray-400 ml-1">
                      Bs. {p.precioOriginal}
                    </span>
                  </div>
                )}

                <p className="text-green-600 font-bold text-xl mt-2">
                  Bs. {p.precioFinal}
                </p>

                {p.mostrarBotonAgregar ? (
                  <button
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-base font-medium shadow-sm transition duration-200"
                    onClick={p.onAgregar}
                  >
                    Agregar
                  </button>
                ) : (
                  <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner mx-auto max-w-[160px]">
                    <button
                      onClick={p.onRestar}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                      {p.cantidad}
                    </span>
                    <button
                      onClick={p.onSumar}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      ))}
    </main>
  );
}

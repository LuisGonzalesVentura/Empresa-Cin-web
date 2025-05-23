"use client";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useHomeViewModel } from "@/lib/home/useHomeViewModel";
import { useOfertasViewModel } from "@/lib/ofertas/useOfertasViewModel";

const images = ["/banner1.png", "/banner2.png", "/banner3.png"];

export default function Page() {
  const {
    current,
    setCurrent,

    goToNext,
    goToPrev,
  } = useHomeViewModel();

  const {
    productosFiltrados,
    selectedFilter,
    menuOpen,
    cantidades,

    setMenuOpen,
    handleFilterChange,
    incrementarCantidad,
    decrementarCantidad,
    calcularPrecioFinal,
  } = useOfertasViewModel();

  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
      {/* Carrusel */}
      <section className="w-full mb-8 overflow-hidden rounded-2xl shadow-md">
        <div className="relative w-full h-[140px] sm:h-[220px] md:h-[300px] lg:h-[400px] transition-all duration-500 group">
          <Image
            key={images[current]}
            src={images[current]}
            alt={`banner ${current + 1}`}
            fill
            className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
            priority
          />

          {/* Botón anterior */}
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md text-orange-600 hover:bg-orange-500 hover:text-white hover:scale-110 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label="Anterior"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Botón siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md text-orange-600 hover:bg-orange-500 hover:text-white hover:scale-110 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label="Siguiente"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 w-full flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === index ? "bg-orange-500 scale-110" : "bg-white/60"
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Header Ofertas */}
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-4xl font-bold text-orange-600">Ofertas</h2>
        <Link
          href="/dashboard"
          className="text-lg text-orange-600 font-semibold flex items-center gap-2"
        >
          <FaArrowLeft /> <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="relative mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap justify-center gap-4 md:justify-start" />
        <div className="relative mt-4 flex justify-end w-full md:mt-0 md:w-auto">
          <button
            className="text-2xl text-orange-500 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>

          {menuOpen && (
            <div className="absolute top-10 w-full p-4 bg-white rounded-md shadow-xl z-20 md:w-60 md:right-0">
              {[
                "Destacados",
                "Precio Menor a Mayor",
                "Precio Mayor a Menor",
              ].map((filtro) => (
                <button
                  key={filtro}
                  onClick={() => handleFilterChange(filtro)}
                  className="w-full text-lg text-left text-gray-800 hover:text-orange-500"
                >
                  {filtro}
                </button>
              ))}
            </div>
          )}

          {selectedFilter && (
            <div className="ml-2 mt-2 text-base font-semibold text-orange-600 md:mt-0">
              <span className="italic">{selectedFilter}</span>
            </div>
          )}
        </div>
      </div>

      {/* Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center text-gray-500 italic mt-6">
          Pronto habrá productos disponibles en esta categoría.
        </div>
      ) : (
        <section className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {productosFiltrados.map((producto) => {
            const keyId = `${producto.categoria}-${producto.id_producto}`;
            const precioFinal = calcularPrecioFinal(producto).toFixed(2);
            const cantidad = cantidades[keyId] || 0;

            return (
              <div
                key={keyId}
                className="p-4 bg-white rounded-2xl border shadow-md hover:shadow-xl hover:scale-105 transition-all text-center"
              >
                <img
                  src={`/uploads/${producto.foto}`}
                  alt={producto.nombre_producto}
                  className="w-full h-100 object-cover rounded-xl mb-4"
                />
                <p className="text-lg font-semibold text-gray-800">
                  {producto.nombre_producto}
                </p>

                <div className="mt-2 text-sm font-semibold text-red-700 bg-red-100 py-1 px-3 rounded-full inline-block">
                  Descuento: {producto.descuento}%
                  <span className="ml-1 line-through text-gray-400">
                    Bs. {producto.precio.toFixed(2)}
                  </span>
                </div>

                <p className="mt-2 text-xl font-bold text-green-600">
                  Bs. {precioFinal}
                </p>

                {cantidad === 0 ? (
                  <button
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-base font-medium transition duration-200"
                    onClick={() => incrementarCantidad(keyId, producto)}
                  >
                    Agregar
                  </button>
                ) : (
                  <div className="mt-4 flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-inner max-w-[160px] mx-auto">
                    <button
                      onClick={() => decrementarCantidad(keyId, producto)}
                      className="w-8 h-8 text-white bg-red-500 hover:bg-red-600 rounded-full text-lg font-bold shadow"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-800">
                      {cantidad}
                    </span>
                    <button
                      onClick={() => incrementarCantidad(keyId, producto)}
                      className="w-8 h-8 text-white bg-green-500 hover:bg-green-600 rounded-full text-lg font-bold shadow"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Beneficios */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-orange-500 text-center mb-8">
            CONOCE NUESTROS BENEFICIOS
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
            {["icono1.png", "icono2.png", "icono3.png"].map((icon, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={`/${icon}`}
                  alt={`Icono ${i + 1}`}
                  className="w-24 h-24 mb-4"
                />
                <p className="font-semibold text-gray-800">
                  {i === 0 && (
                    <>
                      Regístrate y activa tu cuenta en <br /> Cin Bolivia
                    </>
                  )}
                  {i === 1 && (
                    <>
                      Revisa nuestro catálogo y <br /> escoge tus productos
                    </>
                  )}
                  {i === 2 && (
                    <>
                      Recibe tu pedido en la <br /> puerta de tu casa
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

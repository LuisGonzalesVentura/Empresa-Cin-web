"use client";
import Link from "next/link";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useOfertasViewModel } from "@/lib/ofertas/useOfertasViewModel";
import { ProductoConCategoria } from "@/types/types";

export default function Page() {
  const {
    productosFiltrados,
    cantidades,
    selectedFilter,
    menuOpen,
    setMenuOpen,
    handleFilterChange,
    incrementarCantidad,
    decrementarCantidad,
    calcularPrecioFinal,
  } = useOfertasViewModel();

  const renderProducto = (producto: ProductoConCategoria) => {
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
  };

  const renderFiltros = () =>
    ["Destacados", "Precio Menor a Mayor", "Precio Mayor a Menor"].map(
      (filtro) => (
        <button
          key={filtro}
          onClick={() => handleFilterChange(filtro)}
          className="w-full text-lg text-left text-gray-800 hover:text-orange-500"
        >
          {filtro}
        </button>
      ),
    );

  const renderBeneficioTexto = (index: number) => {
    const textos = [
      <>
        Regístrate y activa tu cuenta en <br /> Cin Bolivia
      </>,
      <>
        Revisa nuestro catálogo y <br /> escoge tus productos
      </>,
      <>
        Recibe tu pedido en la <br /> puerta de tu casa
      </>,
    ];
    return textos[index] || null;
  };

  return (
    <main className="px-4 py-6 text-black bg-white font-poppins md:px-16">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-4xl font-bold text-orange-600">Ofertas</h2>
        <Link
          href="/dashboard"
          className="text-lg text-orange-600 font-semibold flex items-center gap-2"
        >
          <FaArrowLeft /> <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="relative mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap justify-center gap-4 md:justify-start"></div>

        <div className="relative mt-4 flex justify-end w-full md:mt-0 md:w-auto">
          <button
            className="text-2xl text-orange-500 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>

          {menuOpen && (
            <div className="absolute top-10 w-full p-4 bg-white rounded-md shadow-xl z-20 md:w-60 md:right-0">
              {renderFiltros()}
            </div>
          )}

          {selectedFilter && (
            <div className="ml-2 mt-2 text-base font-semibold text-orange-600 md:mt-0">
              <span className="italic">{selectedFilter}</span>
            </div>
          )}
        </div>
      </div>

      <section className="min-h-[120px]">
        {productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 italic mt-6">
            Pronto habrá productos disponibles en esta categoría.
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {productosFiltrados.map(renderProducto)}
          </div>
        )}
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-orange-500 text-center mb-8">
            CONOCE NUESTROS BENEFICIOS
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={`/icono${i + 1}.png`}
                  alt={`Icono ${i + 1}`}
                  className="w-24 h-24 mb-4"
                />
                <p className="font-semibold text-gray-800">
                  {renderBeneficioTexto(i)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

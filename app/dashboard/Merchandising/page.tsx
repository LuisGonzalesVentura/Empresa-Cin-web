"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useMerchandisingViewModel } from "@/lib/merchandising/useMerchandisingViewModel";
import ProductCard from "./ProductCard";

export default function Page() {
  const {
    cargando,
    cantidades,
    productosFiltrados,
    agregarProducto,
    calcularPrecioFinal,
  } = useMerchandisingViewModel();

  const renderContenido = () => {
    if (cargando) {
      return (
        <p className="text-center text-gray-500 col-span-full">
          Cargando productos...
        </p>
      );
    }

    if (productosFiltrados.length === 0) {
      return (
        <p className="text-center text-gray-400 italic col-span-full">
          No hay productos disponibles
        </p>
      );
    }

    return productosFiltrados.map((producto) => {
      const keyId = `merchandising-${producto.id_producto}`;
      const cantidad = cantidades[keyId] || 0;
      const precioFinal = calcularPrecioFinal(producto);

      return (
        <ProductCard
          key={producto.id_producto}
          producto={producto}
          cantidad={cantidad}
          precioFinal={precioFinal}
          agregarProducto={agregarProducto}
          keyId={keyId}
        />
      );
    });
  };

  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-orange-600 text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          Merchandising
        </h2>
        <Link
          href="/dashboard"
          className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
        >
          <FaArrowLeft />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <h3 className="text-orange-600 text-2xl font-bold mt-8 mb-4 text-left">
        Productos de Merchandising
      </h3>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {renderContenido()}
      </section>
    </main>
  );
}

"use client";

import React from "react";
import { Producto } from "@/types/types";

interface ProductCardProps {
  producto: Producto;
  cantidad: number;
  precioFinal: string;
  agregarProducto: (
    producto: Producto,
    keyId: string,
    cantidad: number,
  ) => void;
  keyId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  cantidad,
  precioFinal,
  agregarProducto,
  keyId,
}) => {
  const precioOriginal = producto.precio.toFixed(2);

  const renderBotonCantidad = () => (
    <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner mx-auto max-w-[160px]">
      <button
        onClick={() => agregarProducto(producto, keyId, -1)}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
      >
        −
      </button>
      <span className="text-lg font-semibold text-gray-800 w-6 text-center">
        {cantidad}
      </span>
      <button
        onClick={() => agregarProducto(producto, keyId, 1)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
      >
        +
      </button>
    </div>
  );

  const renderBotonAgregar = () => (
    <button
      className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-base font-medium shadow-sm transition duration-200"
      onClick={() => agregarProducto(producto, keyId, 1)}
    >
      Agregar
    </button>
  );

  return (
    <div
      key={producto.id_producto}
      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
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
          {`Descuento: ${producto.descuento}%`}
          <span className="line-through text-gray-400 ml-1">{`Bs. ${precioOriginal}`}</span>
        </div>
      )}

      <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>

      {cantidad === 0 ? renderBotonAgregar() : renderBotonCantidad()}
    </div>
  );
};

export default ProductCard;

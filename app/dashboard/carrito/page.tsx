"use client";
import Image from "next/image";
import {
  useCarrito,
  prepararProductosParaRender,
} from "@/lib/carrito/logica_carrito";

export default function CarritoPage() {
  const {
    productos,
    quitarProducto,
    irAPago,
    calcularTotal,
    calcularCantidadTotal,
    irAInicio,
  } = useCarrito();
  const productosRender = prepararProductosParaRender(productos);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Carrito de Compras
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {productosRender.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Tu carrito está vacío.</p>
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 mt-4 w-full"
              onClick={irAInicio}
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <div>
            {productosRender.map((producto) => (
              <div
                key={producto.key}
                className="flex justify-between items-center mb-6 border-b pb-4"
              >
                <div className="flex items-center space-x-6">
                  <Image
                    src={`/uploads/${producto.foto}`}
                    alt={producto.nombre_producto}
                    width={96}
                    height={96}
                    className="object-cover rounded-md shadow-md"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {producto.nombre_producto}
                    </span>
                    <div className="text-sm text-gray-500">
                      Cantidad: x{producto.cantidad}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right">
                  {producto.descuento > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        Bs. {producto.precio.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Descuento: {producto.descuento}%
                      </span>
                    </>
                  )}
                  <span className="text-base font-semibold text-gray-800">
                    Bs. {producto.precioFinal.toFixed(2)} x {producto.cantidad}
                  </span>
                  <span className="text-sm text-gray-600">
                    Total: Bs. {producto.total.toFixed(2)}
                  </span>
                  <button
                    className="mt-2 text-red-500 hover:text-red-700 font-semibold"
                    onClick={() =>
                      quitarProducto(producto.id_producto, producto.origen)
                    }
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {productosRender.length > 0 && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Artículos en total:</span>
            <span className="font-semibold text-gray-800">
              {calcularCantidadTotal(productos)}
            </span>
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-semibold text-lg text-gray-800">
              Total a pagar
            </span>
            <span className="text-xl font-semibold text-gray-800">
              Bs. {calcularTotal(productos)}
            </span>
          </div>

          <div className="flex justify-between mt-6 space-x-4">
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 w-full"
              onClick={irAInicio}
            >
              Seguir Comprando
            </button>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 w-full"
              onClick={irAPago}
            >
              Ir al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

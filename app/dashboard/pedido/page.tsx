"use client";

import { usePedidoViewModel } from "@/lib/pedidos/usePedidoViewModel";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapSelector = dynamic(() => import("@/components/MapSelector"), {
  ssr: false,
});

export default function PedidoPage() {
  const {
    usuario,
    direccion,
    setDireccion,
    ubicacion,
    actualizarUbicacion,
    productos,
    total,
    qr,
    pedido,
    realizarPedido,
    timeLeft,
    formatTime,
    guardarImagenQR,
  } = usePedidoViewModel();

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    actualizarUbicacion(coords);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-center text-orange-600">
        Realizar Pedido
      </h1>

      {/* Datos del usuario */}
      <section className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-orange-600">
          Datos del Usuario
        </h2>
        {usuario ? (
          <div className="space-y-4">
            {[
              {
                label: "Nombre",
                value: `${usuario.nombre} ${usuario.apellido}`,
              },
              { label: "Nombre Factura", value: usuario.nombre_factura },
              { label: "CI/NIT", value: usuario.ci_nit },
              { label: "Fecha de Nacimiento", value: usuario.fecha_nacimiento },
              { label: "Email", value: usuario.email },
              { label: "Teléfono", value: usuario.telefono },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
              >
                <p className="text-sm font-medium text-gray-600">
                  {item.label}:
                </p>
                <p className="text-base text-gray-800 text-right sm:text-left">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Cargando información del usuario...
          </p>
        )}
      </section>

      {/* Ubicación */}
      <section className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Ubicación de Entrega
        </h2>
        <div>
          <label className="block mb-2 font-medium text-gray-600">
            Dirección detallada
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej. Calle Bolívar #123"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
          />
        </div>

        <div className="mt-4">
          <h3 className="mb-2 font-medium text-gray-600">
            Selecciona tu ubicación en el mapa
          </h3>
          {ubicacion && (
            <p className="mb-2 text-sm text-gray-600">
              Coordenadas seleccionadas:{" "}
              <strong>
                {ubicacion.lat.toFixed(5)}, {ubicacion.lng.toFixed(5)}
              </strong>
            </p>
          )}
          <MapSelector onLocationSelect={handleLocationSelect} />
        </div>
      </section>

      {/* Resumen del carrito */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Resumen del Carrito
        </h2>
        <ul className="space-y-3">
          {productos.length > 0 ? (
            productos.map((producto: any) => {
              const precioConDescuento = producto.descuento
                ? producto.precio - (producto.precio * producto.descuento) / 100
                : producto.precio;

              return (
                <li
                  key={`${producto.tipo}-${producto.id_producto}`}
                  className="flex justify-between text-gray-600"
                >
                  <span>
                    {producto.cantidad}x {producto.nombre_producto}
                  </span>
                  <span>Bs {precioConDescuento.toFixed(2)}</span>
                </li>
              );
            })
          ) : (
            <li className="text-sm text-gray-500">
              No hay productos en el carrito
            </li>
          )}
        </ul>
        <p className="mt-4 font-semibold text-lg text-right text-gray-800">
          Total: Bs {total.toFixed(2)}
        </p>
      </section>

      {/* QR generado con contador */}
      {qr && pedido && (
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">QR Generado</h2>
          {timeLeft > 0 ? (
            <p className="text-gray-600">
              Este QR expira en <strong>{formatTime(timeLeft)}</strong> minutos.
              No recargue la pagina.
            </p>
          ) : (
            <p className="text-red-600 font-semibold">El QR ha expirado.</p>
          )}
          <img
            src={`data:image/png;base64,${qr}`}
            alt="Código QR"
            className="w-64 h-64 mx-auto"
          />
       <div className="mt-4 text-center">
  <button
    onClick={guardarImagenQR}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    Guardar Imagen
  </button>
</div>
          {/* Nueva sección con resumen */}
          <div className="mt-4 text-gray-700">
            <p>
              <strong>Monto total a pagar:</strong> Bs {total.toFixed(2)}
            </p>
            <p>
              <strong>Productos:</strong>
            </p>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">
              {productos
                .map((p: any) => {
                  const precioConDescuento = p.descuento
                    ? p.precio - (p.precio * p.descuento) / 100
                    : p.precio;
                  return `${p.cantidad}x ${p.nombre_producto.trim()} - Bs ${precioConDescuento.toFixed(2)}`;
                })
                .join("\n")}
            </pre>
          </div>
        </section>
      )}

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button
          onClick={realizarPedido}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition ease-in-out duration-200"
        >
          Realizar Pedido
        </button>

        <Link
          href="/dashboard/carrito"
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition ease-in-out duration-200"
        >
          Cancelar
        </Link>
      </div>
    </div>
  );
}

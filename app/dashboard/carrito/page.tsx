'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductoCarrito {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  foto: string; // ruta relativa de la imagen, como "producto1.jpg"
}

export default function CarritoDetalle() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);

  // Cargar el carrito desde localStorage
  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    setProductos(carrito);
  }, []);

  // Calcular el total
  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);
  };

  
  const quitarDelCarrito = (id_producto: number) => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const nuevoCarrito = carrito.filter((item: any) => item.id_producto !== id_producto);
  
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  
    // ✅ Dispara evento para actualizar contador si es necesario
    const evento = new Event('carritoActualizado');
    window.dispatchEvent(evento);
  
    // ✅ Recargar la página automáticamente
    window.location.reload();
  };
  

  // Redirigir al proceso de pago
  const handleIrAPago = () => {
    router.push('/pago');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Carrito de Compras</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {productos.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <div>
            {productos.map((producto) => (
              <div
                key={producto.id_producto}
                className="flex justify-between items-center mb-6 border-b pb-4"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={`/uploads/${producto.foto}`}
                    alt={producto.nombre_producto}
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">{producto.nombre_producto}</span>
                    <div className="text-sm text-gray-500">Cantidad: x{producto.cantidad}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-semibold text-gray-800">Bs. {producto.precio * producto.cantidad}</span>
                  <button
  className="mt-2 text-red-500 hover:text-red-700 font-semibold"
  onClick={() => quitarDelCarrito(producto.id_producto)}
>
  Quitar
</button>

                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between mb-6">
          <span className="font-semibold text-lg text-gray-800">Total</span>
          <span className="text-xl font-semibold text-gray-800">Bs. {calcularTotal()}</span>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 w-full"
            onClick={() => router.push('/dashboard')}
          >
            Seguir Comprando
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 w-full"
            onClick={handleIrAPago}
          >
            Ir al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

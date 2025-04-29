'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface ProductoCarrito {
  id_producto: number;
  nombre_producto: string;
  descuento: number;
  cantidad: number;
  precio: number;
  foto: string;
  origen: string; // ✅ nuevo campo necesario
}

export default function CarritoDetalle() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cantidades');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  useEffect(() => {
    const cargarCarrito = () => {
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      console.log("Carrito cargado:", carrito); // Verifica los productos cargados
      setProductos(carrito);
    };
   
  
    // Cargar al montar
    cargarCarrito();
  
    // Escuchar cuando se actualiza
    const handleActualizar = () => {
      cargarCarrito();
      
    };
  
    window.addEventListener('carritoActualizado', handleActualizar);
  
    // Limpieza del listener
    return () => {
      window.removeEventListener('carritoActualizado', handleActualizar);
    };
  }, []);

  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      const precio = Number(producto.precio);
      const descuento = Number(producto.descuento);
      const precioConDescuento = precio - (precio * descuento / 100);
      return total + producto.cantidad * precioConDescuento;
    }, 0).toFixed(2);
  };

  const calcularCantidadTotal = () => {
    return productos.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const quitarDelCarrito = (id_producto: number, origen: string) => {
    // Obtener el carrito desde el localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  
    // Encontrar el producto en el carrito
    const productoIndex = carrito.findIndex((item: any) => item.id_producto === id_producto && item.origen === origen);
  
    if (productoIndex !== -1) {
      // Reducir la cantidad del producto
      carrito[productoIndex].cantidad -= 1;
  
      // Si la cantidad llega a 0, eliminar el producto del carrito
      if (carrito[productoIndex].cantidad <= 0) {
        carrito.splice(productoIndex, 1);
      }
  
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));
  
      // 🔄 Actualizar cantidades en localStorage
      const cantidades = JSON.parse(localStorage.getItem('cantidades') || '{}');
      const key = `${origen}-${id_producto}`;
  
      if (cantidades[key]) {
        cantidades[key] -= 1;
  
        if (cantidades[key] <= 0) {
          delete cantidades[key];
        }
  
        localStorage.setItem('cantidades', JSON.stringify(cantidades));
      }
  
      // Actualizar el estado de productos para reflejar los cambios en la UI
      setProductos([...carrito]);
  
      // Calcular la cantidad total después de la eliminación
      const cantidadTotal = carrito.reduce((acc: number, item: any) => acc + item.cantidad, 0);
  
      // Crear y despachar el evento de actualización del carrito
      const evento = new CustomEvent('carritoActualizado', {
        detail: { cantidadTotal }
      });
      window.dispatchEvent(evento);
  
      // 🔁 También notificar para que otras partes reaccionen (como el dashboard)
      window.dispatchEvent(new CustomEvent('userChanged'));
    }
  };
  

  const handleIrAPago = () => {
    const sesion = sessionStorage.getItem('user');
  
    if (sesion) {
      router.push('/pago');
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para continuar con el pago.',
        confirmButtonText: 'Ir al login',
        customClass: {
          popup: 'rounded-lg p-4 text-sm',
          title: 'text-xl font-semibold text-red-600',
          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
        },
      }).then(() => {
        router.push('/dashboard/login');
      });
    }
  };
  
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Carrito de Compras</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {productos.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Tu carrito está vacío.</p>
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 mt-4 w-full"
              onClick={() => router.push('/dashboard')}
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <div>
            {productos.map((producto, index) => {
              const key = `${producto.id_producto}-${index}`;
              const precio = Number(producto.precio);
              const descuento = Number(producto.descuento);
              const precioFinalUnitario = precio - (precio * descuento / 100);
              const totalProducto = precioFinalUnitario * producto.cantidad;

              return (
                <div key={key} className="flex justify-between items-center mb-6 border-b pb-4">
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

                  <div className="flex flex-col items-end text-right">
                    {descuento > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        Bs. {precio.toFixed(2)}
                      </span>
                    )}
                    {descuento > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        Descuento: {descuento}%
                      </span>
                    )}
                    <span className="text-base font-semibold text-gray-800">
                      Bs. {precioFinalUnitario.toFixed(2)} x {producto.cantidad}
                    </span>
                    <span className="text-sm text-gray-600">
                      Total: Bs. {totalProducto.toFixed(2)}
                    </span>
                    <button
  className="mt-2 text-red-500 hover:text-red-700 font-semibold"
  onClick={() => {
    quitarDelCarrito(producto.id_producto, producto.origen);
    window.dispatchEvent(new CustomEvent('userChanged'));
  }}
>
  Quitar
</button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {productos.length > 0 && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Artículos en total:</span>
            <span className="font-semibold text-gray-800">{calcularCantidadTotal()}</span>
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-semibold text-lg text-gray-800">Total a pagar</span>
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
      )}
    </div>
  );
}

'use client';
import Link from 'next/link';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;  // Si es un string, cámbialo a number si es necesario
  descuento: number;
  foto: string;
  id_ciudad: number;
  nombre_ciudad: string;
}


const images = ['/banner1.png', '/banner2.png', '/banner3.png'];

export default function Page() {
  const [merchandising, setMerchandising] = useState<Producto[]>([]); // Tipado aquí

  const [current, setCurrent] = useState(0);
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cantidades');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('');
  const [ciudades, setCiudades] = useState<{ id_ciudad: number, nombre_ciudad: string }[]>([]);

  // Cargar productos y ciudades
  useEffect(() => {
    
    // Cargar la ciudad seleccionada desde localStorage
    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }

    

    // Obtener productos
    fetch('/api/productos/merchandising')
      .then((res) => res.json())
      .then((data: Producto[]) => {
        setMerchandising(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener Merchandising :', err);
        setCargando(false);
      });

    // Obtener ciudades disponibles
    fetch('/api/ciudades')
      .then((res) => res.json())
      .then((data) => {
        setCiudades(data);
      });

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
  }, [cantidades]);
  


  const agregarAlCarrito = (
    producto: Producto,
    origen: 'hervido' | 'jugo' | 'merchandising',
    cantidad: number = 1
  ) => {
    const carritoExistente: (Producto & { cantidad: number; origen: string; precio_final: number })[] =
      JSON.parse(localStorage.getItem('carrito') || '[]');
  
    // Calcular el precio con descuento
    const descuento = producto.descuento || 0; // Asume 0% si no se proporciona
    const precioFinal = parseFloat((producto.precio - (producto.precio * descuento / 100)).toFixed(2));
  
    const productoExistente = carritoExistente.find(
      (p) => p.id_producto === producto.id_producto && p.origen === origen
    );
  
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      productoExistente.precio_final = precioFinal; // Actualizar precio por si cambia el descuento
  
      if (productoExistente.cantidad <= 0) {
        const index = carritoExistente.indexOf(productoExistente);
        carritoExistente.splice(index, 1); // Eliminar si la cantidad es 0 o menor
      }
    } else if (cantidad > 0) {
      carritoExistente.push({
        ...producto,
        cantidad,
        origen,
        precio_final: precioFinal
      });
    }
  
    // Guardar carrito actualizado con precio_final incluido
    localStorage.setItem('carrito', JSON.stringify(carritoExistente));
  
    // Emitir evento con cantidad total de productos
    const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
      detail: {
        cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0)
      }
    });
    window.dispatchEvent(eventoCarritoActualizado);
  
    // Crear y guardar cantidades por producto
    const nuevasCantidades = carritoExistente.reduce((acc: { [key: number]: number }, p) => {
      acc[p.id_producto] = p.cantidad;
      return acc;
    }, {});
  
    localStorage.setItem('cantidades', JSON.stringify(nuevasCantidades));
  
    // Emitir evento con las cantidades actualizadas
    const eventoCantidadesActualizadas = new CustomEvent('cantidadesActualizadas', {
      detail: nuevasCantidades
    });
    window.dispatchEvent(eventoCantidadesActualizadas);
  };
  


  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white">
        <div className="w-40 h-40 mb-6">
          <img
            src="/carga.png"
            alt="Cargando jugos"
            className="w-full h-full object-contain animate-bounce"
          />
        </div>
        <p className="text-orange-600 text-2xl font-semibold animate-pulse">
          Cargando productos CIN...
        </p>
        <span className="text-lg text-gray-500 mt-4">
          Por favor espera un momento
        </span>
      </div>
    );
  }
  

  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
{/* Título de categoría */}


<div className="flex items-center justify-between mb-6 flex-wrap">
      <h2 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
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




      
{/* Título de categoría */}
 {/* FILTRO POR CIUDAD */}
    {/** Asegúrate de que `ciudadSeleccionada` esté definido antes de este bloque */}
    {(() => {
      const productosFiltrados = merchandising.filter(
        producto => producto.nombre_ciudad === ciudadSeleccionada
      );

      return (
        <div key="merchandising">
          <h3 className="text-2xl font-bold mt-8 mb-4 text-left">
            Productos de Merchandising
          </h3>

          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {cargando ? (
              <p className="text-center text-gray-500 col-span-full">Cargando productos...</p>
            ) : productosFiltrados.length === 0 ? (
              <p className="text-center text-gray-400 italic col-span-full">No hay productos disponibles</p>
            ) : (
              productosFiltrados.map(producto => {
                const precioRaw = Number(producto.precio);
                const descuentoRaw = Number(producto.descuento);
                const precioFinalNum = descuentoRaw > 0
                  ? precioRaw * (1 - descuentoRaw / 100)
                  : precioRaw;
                const precioFinal = precioFinalNum.toFixed(2);
                const precioOriginal = precioRaw.toFixed(2);
                const keyId = `merchandising-${producto.id_producto}`;
                const cantidad = cantidades[keyId] || 0;

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
                    <p className="text-lg font-semibold text-gray-800">{producto.nombre_producto}</p>

                    {descuentoRaw > 0 && (
                      <div className="mt-2 text-sm text-red-700 font-semibold bg-red-100 py-1 px-3 inline-block rounded-full">
                        {`Descuento: ${descuentoRaw}%`}
                        <span className="line-through text-gray-400 ml-1">{`Bs. ${precioOriginal}`}</span>
                      </div>
                    )}

                    <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>

                    {cantidad === 0 ? (
                      <button
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-base font-medium shadow-sm transition duration-200"
                        onClick={() => {
                          const storedCantidades = JSON.parse(localStorage.getItem('cantidades') || '{}');
                          const cantidadGuardada = storedCantidades[keyId] || 1;

                          agregarAlCarrito(producto, 'merchandising', cantidadGuardada);
                          setCantidades(prev => ({
                            ...prev,
                            [keyId]: cantidadGuardada,
                          }));
                        }}
                      >
                        Agregar
                      </button>
                    ) : (
                      <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner mx-auto max-w-[160px]">
                        <button
                          onClick={() => {
                            const nuevaCantidad = cantidad - 1;
                            agregarAlCarrito(producto, 'merchandising', -1);
                            setCantidades(prev => {
                              const updated = { ...prev };
                              if (nuevaCantidad <= 0) delete updated[keyId];
                              else updated[keyId] = nuevaCantidad;
                              return updated;
                            });
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
                        >
                          −
                        </button>
                        <span className="text-lg font-semibold text-gray-800 w-6 text-center">{cantidad}</span>
                        <button
                          onClick={() => {
                            const nuevaCantidad = cantidad + 1;
                            agregarAlCarrito(producto, 'merchandising', 1);
                            setCantidades(prev => ({
                              ...prev,
                              [keyId]: nuevaCantidad,
                            }));
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </div>
      );
    })()}
  </main>
);
}

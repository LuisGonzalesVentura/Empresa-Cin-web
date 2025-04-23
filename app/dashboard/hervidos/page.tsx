'use client';
import Link from 'next/link';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number;
  foto: string;
  id_ciudad: number;
  nombre_ciudad: string;
}

const images = ['/banner1.png', '/banner2.png', '/banner3.png'];

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [hervidos, setHervidos] = useState<Producto[]>([]);

  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('');
  const [ciudades, setCiudades] = useState<{ id_ciudad: number, nombre_ciudad: string }[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cantidades');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  // Cargar productos y ciudades
  useEffect(() => {
    
    // Cargar la ciudad seleccionada desde localStorage
    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }

    // Obtener productos de hervidos
    fetch('/api/productos/hervidos')
      .then((res) => res.json())
      .then((data: Producto[]) => {
        setHervidos(data);
      })
      .catch((err) => {
        console.error('Error al obtener hervidos:', err);
      });

    // Obtener productos de jugos
    fetch('/api/productos/jugos')
      .then((res) => res.json())
      .then((data: Producto[]) => {
        setJugos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener jugos:', err);
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

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };



  

  const agregarAlCarrito = (producto: Producto, origen: 'hervido' | 'jugo', cantidad: number = 1) => {
    const carritoExistente: (Producto & { cantidad: number; origen: string })[] = JSON.parse(localStorage.getItem('carrito') || '[]');
  
    const productoExistente = carritoExistente.find(p =>
      p.id_producto === producto.id_producto && p.origen === origen
    );
  
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      if (productoExistente.cantidad <= 0) {
        const index = carritoExistente.indexOf(productoExistente);
        carritoExistente.splice(index, 1); // Elimina si la cantidad es 0 o menor
      }
    } else if (cantidad > 0) {
      carritoExistente.push({ ...producto, cantidad, origen });
    }
  
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoExistente));
  
    // Actualizar el estado de las cantidades
    const nuevasCantidades = carritoExistente.reduce((acc: { [key: number]: number }, p) => {
      acc[p.id_producto] = p.cantidad;
      return acc;
    }, {});
  
    // Guardar las nuevas cantidades en localStorage
    localStorage.setItem('cantidades', JSON.stringify(nuevasCantidades));
  
    // Actualizar la cantidad total del carrito
    const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
      detail: { cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0) }
    });
    window.dispatchEvent(eventoCarritoActualizado);
  };

if (cargando) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      {/* Imagen animada (puedes usar un GIF o una imagen con animación Tailwind) */}
      <img
        src="/carga.png" // Cambia esto por tu imagen o GIF
        alt="Cargando jugos"
        className="w-24 h-24 animate-bounce"
      />
      <p className="mt-4 text-black-600 text-lg font-semibold animate-pulse">
        Cargando productos CIN...
      </p>
    </div>
  );
}

  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
{/* Título de categoría */}
<div className="flex items-center justify-between mb-6 flex-wrap">
      <h2 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
        Hervidos
      </h2>
      <Link href="/dashboard" passHref>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
          <FaArrowLeft /> {/* Icono de la flecha */}
          <span>Volver al inicio</span>
        </button>
      </Link>
    </div>




      
{/* Título de categoría */}

<section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
  {cantidades === null ? (
    <p className="text-center text-gray-500 col-span-full">Cargando productos...</p>
  ) : (
    hervidos
      .filter(producto => producto.nombre_ciudad === ciudadSeleccionada)
      .map(producto => {
        const precioRaw = Number(producto.precio);
        const descuentoRaw = Number(producto.descuento);
        const precioFinalNum = descuentoRaw > 0
          ? precioRaw * (1 - descuentoRaw / 100)
          : precioRaw;
        const precioFinal = precioFinalNum.toFixed(2);
        const precioOriginal = precioRaw.toFixed(2);

        const keyId = `hervido-${producto.id_producto}`;
        const cantidad = cantidades[keyId] || 0;

        return (
          <div key={keyId} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
            <img
              src={`/uploads/${producto.foto}`}
              alt={producto.nombre_producto}
              className="w-full h-auto"
            />
            <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

            {descuentoRaw > 0 && (
              <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                {`Descuento: ${descuentoRaw}%`}
                <span className="ml-2 line-through text-gray-500">{`Bs. ${precioOriginal}`}</span>
              </div>
            )}

            <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>

            {cantidad === 0 ? (
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
                onClick={() => {
                  agregarAlCarrito(producto, 'hervido', 1);
                  setCantidades(prev => ({
                    ...prev,
                    [keyId]: 1,
                  }));
                }}
              >
                Añadir al carrito
              </button>
            ) : (
<div className="mt-4 flex justify-center items-center gap--2 bg-gray-100 rounded-full px-3 py-2 shadow-inner mx-auto" style={{ maxWidth: '150px' }}>
<button
                  onClick={() => {
                    const nuevaCantidad = cantidad - 1;
                    agregarAlCarrito(producto, 'hervido', -1);
                    setCantidades(prev => {
                      const updated = { ...prev };
                      if (nuevaCantidad <= 0) delete updated[keyId];
                      else updated[keyId] = nuevaCantidad;
                      return updated;
                    });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow-sm"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-gray-800 w-6 text-center">{cantidad}</span>
                <button
                  onClick={() => {
                    const nuevaCantidad = cantidad + 1;
                    agregarAlCarrito(producto, 'hervido', 1);
                    setCantidades(prev => ({
                      ...prev,
                      [keyId]: nuevaCantidad,
                    }));
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow-sm"
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




    </main>

  );
}

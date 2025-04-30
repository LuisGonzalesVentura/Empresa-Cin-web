'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBottleWater, faGlassWhiskey, faWineBottle } from '@fortawesome/free-solid-svg-icons';

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

  // Cargar productos, ciudades y carrito desde localStorage
useEffect(() => {
  // Cargar ciudad seleccionada
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

  // Carrusel de imágenes
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



  
  
  useEffect(() => {
    // Verificar el carrito cada vez que el componente se carga
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    if (carritoGuardado.length === 0) {
      console.log("El carrito está vacío");
    } else {
      console.log("Productos en el carrito:", carritoGuardado);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
  }, [cantidades]);
  
  const agregarAlCarrito = (
    producto: Producto,
    origen: 'hervido' | 'jugo',
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
{/* Carrusel */}
<section className="w-full mb-8 overflow-hidden rounded-2xl shadow-md">
  <div className="relative w-full h-[140px] sm:h-[220px] md:h-[300px] lg:h-[400px] transition-all duration-500 group">

    {/* Imagen actual */}
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
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    {/* Botón siguiente */}
    <button
      onClick={goToNext}
      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md text-orange-600 hover:bg-orange-500 hover:text-white hover:scale-110 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
      aria-label="Siguiente"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    {/* Indicadores tipo "dots" */}
    <div className="absolute bottom-2 w-full flex justify-center gap-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrent(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            current === index ? 'bg-orange-500 scale-110' : 'bg-white/60'
          }`}
          aria-label={`Ir al banner ${index + 1}`}
        />
      ))}
    </div>
  </div>
</section>




{/* Productos destacados */}
<section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12 px-2">
  {[1, 2, 3, 4].map((_, i) => (
    <div
      key={i}
      className="border rounded-lg overflow-hidden shadow-md transition hover:shadow-xl cursor-pointer group"
    >
      <Image
        src={`/publi${i + 1}.png`}
        alt={`Producto destacado ${i + 1}`}
        width={200}
        height={400}
        className="w-full h-[160px] sm:h-[340px] md:h-[320px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="p-3 text-center">
        <Link href="/dashboard/hervidos" passHref>
          <button
            aria-label={`Ver más sobre el producto destacado ${i + 1}`}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-300"
          >
            Ver más
          </button>
        </Link>
      </div>
    </div>
  ))}
</section>





      {/* === Sección Hervidos === */}

<h2 className="text-3xl font-semibold mt-12 mb-8">Hervidos</h2>

{["330ml", "1 Litro", "2 Litros", "3 Litros"].map(volumen => {
  const productosFiltrados = hervidos
    .filter(producto =>
      producto.nombre_ciudad === ciudadSeleccionada &&
      producto.nombre_producto.toLowerCase().includes(volumen.toLowerCase())
    );

  // Selección de íconos de botella según el volumen
  let icono;
  if (volumen === "330ml") icono = faBottleWater; // Ícono de botella pequeña (para refrescos)
  else if (volumen === "1 Litro") icono = faBottleWater; // Ícono de botella mediana (para refrescos)
  else if (volumen === "2 Litros") icono = faBottleWater; // Ícono de botella mediana (para refrescos)
  else icono = faBottleWater; // Ícono de botella grande (para 3 Litros)

  return (
    <div key={volumen}>
<h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-3 text-left">
{volumen}
<FontAwesomeIcon icon={icono} className="text-3xl text-orange-500" />

      </h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {cantidades === null ? (
          <p className="text-center text-gray-500 col-span-full">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 italic col-span-full">Pronto habrá productos de esta cantidad</p>
        ) : (
          productosFiltrados.map(producto => {
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
              <div key={keyId} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
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
            
                agregarAlCarrito(producto, 'hervido', cantidadGuardada);
                
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
                        agregarAlCarrito(producto, 'hervido', -1);
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
                        agregarAlCarrito(producto, 'hervido', 1);
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
})}








 {/* Banner inferior */}
 <section className="mt-12 px-2 sm:px-4">
  <Image
    src="/cinta publicitaria 1.jpg"
    alt="Coleccionables"
    width={1400}
    height={400}
    className="rounded-lg w-full object-cover"
  />
</section>

 


  {/* === Sección Jugos === */}

<h2 className="text-3xl font-semibold mt-12 mb-8">Jugos</h2>

{["330ml", "1 Litro", "2 Litros", "3 Litros"].map(volumen => {
  const productosFiltrados = jugos
    .filter(producto =>
      producto.nombre_ciudad === ciudadSeleccionada &&
      producto.nombre_producto.toLowerCase().includes(volumen.toLowerCase())
    );

  // Selección de íconos de botella según el volumen
  let icono;
  if (volumen === "330ml") icono = faBottleWater; // Ícono de botella pequeña (para refrescos)
  else if (volumen === "1 Litro") icono = faBottleWater; // Ícono de botella mediana (para refrescos)
  else if (volumen === "2 Litros") icono = faBottleWater; // Ícono de botella mediana (para refrescos)
  else icono = faBottleWater; // Ícono de botella grande (para 3 Litros)

  return (
    <div key={volumen}>
<h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-3 text-left">
{volumen}
<FontAwesomeIcon icon={icono} className="text-3xl text-orange-500" />

      </h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {cantidades === null ? (
          <p className="text-center text-gray-500 col-span-full">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 italic col-span-full">Pronto habrá productos de esta cantidad</p>
        ) : (
          productosFiltrados.map(producto => {
            const precioRaw = Number(producto.precio);
            const descuentoRaw = Number(producto.descuento);
            const precioFinalNum = descuentoRaw > 0
              ? precioRaw * (1 - descuentoRaw / 100)
              : precioRaw;
            const precioFinal = precioFinalNum.toFixed(2);
            const precioOriginal = precioRaw.toFixed(2);
            const keyId = `jugo-${producto.id_producto}`;
            const cantidad = cantidades[keyId] || 0;

            return (
              <div key={producto.id_producto} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
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
                 
                     agregarAlCarrito(producto, 'jugo', cantidadGuardada);
                     
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
                        agregarAlCarrito(producto, 'jugo', -1);
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
                        agregarAlCarrito(producto, 'jugo', 1);
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
})}



{/* Sección de Beneficios */}
<section className="bg-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-8">CONOCE NUESTROS BENEFICIOS</h2>
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
      {/* Beneficio 1 */}
      <div className="flex flex-col items-center">
        <img src="/icono1.png" alt="Icono 1" className="w-24 h-24 mb-4" />
        <p className="font-semibold">
          Regístrate y activa tu cuenta en <br />Cin Bolivia
        </p>
      </div>
      {/* Beneficio 2 */}
      <div className="flex flex-col items-center">
        <img src="/icono2.png" alt="Icono 2" className="w-24 h-24 mb-4" />
        <p className="font-semibold">
          Revisa nuestro catálogo y <br />escoge tus productos
        </p>
      </div>
      {/* Beneficio 3 */}
      <div className="flex flex-col items-center">
        <img src="/icono3.png" alt="Icono 3" className="w-24 h-24 mb-4" />
        <p className="font-semibold">
          Recibe tu pedido en la <br />puerta de tu casa
        </p>
      </div>
    </div>
  </div>
</section>



    </main>
  );
}
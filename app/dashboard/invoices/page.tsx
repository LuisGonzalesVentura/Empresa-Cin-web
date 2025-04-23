  'use client';
  import { FaArrowLeft } from 'react-icons/fa';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faBottleWater } from '@fortawesome/free-solid-svg-icons';
  import { FaBars } from 'react-icons/fa';

  import Image from 'next/image';
  import { useEffect, useState } from 'react';
  import Link from 'next/link';

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
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Destacados"); // Siempre inicia en 'Destacados'


    const handleFilterChange = (filtro: string) => {
      setSelectedFilter(filtro);
      setMenuOpen(false); // Cierra el menú al seleccionar
    };
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
    
   ;
    
    


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

        
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          Ofertas
        </h2>

    <Link
    href="/dashboard"
    className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
  >
    <FaArrowLeft />
    <span>Volver al inicio</span>
  </Link>
      </div>

     {/* Contenedor general con comportamiento responsivo */}
<div className="relative mb-4 px-4 flex flex-col md:flex-row md:justify-between md:items-center">

{/* Íconos con nombres */}
<div className="flex justify-center md:justify-start flex-wrap gap-4">
  {[
    { src: "/jugo.png", label: "Jugos", anchor: "#jugos" },
    { src: "/jugo.png", label: "Hervidos", anchor: "#hervidos" },
    { src: "/2037713.png", label: "Merchandising", anchor: "#merchandising" },
  ].map((item, index) => (
    <div key={index} className="flex flex-col items-center">
      <a href={item.anchor}>
        <button className="rounded-full border-2 p-1 border-gray-300">
          <img src={item.src} alt={item.label} className="rounded-full w-14 h-14" />
        </button>
      </a>
      <span className="text-sm mt-1 font-bold">{item.label}</span>
    </div>
  ))}
</div>


{/* Menú hamburguesa */}
<div className="relative mt-4 md:mt-0 flex justify-end w-full md:w-auto">
  <button
    className="text-2xl text-orange-500 ml-auto"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <FaBars />
  </button>

  {/* Menú desplegable */}
  {menuOpen && (
    <div className="absolute top-10 left-0 md:left-auto md:right-0 w-full md:w-60 bg-white shadow-xl p-4 rounded-md z-20">
      <div className="space-y-4 text-left">
        <button
          onClick={() => handleFilterChange('Destacados')}
          className="text-lg text-gray-800 w-full hover:text-orange-500"
        >
          Destacados
        </button>
        <button
          onClick={() => handleFilterChange('Precio Menor a Mayor')}
          className="text-lg text-gray-800 w-full hover:text-orange-500"
        >
          Precio Menor a Mayor
        </button>
        <button
          onClick={() => handleFilterChange('Precio Mayor a Menor')}
          className="text-lg text-gray-800 w-full hover:text-orange-500"
        >
          Precio Mayor a Menor
        </button>
      </div>
    </div>
  )}

  {/* Texto del filtro actual */}
  {selectedFilter && (
    <div className="text-orange-600 font-semibold text-base mt-2 md:mt-0 ml-2">
      <span className="italic">{selectedFilter}</span>
    </div>
  )}
</div>
</div>





{/* Categoría: Hervidos */}
<h2
  id="hervidos"
  className="relative text-3xl font-semibold mt-12 mb-8 before:content-[''] before:block before:h-24 before:-mt-24"
>
  Hervidos
</h2>

{["330ml", "1 Litro", "2 Litros", "3 Litros"].map((volumen) => {
  const productosFiltrados = hervidos.filter(
    (producto) =>
      producto.nombre_ciudad === ciudadSeleccionada &&
      producto.descuento > 0 &&
      producto.nombre_producto.toLowerCase().includes(volumen.toLowerCase())
  );

  if (productosFiltrados.length === 0) return null; // 👈 evita renderizar si no hay productos

  return (
    <div key={volumen}>
      <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-2">{volumen}
      <FontAwesomeIcon icon={faBottleWater} className="text-3xl text-orange-500" />
      </h3>
      {productosFiltrados.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mb-8">
          No hay ofertas disponibles para envases de {volumen}
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {productosFiltrados.map((producto) => {
            const keyId = `hervido-${producto.id_producto}`;
            const precioRaw = Number(producto.precio);
            const precioFinal = (
              precioRaw -
              (precioRaw * producto.descuento) / 100
            ).toFixed(2);
            const cantidad = cantidades[keyId] || 0;

            return (
              <div key={keyId} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
                <img
                  src={`/uploads/${producto.foto}`}
                  alt={producto.nombre_producto}
                  className="w-full h-auto"
                />
                <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

                {producto.descuento > 0 && (
                  <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                    {`Descuento: ${producto.descuento}%`}
                    <span className="ml-2 line-through text-gray-500">{`Bs. ${precioRaw.toFixed(2)}`}</span>
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
          })}
        </section>
      )}
    </div>
  );
})}






 {/* Banner inferior */}
 <section className="mt-12">
         <Image
           src="/cinta publicitaria 1.jpg" // Cambia por tu banner inferior real
           alt="Coleccionables"
           width={1400}
           height={200}
           className="rounded-lg w-full object-cover"
         />
  </section>
 


   {/* Categoría: Jugos */}
<h2 id="jugos"  className="text-3xl font-semibold mt-12 mb-8">Jugos</h2>

{["330ml", "1 Litro", "2 Litros", "3 Litros"].map((volumen) => {
  const productosFiltrados = jugos.filter(
    (producto) =>
      producto.nombre_ciudad === ciudadSeleccionada &&
      producto.descuento > 0 &&
      producto.nombre_producto.toLowerCase().includes(volumen.toLowerCase())
  );

  if (productosFiltrados.length === 0) {
    return null; // No renderiza nada si no hay productos con ese volumen
  }

  return (
    <div key={volumen}>
      <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-2">
        {volumen}
        <FontAwesomeIcon icon={faBottleWater} className="text-3xl text-orange-500" />
      </h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {productosFiltrados.map((producto) => {
          const keyId = `jugo-${producto.id_producto}`;
          const precioRaw = Number(producto.precio);
          const precioFinal = (
            precioRaw - (precioRaw * producto.descuento) / 100
          ).toFixed(2);
          const cantidad = cantidades[keyId] || 0;

          return (
            <div key={keyId} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
              <img
                src={`/uploads/${producto.foto}`}
                alt={producto.nombre_producto}
                className="w-full h-auto"
              />
              <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

              <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                {`Descuento: ${producto.descuento}%`}
                <span className="ml-2 line-through text-gray-500">{`Bs. ${precioRaw.toFixed(2)}`}</span>
              </div>

              <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>

              {cantidad === 0 ? (
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
                  onClick={() => {
                    agregarAlCarrito(producto, 'jugo', 1);
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
                      agregarAlCarrito(producto, 'jugo', -1);
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
                      agregarAlCarrito(producto, 'jugo', 1);
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
        })}
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
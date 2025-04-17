'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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


  const agregarAlCarrito = (producto: Producto, origen: 'hervido' | 'jugo') => {
    mostrarCantidadInput('¿Cuántos productos deseas añadir?', (cantidad: number) => {
      if (isNaN(cantidad) || cantidad <= 0) {
        mostrarAlerta('Por favor, ingresa una cantidad válida.', 'error');
        return;
      }
  
      const carritoExistente: (Producto & { cantidad: number; origen: string })[] = JSON.parse(localStorage.getItem('carrito') || '[]');
  
      // Buscamos si ya existe un producto con ese id Y de ese origen
      const productoExistente = carritoExistente.find(p => 
        p.id_producto === producto.id_producto && p.origen === origen
      );
  
      if (productoExistente) {
        productoExistente.cantidad += cantidad;
      } else {
        carritoExistente.push({ ...producto, cantidad, origen });
      }
  
      localStorage.setItem('carrito', JSON.stringify(carritoExistente));
  
      const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
        detail: { cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0) }
      });
  
      window.dispatchEvent(eventoCarritoActualizado);
      mostrarAlerta('Producto añadido al carrito correctamente.', 'success');
    });
  };
  
  
// Función para mostrar alerta bonita
const mostrarAlerta = (mensaje: string, tipo: 'success' | 'error') => {
  const alerta = document.createElement('div');
  alerta.textContent = mensaje;
  Object.assign(alerta.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: tipo === 'success' ? '#4CAF50' : '#F44336',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: '9999',
    transition: 'opacity 0.5s ease-in-out',
    opacity: '1'
  });

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.style.opacity = '0';
    setTimeout(() => alerta.remove(), 500);
  }, 3000);
};

// Función para mostrar input personalizado de cantidad
const mostrarCantidadInput = (mensaje: string, callback: (cantidad: number) => void) => {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10000'
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  });

  const texto = document.createElement('p');
  texto.textContent = mensaje;
  texto.style.marginBottom = '15px';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.value = '1';
  input.style.padding = '10px';
  input.style.width = '100%';
  input.style.marginBottom = '15px';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '5px';

  const boton = document.createElement('button');
  boton.textContent = 'Añadir';
  Object.assign(boton.style, {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  });

  boton.onclick = () => {
    const cantidad = parseInt(input.value);
    modal.remove();
    callback(cantidad);
  };

  content.appendChild(texto);
  content.appendChild(input);
  content.appendChild(boton);
  modal.appendChild(content);
  document.body.appendChild(modal);
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
      {/* Carrusel */}
      <section className="w-full mb-8 overflow-hidden rounded-lg">
        <div className="relative w-full h-[360px] md:h-[400px] lg:h-[450px] transition-all duration-500">
          <Image
            key={images[current]}
            src={images[current]}
            alt={`Banner ${current + 1}`}
            fill
            className="object-cover rounded-lg"
            priority
          />

          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden shadow-md transition hover:shadow-xl">
            <Image
              src={`/publi${i + 1}.png`}
              alt={`Producto destacado ${i + 1}`}
              width={300}
              height={400}
              className="w-full h-100 object-cover"
            />
            <div className="p-4 text-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                Ver más
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Categoría: Hervidos */}
      <h2 className="text-3xl font-semibold mt-12 mb-8">Hervidos</h2>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {hervidos
          .filter((producto) => producto.nombre_ciudad === ciudadSeleccionada) // Filtrar por ciudad
          .map((producto) => {
            const precioFinal = producto.descuento > 0
              ? (producto.precio - (producto.precio * producto.descuento) / 100).toFixed(2)
              : producto.precio;

            return (
              <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
                <img
                  src={`/uploads/${producto.foto}`}
                  alt="Producto"
                  className="w-full h-auto"
                />

                <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

                {producto.descuento > 0 && (
                  <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                    {`Descuento: ${producto.descuento}%`} 
                    <span className="ml-2 line-through text-gray-500">{`Bs. ${producto.precio}`}</span>
                  </div>
                )}

                <p className="text-green-600 font-bold text-xl mt-2">
                  {`Bs. ${precioFinal}`}
                </p>

                <button
  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
  onClick={() => agregarAlCarrito(producto, 'hervido')}
>
  Añadir al carrito
</button>

              </div>
            );
          })}
      </section>



 {/* Banner inferior */}
 <section className="mt-12">
         <Image
           src="/cinta publicitaria 1.png" // Cambia por tu banner inferior real
           alt="Coleccionables"
           width={1400}
           height={200}
           className="rounded-lg w-full object-cover"
         />
       </section>
 
      {/* Categoría: Jugos */}
<h2 className="text-3xl font-semibold mt-12 mb-8">Jugos</h2>
<section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
  {jugos
    .filter((producto) => producto.nombre_ciudad === ciudadSeleccionada) // Filtrar por ciudad
    .map((producto) => {
      const precioFinal = producto.descuento > 0
        ? (producto.precio - (producto.precio * producto.descuento) / 100).toFixed(2)
        : producto.precio;

      return (
        <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
          <img
            src={`/uploads/${producto.foto}`}
            alt="Producto"
            className="w-full h-auto"
          />

          <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

          {producto.descuento > 0 && (
            <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
              {`Descuento: ${producto.descuento}%`} 
              <span className="ml-2 line-through text-gray-500">{`Bs. ${producto.precio}`}</span>
            </div>
          )}

          <p className="text-green-600 font-bold text-xl mt-2">
            {`Bs. ${precioFinal}`}
          </p>

          <button
  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
  onClick={() => agregarAlCarrito(producto, 'jugo')} // 👈 o 'jugo'
>
  Añadir al carrito
</button>

        </div>
      );
    })}
</section>


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
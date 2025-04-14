'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

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
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [ciudades, setCiudades] = useState<{ id_ciudad: number, nombre_ciudad: string }[]>([]);

  useEffect(() => {
    // Cargar la ciudad seleccionada desde localStorage
    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }
// Obtener los productos de hervidos
fetch('/api/productos/hervidos')
.then((res) => res.json())
.then((data: Producto[]) => {
  setHervidos(data);
})
.catch((err) => {
  console.error('Error al obtener hervidos:', err);
});
    // Obtener la lista de productos y ciudades
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

    // Simulación de obtener las ciudades disponibles (esto debería venir de tu API)
    fetch('/api/ciudades')  // Asegúrate de tener un endpoint que te devuelva las ciudades
      .then((res) => res.json())
      .then((data) => {
        setCiudades(data);
      });

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSeleccionCiudad = (nombreCiudad: string) => {
    setCiudadSeleccionada(nombreCiudad);
    localStorage.setItem('ciudadSeleccionada', nombreCiudad);  // Guardar la ciudad seleccionada en localStorage
    setMostrarDropdown(false);  // Cerrar el dropdown después de seleccionar la ciudad
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
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
              className="w-full h-80 object-cover"
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
    .map((producto) => (
      <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
        <Image
          src={producto.foto ? `/uploads/${producto.foto}` : '/sin-imagen.png'}
          alt={producto.nombre_producto}
          width={200}
          height={250}
          className="mx-auto"
        />
        <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>
        {producto.descuento > 0 && (
          <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
            {`Descuento: ${producto.descuento}%`}
          </div>
        )}
        <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${producto.precio}`}</p>
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg">
          Comprar
        </button>
      </div>
    ))}
</section>

      {/* Categoría: Jugos */}
      <h2 className="text-3xl font-semibold mt-12 mb-8">Jugos</h2>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {jugos
          .filter((producto) => producto.nombre_ciudad === ciudadSeleccionada) // Filtrar por ciudad
          .map((producto) => (
            <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
              <Image
                src={producto.foto ? `/uploads/${producto.foto}` : '/sin-imagen.png'}
                alt={producto.nombre_producto}
                width={200}
                height={250}
                className="mx-auto"
              />
              <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>
              {producto.descuento > 0 && (
                <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                  {`Descuento: ${producto.descuento}%`}
                </div>
              )}
              <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${producto.precio}`}</p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg">
                Comprar
              </button>
            </div>
          ))}
      </section>
    </main>
  );
}

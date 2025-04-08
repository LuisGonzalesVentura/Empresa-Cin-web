'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = ['/banner1.png', '/banner2.png', '/banner3.png']; // Añade las rutas de tus banners

export default function Page() {


    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 4000); // Cambia cada 4 segundos
      return () => clearInterval(interval);
    }, []);
// Funciones para navegación manual
const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };


  return (
    <main className="bg-white text-black font-poppins px-4 md:px-16 py-6">
      
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
         {/* Botón izquierdo */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón derecho */}
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
    <div
      key={i}
      className="border rounded-lg overflow-hidden shadow-md transition hover:shadow-xl"
    >
      <Image
        src={`/publi${i + 1}.png`}  // Rutas de las imágenes con los nombres correctos
        alt={`Producto destacado ${i + 1}`}
        width={300}
        height={400}  // Ajusté la altura a 400px
        className="w-full h-64 object-cover"  // Ajusté la clase para tener una altura más alta
      />
      <div className="p-4 text-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
          Ver más
        </button>
      </div>
    </div>
  ))}
</section>




{/* Título de categoría */}
<h2 className="text-3xl font-semibold mb-6">Hervidos</h2>

<section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
  {[
    { id: 1, name: 'Producto 1', image: '/producto1.png', price: 'Bs. 9.90', discount: '10%' },
    { id: 2, name: 'Producto 2', image: '/producto2.png', price: 'Bs. 10.90', discount: '15%' },
    { id: 3, name: 'Producto 3', image: '/producto3.png', price: 'Bs. 8.50', discount: '5%' },
    { id: 4, name: 'Producto 4', image: '/producto4.png', price: 'Bs. 12.00', discount: '20%' },
    { id: 5, name: 'Producto 5', image: '/producto5.png', price: 'Bs. 7.50', discount: '10%' },
    { id: 6, name: 'Producto 6', image: '/producto6.png', price: 'Bs. 11.20', discount: '30%' },
  ].map((producto) => (
    <div
      key={producto.id}
      className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center"
    >
      <Image
        src={producto.image}  // Ruta dinámica según el producto
        alt={producto.name}
        width={200}  // Aumenta el tamaño de la imagen
        height={250} // Aumenta el tamaño de la imagen
        className="mx-auto"
      />
      <p className="mt-4 text-lg font-medium">{producto.name}</p>
      
      {/* Barra de descuento */}
      {producto.discount && (
        <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
          {`Descuento: ${producto.discount}`}
        </div>
      )}

      <p className="text-green-600 font-bold text-xl mt-2">{producto.price}</p> {/* Aumenta el tamaño del precio */}
      <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg">
        Comprar
      </button>
    </div>
  ))}
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


      
{/* Título de categoría */}
<h2 className="text-3xl font-semibold mt-12 mb-8">Jugos</h2>  {/* Aumenta el margen superior a 12 */}

<section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
  {[
    { id: 1, name: 'Producto 1', image: '/producto1.png', price: 'Bs. 9.90', discount: '10%' },
    { id: 2, name: 'Producto 2', image: '/producto2.png', price: 'Bs. 10.90', discount: '15%' },
    { id: 3, name: 'Producto 3', image: '/producto3.png', price: 'Bs. 8.50', discount: '5%' },
    { id: 4, name: 'Producto 4', image: '/producto4.png', price: 'Bs. 12.00', discount: '20%' },
    { id: 5, name: 'Producto 5', image: '/producto5.png', price: 'Bs. 7.50', discount: '10%' },
    { id: 6, name: 'Producto 6', image: '/producto6.png', price: 'Bs. 11.20', discount: '30%' },
  ].map((producto) => (
    <div
      key={producto.id}
      className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center"
    >
      <Image
        src={producto.image}  // Ruta dinámica según el producto
        alt={producto.name}
        width={200}  // Aumenta el tamaño de la imagen
        height={250} // Aumenta el tamaño de la imagen
        className="mx-auto"
      />
      <p className="mt-4 text-lg font-medium">{producto.name}</p>
      
      {/* Barra de descuento */}
      {producto.discount && (
        <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
          {`Descuento: ${producto.discount}`}
        </div>
      )}

      <p className="text-green-600 font-bold text-xl mt-2">{producto.price}</p> {/* Aumenta el tamaño del precio */}
      <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg">
        Comprar
      </button>
    </div>
  ))}
</section>



    </main>

  );
}

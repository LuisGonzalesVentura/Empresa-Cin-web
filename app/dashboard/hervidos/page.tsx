'use client';
import Link from 'next/link'; // Importa Link de Next.js
import { FaArrowLeft } from "react-icons/fa"; // Importa el icono de la flecha hacia la izquierda


import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = ['/banner1.png', '/banner2.png', '/banner3.png']; // Añade las rutas de tus banners

export default function hervidos() {



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

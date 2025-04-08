'use client';  // Agrega esta línea al principio del archivo



import { FaSearch, FaMapMarkerAlt, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';  // Importa Link
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-orange-500 px-6 py-2">
      <div className="flex justify-between items-center">
        {/* Logo con imagen desde /public */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              src="/logo_cin.png"
              alt="Logo CIN"
              width={40}
              height={40}
              className="w-auto h-20"
            />
          </Link> {/* Enlaza a la página de Ofertas */}
        </div>

        {/* Iconos de ubicación y usuario, carrito */}
        <div className="flex items-center space-x-4 text-white">
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt />
            <span className="text-sm">Cochabamba</span>
          </div>
          <FaUser className="text-lg cursor-pointer" />
          <FaShoppingCart className="text-lg cursor-pointer" />
        </div>

        {/* Menú hamburguesa para móviles */}
        <div className="block lg:hidden">
          <FaBars className="text-white text-2xl cursor-pointer" onClick={toggleMenu} />
        </div>
      </div>

      {/* Menú de navegación */}
      <div className={`lg:flex mt-2 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Menú a la izquierda */}
        <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 text-white font-medium text-lg">
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href="/dashboard/invoices">Ofertas</Link>
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href="/dashboard/customers">Promociones</Link>
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href="/dashboard/jugos">Jugos</Link>
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href="/dashboard/hervidos">Hervidos</Link>
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href="/dashboard/contactanos">Contáctanos</Link>
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    ¿Quienes somos?
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    Añadir
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    Modificar
  </li>
  <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105">
    Pedidos
  </li>
</ul>


        {/* Barra de búsqueda alineada a la derecha */}
        <div className="relative w-full max-w-xs ml-auto mt-4 lg:mt-0">
          <input
            type="text"
            placeholder="Busca algún producto"
            className="w-full px-4 py-2 rounded-full shadow-md text-gray-700"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>
    </nav>
  );
}

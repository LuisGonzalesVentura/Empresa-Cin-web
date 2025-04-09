'use client';

import { FaSearch, FaMapMarkerAlt, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// ✅ INTERFAZ para tipar correctamente las ciudades
interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(''); // Se inicializa vacío
  const [mostrarAlerta, setMostrarAlerta] = useState(true); // Estado para mostrar alerta al cargar

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    fetch('/api/ciudades')
      .then(res => res.json())
      .then(data => setCiudades(data))
      .catch(err => console.error('Error al obtener ciudades:', err));
  }, [ciudadSeleccionada]);

  // ✅ Tipado explícito del parámetro
  const handleSeleccionCiudad = (nombre: string) => {
    setCiudadSeleccionada(nombre);
    setMostrarDropdown(false);
    setMostrarAlerta(false); // Se oculta la alerta cuando se selecciona una ciudad
  };

  return (
    <nav className="bg-orange-500 px-6 py-2 relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              src="/logo_cin.png"
              alt="Logo CIN"
              width={40}
              height={40}
              className="w-auto h-20"
            />
          </Link>
        </div>

        {/* Iconos de ubicación y usuario, carrito */}
        <div className="flex items-center space-x-4 text-white relative">
          {/* Ciudad y dropdown */}
          <div className="flex flex-col relative">
            <div 
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setMostrarDropdown(!mostrarDropdown)}
            >
              <FaMapMarkerAlt />
              <span className="text-sm">{ciudadSeleccionada || 'Selecciona tu ubicación'}</span>
            </div>

            {mostrarDropdown && (
              <div className="absolute top-7 left-0 mt-1 bg-white text-black rounded-md shadow-lg w-40 z-50">
                {ciudades.map((ciudad) => (
                  <div
                    key={ciudad.id_ciudad}
                    onClick={() => handleSeleccionCiudad(ciudad.nombre_ciudad)}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {ciudad.nombre_ciudad}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FaUser className="text-lg cursor-pointer" />
          <FaShoppingCart className="text-lg cursor-pointer" />
        </div>

       {/* Modal de alerta si no se ha seleccionado la ciudad */}
{mostrarAlerta && ciudadSeleccionada === '' && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
      <h2 className="text-lg font-semibold mb-4">Selecciona tu ubicación</h2>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        onChange={(e) => handleSeleccionCiudad(e.target.value)}
        value={ciudadSeleccionada} // Bind value to ensure it updates correctly
      >
        <option value="" disabled>-- Elige tu ciudad --</option>
        {ciudades.map((ciudad) => (
          <option key={ciudad.id_ciudad} value={ciudad.nombre_ciudad}>
            {ciudad.nombre_ciudad}
          </option>
        ))}
      </select>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={() => {
          if (ciudadSeleccionada !== '') {
            // Save logic goes here, such as calling a save function
            setMostrarAlerta(false); // Close the alert after saving
          }
        }}
        disabled={ciudadSeleccionada === ''} // Disable the button if no city is selected
      >
        Guardar
      </button>
    </div>
  </div>
)}


        {/* Menú hamburguesa para móviles */}
        <div className="block lg:hidden">
          <FaBars className="text-white text-2xl cursor-pointer" onClick={toggleMenu} />
        </div>
      </div>

      {/* Menú de navegación */}
      <div className={`lg:flex mt-2 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Enlaces de navegación */}
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

        {/* Barra de búsqueda */}
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

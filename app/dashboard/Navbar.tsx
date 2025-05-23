"use client";
import { usePathname } from "next/navigation";
import { useNavbarLogic } from "@/lib/navbar/logica_navbar";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaShoppingCart,
  FaBars,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const {
    ciudades,
    ciudadSeleccionada,
    mostrarAlerta,
    setMostrarAlerta,
    cantidadTotal,
    userName,
    isClient,
    handleSeleccionCiudad,
    handleCarritoClick,
    handleUserClick,
  } = useNavbarLogic();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  if (!isClient) return null;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-orange-500 px-6 py-2 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              src="/logo_cinn.png"
              alt="Logo CIN"
              width={50}
              height={50}
              className="w-auto h-20"
            />
          </Link>
        </div>

        {/* Iconos: ubicación, usuario, carrito */}
        <div className="flex items-center space-x-4 text-white relative max-w-[70%] sm:max-w-full">
          {/* Ubicación */}
          <div className="flex flex-col relative max-w-[120px] sm:max-w-none">
            <div
              className="flex items-center space-x-1 cursor-pointer truncate"
              onClick={() => setMostrarAlerta(true)}
            >
              <FaMapMarkerAlt />
              <span className="text-sm truncate">
                {ciudadSeleccionada || "Selecciona tu ubicación"}
              </span>
            </div>
          </div>

          {/* Usuario */}
          <div className="flex items-center space-x-2 max-w-[100px] sm:max-w-none overflow-hidden">
            <FaUser
              className="text-lg cursor-pointer"
              onClick={handleUserClick}
            />
            {userName && (
              <span className="text-sm font-semibold text-white truncate block">
                {userName.split(" ")[0]}
              </span>
            )}
          </div>

          {/* Carrito */}
          <button
            onClick={handleCarritoClick}
            className="relative bg-transparent border-none cursor-pointer p-2 rounded-md transition-transform hover:scale-110"
          >
            <FaShoppingCart className="text-2xl text-white" />
            {cantidadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-white shadow-md shadow-black/30 min-w-[18px] text-center">
                {cantidadTotal}
              </span>
            )}
          </button>
        </div>

        {/* Menú hamburguesa */}
        <div className="block lg:hidden">
          <FaBars
            className="text-white text-2xl cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Menú de navegación */}
      <div
        className={`lg:flex mt-2 transition-all duration-300 ease-in-out ${isMenuOpen ? "block max-h-[1000px]" : "hidden max-h-0"} lg:max-h-none lg:opacity-100`}
        style={{ overflow: "hidden" }}
      >
        {/* Enlaces de navegación */}
        <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 text-white font-medium text-lg">
          {[
            { href: "/dashboard/ofertas", label: "Ofertas" },
            { href: "/dashboard/promocionesss", label: "Promociones" },
            { href: "/dashboard/jugos", label: "Jugos" },
            { href: "/dashboard/hervidos", label: "Hervidos" },
            { href: "/dashboard/contactanos", label: "Contáctanos" },
            { href: "/dashboard/quienes_somos", label: "Quienes Somos" },
            { href: "/dashboard/Merchandising", label: "Merchandising" },
          ].map(({ href, label }) => (
            <li
              key={href}
              onClick={closeMenu}
              className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                pathname === href
                  ? "text-yellow-400 font-bold"
                  : "hover:text-yellow-500"
              }`}
            >
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Barra de búsqueda mejorada UX/UI con expansión al enfocar */}
        <form
          action="/dashboard/filtrado_busqueda"
          method="GET"
          className="relative w-full max-w-sm ml-auto mr-6 mt-4 lg:mt-0 transition-all duration-300"
        >
          <div className="flex items-center relative group">
            {/* Input */}
            <input
              type="text"
              name="query"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-11 pr-28 py-2.5 rounded-full text-sm shadow-md bg-white text-gray-700 
                border border-orange-400 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                transition-all duration-500 focus:shadow-lg focus:scale-[1.03]
                w-full sm:w-[calc(100%+20px)] focus:w-[calc(100%+40px)]"
            />

            {/* Icono de búsqueda */}
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 group-focus-within:text-orange-600 transition-colors duration-300" />

            {/* Botón */}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white 
                 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 z-10"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de alerta si no se ha seleccionado la ciudad */}
      {mostrarAlerta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in px-4 sm:px-0">
          <div className="relative bg-white rounded-2xl p-5 sm:p-8 shadow-xl w-full max-w-md text-center space-y-4 sm:space-y-6">
            {/* Botón de cerrar (X) */}
            <button
              onClick={() => setMostrarAlerta(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 transition duration-200"
              aria-label="Cerrar modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Icono de alerta */}
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.702-1.14 1.132-2.052L13.132 4.948c-.526-.905-1.738-.905-2.264 0L4.95 16.948c-.57.912.078 2.052 1.132 2.052z"
                />
              </svg>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              ¡Selecciona tu ubicación!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Para continuar, por favor selecciona tu ciudad de la lista.
            </p>

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              onChange={(e) => {
                localStorage.removeItem("carrito");
                localStorage.removeItem("cantidades");

                handleSeleccionCiudad(e.target.value);
                setMostrarAlerta(false);
                window.location.reload();
              }}
              value={ciudadSeleccionada}
            >
              <option value="" disabled>
                -- Elige tu ciudad --
              </option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.nombre_ciudad}>
                  {ciudad.nombre_ciudad}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </nav>
  );
}

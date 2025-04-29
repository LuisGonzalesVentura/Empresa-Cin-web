'use client';
import { useRouter } from 'next/navigation'; // Importa el hook useRouter de Next.js
import { FaSearch, FaMapMarkerAlt, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
  
}
interface ProductoCarrito {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  foto: string;
}

export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [cantidadTotal, setCantidadTotal] = useState(0); // Estado del carrito
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cantidades');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

// Función para alternar el estado del menú
const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
};

// Función para cerrar el menú al hacer clic en un enlace
const closeMenu = () => {
  setIsMenuOpen(false);
};

  useEffect(() => {
    const guardado = localStorage.getItem('cantidades');
    if (guardado) {
      setCantidades(JSON.parse(guardado));
    }
    

setIsClient(true); // Esto asegura que el siguiente código solo se ejecuta en el cliente
const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
if (ciudadGuardada) {
  setCiudadSeleccionada(ciudadGuardada);
}

fetch("/api/ciudades")
  .then((res) => res.json())
  .then((data) => setCiudades(data))
  .catch((err) => console.error("Error al obtener ciudades:", err));

  const carritoLocal = localStorage.getItem('carrito');
  if (carritoLocal) {
    try {
      const carrito: ProductoCarrito[] = JSON.parse(carritoLocal);
      const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      setCantidadTotal(total);
    } catch (error) {
      console.error("Error al leer el carrito:", error);
    }
  }
 // 🔄 Evento de actualización del carrito desde otras partes de la app
 const handleCarritoActualizado = (e: any) => {
  const cantidadTotal = e.detail.cantidadTotal;
  setCantidadTotal(cantidadTotal);
};
window.addEventListener('carritoActualizado', handleCarritoActualizado);

// 🧠 Evento de cambio en el localStorage (en caso de que otra pestaña lo modifique)
const handleStorageChange = () => {
  const carritoActualizado = localStorage.getItem('carrito');
  if (carritoActualizado) {
    try {
      const carrito: ProductoCarrito[] = JSON.parse(carritoActualizado);
      const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      setCantidadTotal(total);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
    }
  } else {
    setCantidadTotal(0);
  }
};
window.addEventListener('storage', handleStorageChange);

//  Cleanup
return () => {
  window.removeEventListener('storage', handleStorageChange);
  window.removeEventListener('carritoActualizado', handleCarritoActualizado);
};

}, []);

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
  }
}, [cantidades]);

  const handleSeleccionCiudad = (nombre: string) => {

    setCiudadSeleccionada(nombre);
    setMostrarDropdown(false);
    setMostrarAlerta(false); // Se oculta la alerta cuando se selecciona una ciudad
    setCiudadSeleccionada(nombre); // Cambia el estado local
    localStorage.setItem('ciudadSeleccionada', nombre); // Guarda en el localStorage
  };
  const handleCarritoClick = () => {
    // Redirige a /carrito/detalle cuando el ícono de carrito es clickeado
    router.push('/dashboard/carrito');
  };


  
  useEffect(() => {
    const cargarUsuario = () => {
      const userSession = sessionStorage.getItem('user'); // 👈 usamos sessionStorage
      if (userSession) {
        const user = JSON.parse(userSession);
        setUserName(user.nombre);
      } else {
        setUserName(null);
      }
    };

    cargarUsuario(); // Al montar el componente

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        cargarUsuario();
      }
    };

    const handleUserChanged = () => {
      cargarUsuario();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChanged', handleUserChanged);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        cargarUsuario();
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChanged);
      document.removeEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          cargarUsuario();
        }
      });
    };
  }, []);

  const handleUserClick = () => {
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
      router.push('/dashboard/login/dashboard_login');
    } else {
      router.push('/dashboard/login');
    }
  };

  
    

    // No renderizamos contenido específico hasta que estemos en el cliente
    if (!isClient) {
      return null; // Devolvemos null para evitar el desajuste durante la hidratación
    }

    return (
  <nav className="bg-orange-500 px-6 py-2 fixed top-0 left-0 w-full z-50">
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

        {/* Iconos de ubicación, usuario y carrito */}
  <div className="flex items-center space-x-4 text-white relative">

  {/* Ciudad y botón para seleccionar ubicación */}
  <div className="flex flex-col relative">
    <div 
      className="flex items-center space-x-1 cursor-pointer"
      onClick={() => setMostrarAlerta(true)} // Muestra el selector de ciudad
    >
      <FaMapMarkerAlt />
      <span className="text-sm">
        {ciudadSeleccionada || 'Selecciona tu ubicación'}
      </span>
    </div>
  </div>

            {/* Usuario */}
            <div className="flex items-center space-x-2">
            <FaUser className="text-lg cursor-pointer" onClick={handleUserClick} />
            {userName && (
              <span className="text-sm font-semibold text-white">
                {userName}
              </span>
            )}
          </div>



  {/* Icono de carrito */}
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


    {/* Menú hamburguesa para móviles */}
    <div className="block lg:hidden">
          <FaBars className="text-white text-2xl cursor-pointer" onClick={toggleMenu} />
        </div>
      </div>
      
{/* Menú de navegación */}
<div
  className={`lg:flex mt-2 transition-all duration-300 ease-in-out ${isMenuOpen ? 'block max-h-[1000px]' : 'hidden max-h-0'} lg:max-h-none lg:opacity-100`}
  style={{ overflow: 'hidden' }}
>
  {/* Enlaces de navegación */}
  <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 text-white font-medium text-lg">
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard">Inicio</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/invoices">Ofertas</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/promocionesss">Promociones</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/jugos">Jugos</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/hervidos">Hervidos</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/contactanos">Contáctanos</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/quienes_somos">Quienes Somos</Link>
    </li>
    <li className="hover:text-yellow-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" onClick={closeMenu}>
      <Link href="/dashboard/Merchandising">Merchandising</Link>
    </li>
  </ul>


   {/* Barra de búsqueda */}
   <form 
  action={`/dashboard/filtrado_busqueda`} 
  method="GET" 
  className="relative w-full max-w-xs ml-auto mt-4 lg:mt-0"
>
  <input
    type="text"
    name="query" // ¡Importante para que el valor se pase por la URL!
    placeholder="Busca algún producto"
    className="w-full px-4 py-2 rounded-full shadow-md text-gray-700"
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
  <button type="submit">
    <FaSearch className="absolute right-3 top-3 text-gray-400" />
  </button>
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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Icono de alerta */}
      <div className="flex justify-center">
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.702-1.14 1.132-2.052L13.132 4.948c-.526-.905-1.738-.905-2.264 0L4.95 16.948c-.57.912.078 2.052 1.132 2.052z" />
        </svg>
      </div>

      <h2 className="text-lg sm:text-2xl font-bold text-gray-800">¡Selecciona tu ubicación!</h2>
      <p className="text-gray-600 text-sm sm:text-base">
        Para continuar, por favor selecciona tu ciudad de la lista.
      </p>

      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
        onChange={(e) => {
          localStorage.removeItem('carrito');
          handleSeleccionCiudad(e.target.value);
          setMostrarAlerta(false);
          window.location.reload();
        }}
        value={ciudadSeleccionada}
      >
        <option value="" disabled>-- Elige tu ciudad --</option>
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

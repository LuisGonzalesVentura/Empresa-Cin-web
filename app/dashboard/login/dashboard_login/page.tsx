'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Head from 'next/head';
import { FaUserCircle } from 'react-icons/fa';
import { User as UserIcon, Lock, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

// Tipo de datos del usuario
interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombre_factura: string;
  ci_nit: string;
  correo: string;
  fecha_nacimiento: string;
  telefono: string;
  tipo_usuario: string;
  fecha_creacion: string;
}

export default function DashboardUsuario() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('perfil');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async () => {
    const response = await fetch('/api/login');
    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido a tu cuenta.',
      }).then(() => {
        router.push('/dashboard/login/dashboard_login');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al iniciar sesión.',
      });
    }
  };

  const InputField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="bg-white border border-orange-300 text-gray-800 rounded-md px-4 py-2 shadow-sm focus:outline-none cursor-default"
      />
    </div>
  );

  const renderContent = () => {
    if (!user) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Debes iniciar sesión</h2>
          <p className="mb-4">No has iniciado sesión. Por favor, ingresa con tu cuenta.</p>
          <button
            onClick={handleLogin}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-200"
            aria-label="Iniciar sesión"
          >
            Iniciar Sesión
          </button>
        </div>
      );
    }

    switch (selectedOption) {
      
      case 'perfil':
        return (
          <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-10">
              <FaUserCircle className="text-orange-500 text-5xl mr-3" />
              <h2 className="text-4xl font-extrabold text-gray-700">Mi Perfil</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <InputField label="Nombre" value={user.nombre} />
              <InputField label="Apellido" value={user.apellido} />
              <InputField label="Nombre Factura" value={user.nombre_factura} />
              <InputField label="CI/NIT" value={user.ci_nit} />
              <InputField label="Correo" value={user.correo} />
              <InputField label="Fecha de Nacimiento" value={user.fecha_nacimiento} />
              <InputField label="Teléfono" value={user.telefono} />
              <InputField label="Tipo de Usuario" value={user.tipo_usuario} />
              <InputField label="Fecha de Creación" value={user.fecha_creacion} />
            </div>
          </div>
        );
        case 'cambiar-contrasena':
          return (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Cambiar Contraseña</h2>
              <p className="mb-6">Puedes actualizar tu contraseña aquí.</p>
        
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
                  const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                  const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
        
                  // Validar que las contraseñas coincidan
                  if (newPassword !== confirmPassword) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Las contraseñas no coinciden.',
                      customClass: {
                        popup: 'rounded-lg p-4 text-sm',
                        title: 'text-xl font-semibold text-green-600',
                        confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                      },
                    });
                    return;
                  }
        
                  const storedUser = sessionStorage.getItem('user');
                  const userData = storedUser ? JSON.parse(storedUser) : null;
                  const correo = userData?.correo;
        
                  if (!correo) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'No se pudo obtener el correo del usuario.',
                      customClass: {
                        popup: 'rounded-lg p-4 text-sm',
                        title: 'text-xl font-semibold text-green-600',
                        confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                      },
                    });
                    return;
                  }
        
                  try {
                    const response = await fetch('/api/cambiar-contrasena', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        correo,
                        contrasena_actual: currentPassword,  // Cambié el nombre para coincidir con el backend
                        nueva_contrasena: newPassword,  // Cambié el nombre para coincidir con el backend
                        confirmar_nueva_contrasena: confirmPassword,  // Cambié el nombre para coincidir con el backend
                      }),
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Contraseña cambiada con éxito',
                        text: data.message || 'Tu contraseña ha sido actualizada.',
                        customClass: {
                          popup: 'rounded-lg p-4 text-sm',
                          title: 'text-xl font-semibold text-green-600',
                          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                        },
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'No se pudo cambiar la contraseña.',
                        customClass: {
                          popup: 'rounded-lg p-4 text-sm',
                          title: 'text-xl font-semibold text-green-600',
                          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                        },
                      });
                    }
                  } catch (error) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error de red',
                      text: 'No se pudo conectar al servidor.',
                      customClass: {
                        popup: 'rounded-lg p-4 text-sm',
                        title: 'text-xl font-semibold text-green-600',
                        confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                      },
                    });
                  }
                }}
              >
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    className="bg-white border border-orange-300 text-gray-800 rounded-md px-4 py-2 w-full shadow-sm focus:outline-none"
                  />
                </div>
        
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    className="bg-white border border-orange-300 text-gray-800 rounded-md px-4 py-2 w-full shadow-sm focus:outline-none"
                  />
                </div>
        
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="bg-white border border-orange-300 text-gray-800 rounded-md px-4 py-2 w-full shadow-sm focus:outline-none"
                  />
                </div>
        
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-200"
                >
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          );
        
      case 'mis-pedidos':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Mis Pedidos</h2>
            <p>Lista de tus pedidos recientes.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const menuItems = [
    { label: 'Mi Perfil', value: 'perfil', icon: <UserIcon size={18} className="mr-2" /> },
    { label: 'Cambiar Contraseña', value: 'cambiar-contrasena', icon: <Lock size={18} className="mr-2" /> },
    { label: 'Mis Pedidos', value: 'mis-pedidos', icon: <Package size={18} className="mr-2" /> },
  ];

  return (
    <>
       
      <Head>
        <title>Dashboard Usuario | Mi Perfil</title>
      </Head>

      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br to-white">
        {/* Sidebar Izquierdo */}
        <aside className="w-full md:w-72 bg-gradient-to-br from-white to-white shadow-2xl rounded-3xl p-6 md:mt-8 md:ml-4 transition-all">
          <div className="flex flex-col items-center mt-6 mb-10">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
              {user ? user.nombre[0] : 'U'}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-700 text-center">
              {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">{user?.correo}</p>
          </div>

          <nav className="flex flex-col gap-4 mt-6">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedOption(item.value)}
                className={`flex items-center ${
                  selectedOption === item.value ? 'bg-orange-600' : 'bg-orange-500'
                } hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105`}
                aria-label={`Ir a ${item.label}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                Swal.fire({
                  title: '¿Cerrar sesión?',
                  text: '¿Seguro que quieres salir?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, salir',
                  cancelButtonText: 'Cancelar',
                  customClass: {
                    popup: 'rounded-xl p-6 text-sm',
                    title: 'text-xl font-semibold text-red-600',
                    confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    sessionStorage.removeItem('user');
                    window.dispatchEvent(new CustomEvent('userChanged'));
                    router.push('/dashboard/login');
                  }
                });
              }}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} className="mr-2" />
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Panel Derecho */}
        <main className="flex-1 p-4 sm:p-6 md:p-10">
  <div className="bg-gradient-to-br from-white to-white rounded-3xl shadow-2xl p-10">
    
    {/* Botón volver al inicio alineado a la derecha */}
    <div className="flex justify-end mb-6">
      <Link
        href="/dashboard"
        className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
        >
        <FaArrowLeft  />
        <span>Volver al inicio</span>
      </Link>
    </div>

    {renderContent()}
  </div>
</main>

      </div>
    </>
  );
}

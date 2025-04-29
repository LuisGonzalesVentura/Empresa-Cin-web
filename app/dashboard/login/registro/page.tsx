'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ci_nit, setCiNit] = useState("");
  const [nombreFactura, setNombreFactura] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        customClass: {
          popup: 'rounded-lg p-4 text-sm',
          title: 'text-xl font-semibold text-orange-600',
          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
        },
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const userData = {
      nombre,
      apellido,
      correo: email,
      contrasena: password,
      telefono,
      ci_nit,
      nombre_factura: nombreFactura,
      fecha_nacimiento: fechaNacimiento,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'El usuario se ha registrado correctamente.',
          customClass: {
            popup: 'rounded-lg p-4 text-sm',
            title: 'text-xl font-semibold text-green-600',
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
          },
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Error al registrar el usuario',
          customClass: {
            popup: 'rounded-lg p-4 text-sm',
            title: 'text-xl font-semibold text-orange-600',
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
          },
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error, por favor intente nuevamente',
        customClass: {
          popup: 'rounded-lg p-4 text-sm',
          title: 'text-xl font-semibold text-orange-600',
          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
        },
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-4">
      
      {/* Contenedor del formulario */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto"style={{ marginTop: '30px' }}>
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Registrarse
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">Nombre</label>
              <input type="text" id="nombre" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700">Apellido</label>
              <input type="text" id="apellido" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
              <input type="email" id="email" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <input type="password" id="password" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

           

            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">Teléfono</label>
              <input type="text" id="telefono" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Confirma tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="ci_nit" className="block text-sm font-semibold text-gray-700">CI o NIT</label>
              <input type="text" id="ci_nit" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Introduce tu CI o NIT" value={ci_nit} onChange={(e) => setCiNit(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="nombreFactura" className="block text-sm font-semibold text-gray-700">Nombre para la factura</label>
              <input type="text" id="nombreFactura" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Nombre para la factura" value={nombreFactura} onChange={(e) => setNombreFactura(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-semibold text-gray-700">Fecha de nacimiento</label>
              <input type="date" id="fechaNacimiento" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
            </div>
          </div>

          {/* Botón y enlace inferior */}
          <div className="mt-8">
            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition duration-300">
              Registrarse
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a href="/dashboard/login" className="text-orange-500 hover:underline">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>

   
    </div>
  );
}

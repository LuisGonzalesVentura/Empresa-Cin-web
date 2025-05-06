'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo y contraseña son requeridos.',
      });
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent('userChanged'));

        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido a tu cuenta.',
          customClass: {
            popup: 'rounded-lg p-4 text-sm',
            title: 'text-xl font-semibold text-green-600',
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
          },
        }).then(() => {
          if (isClient) {
            router.push('/dashboard/login/dashboard_login');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Correo o contraseña incorrectos.',
          customClass: {
            popup: 'rounded-lg p-4 text-sm',
            title: 'text-xl font-semibold text-red-600',
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
          },
        });
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema con la solicitud. Intenta de nuevo más tarde.',
        customClass: {
          popup: 'rounded-lg p-4 text-sm',
          title: 'text-xl font-semibold text-green-600',
          confirmButton: 'bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md',
        },
      });
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 px-4" style={{ marginTop: '-60px' }}>
<div className="bg-white p-10 rounded-xl shadow-xl w-full sm:max-w-md animate-fade-in" >

        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none transition duration-150"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none transition duration-150"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
            
          </div>

          <div className="flex justify-between text-sm text-gray-600">
  <label className="flex items-center gap-2">
    <input type="checkbox" className="accent-orange-500" />
    Recordarme
  </label>
  <a 
    href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=luis.florencio.gonzales.ventura@gmail.com&su=Recuperación%20de%20Contraseña&body=Hola,%0A%0AHe%20olvidado%20mi%20contraseña.%20Mis%20datos%20son:%0A%0ACorreo:%20%5BCorreo%5D%0ANúmero:%20%5BNúmero%5D%0ACarnet:%20%5BCarnet%5D%0AFecha%20de%20Nacimiento:%20%5BFecha%5D%0A%0ASaludos"
    className="text-orange-500 hover:underline"
  >
    ¿Olvidaste tu contraseña?
  </a>
</div>


          <button
            type="submit"
            onClick={() => window.dispatchEvent(new CustomEvent('userChanged'))}
            className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-md transition duration-300"
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta? <a href="/dashboard/login/registro" className="text-orange-500 hover:underline">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  );
}

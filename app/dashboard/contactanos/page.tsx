import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";

export default function Contactanos() {
  return (


    
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      
{/* Título de categoría */}
<div className="w-full flex justify-end -mt-2 mr-24">
  <Link href="/dashboard" passHref>
  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
  <FaArrowLeft /> {/* Icono de la flecha */}
      <span>Volver al inicio</span>
    </button>
  </Link>
</div>



      {/* Formulario de contacto */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Contáctanos</h1>
        <p className="text-gray-700 mb-6">
          ¿Tienes preguntas, sugerencias o deseas más información? Completa el siguiente formulario y nos pondremos en contacto contigo.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-left text-gray-700 font-semibold">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu nombre"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-left text-gray-700 font-semibold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              placeholder="tuemail@ejemplo.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label htmlFor="mensaje" className="block text-left text-gray-700 font-semibold">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              placeholder="Escribe tu mensaje aquí..."
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  );
}

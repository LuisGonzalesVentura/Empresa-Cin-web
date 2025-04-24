'use client';
import { FaFacebookF, FaWhatsapp, FaTiktok, FaYoutube } from "react-icons/fa";
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';
import { useEffect } from 'react';

export default function Contactanos() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [numeroReferencia, setNumeroReferencia] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCargando(false);
    }, 1000); // 2 segundos de "carga"
  
    return () => clearTimeout(timeout);
  }, []);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const asunto = encodeURIComponent(`Mensaje de ${nombre}`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\nNúmero de Referencia: ${numeroReferencia}\n\nMensaje:\n${mensaje}`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@industriascin.com&su=${asunto}&body=${cuerpo}`;

    window.open(gmailUrl, '_blank'); // Se abre en una nueva pestaña
  };
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white">
        <div className="w-40 h-40 mb-6">
          <img
            src="/carga.png"
            alt="Cargando jugos"
            className="w-full h-full object-contain animate-bounce"
          />
        </div>
        <p className="text-orange-600 text-2xl font-semibold animate-pulse">
          Cargando productos CIN...
        </p>
        <span className="text-lg text-gray-500 mt-4">
          Por favor espera un momento
        </span>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      
      {/* Botón Volver */}
      <div className="w-full flex justify-end -mt-2 mr-24">
        
    <Link
    href="/dashboard"
    className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
  >
    <FaArrowLeft />
    <span>Volver al inicio</span>
  </Link>
      </div>

      {/* Formulario */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Contáctanos</h1>
        <p className="text-gray-700 mb-6">
          ¿Tienes preguntas, sugerencias o deseas más información? Completa el siguiente formulario y nos pondremos en contacto contigo.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className="block text-left text-gray-700 font-semibold">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
          <label htmlFor="numeroReferencia" className="block text-left text-gray-700 font-semibold">
           Número de Referencia 591+
          </label>
          <input
           type="tel"
           id="numeroReferencia"
           value={numeroReferencia}
           onChange={(e) => setNumeroReferencia(e.target.value)}
           placeholder="Ej: 70700290"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
           required
           />
          </div>
          <div>
            <label htmlFor="correo" className="block text-left text-gray-700 font-semibold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label htmlFor="mensaje" className="block text-left text-gray-700 font-semibold">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Enviar mensaje
          </button>
        </form>
          {/* otras formas de contactar */}
          <div className="flex flex-col items-center justify-center mt-8">
  <div className="flex space-x-6 text-2xl text-orange-500">
    <a href="https://www.facebook.com/industriascin.bo/?locale=es_LA" target="_blank" rel="noopener noreferrer">
      <FaFacebookF className="cursor-pointer hover:text-black transition duration-200" />
    </a>
    <a href="https://wa.me/59170700290" target="_blank" rel="noopener noreferrer">
      <FaWhatsapp className="cursor-pointer hover:text-black transition duration-200" />
    </a>
    <a href="https://www.tiktok.com/@industriascin" target="_blank" rel="noopener noreferrer">
      <FaTiktok className="cursor-pointer hover:text-black transition duration-200" />
    </a>
  </div>
</div>

              
      </div>
    </div>
  );
}

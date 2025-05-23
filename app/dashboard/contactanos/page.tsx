"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaFacebookF, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { useContactoForm } from "@/lib/contacto/useContactoForm";

export default function ContactoPage() {
  const { formData, handleChange, handleSubmit, cargando } = useContactoForm();

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full flex justify-end -mt-2 mr-24">
        <Link
          href="/dashboard"
          className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
        >
          <FaArrowLeft />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Contáctanos</h1>
        <p className="text-gray-700 mb-6">
          ¿Tienes preguntas, sugerencias o deseas más información? Completa el
          formulario y nos pondremos en contacto contigo.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["nombre", "numeroReferencia", "correo"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-left text-gray-700 font-semibold"
              >
                {field === "numeroReferencia"
                  ? "Número de Referencia 591+"
                  : field === "correo"
                    ? "Correo Electrónico"
                    : "Nombre"}
              </label>
              <input
                type={
                  field === "correo"
                    ? "email"
                    : field === "numeroReferencia"
                      ? "tel"
                      : "text"
                }
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder={
                  field === "correo"
                    ? "tuemail@ejemplo.com"
                    : field === "numeroReferencia"
                      ? "Ej: 70700290"
                      : "Tu nombre"
                }
                required
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="mensaje"
              className="block text-left text-gray-700 font-semibold"
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Escribe tu mensaje aquí..."
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

        <div className="flex flex-col items-center justify-center mt-8">
          <div className="flex space-x-6 text-2xl text-orange-500">
            <a
              href="https://www.facebook.com/industriascin.bo/?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="cursor-pointer hover:text-black transition duration-200" />
            </a>
            <a
              href="https://wa.me/59170700290"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="cursor-pointer hover:text-black transition duration-200" />
            </a>
            <a
              href="https://www.tiktok.com/@industriascin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="cursor-pointer hover:text-black transition duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

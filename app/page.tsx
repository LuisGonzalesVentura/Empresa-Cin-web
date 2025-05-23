"use client";


import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-orange-50 text-black p-6 relative font-sans">
      <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
        <Image src="/carga.png" alt="Logo CIN" width={160} height={160} />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          ¡Estamos construyendo algo increíble!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-md">
          El sitio web oficial de <strong>Industrias CIN</strong>
        </p>

        <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-300">
            Ir a la página
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-500">
        © 2025 Industrias CIN. Todos los derechos reservados.
      </footer>
    </main>
  );
}

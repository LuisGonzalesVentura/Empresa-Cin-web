'use client';

import './ui/global.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-6 relative">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <Image
          src="/carga.png"
          alt="Logo CIN"
          width={180}
          height={180}
        />
        <p className="text-lg font-medium">Estamos construyendo el sitio web oficial...</p>
        <Link href="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition">
            Ir a la página
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-sm text-black font-light">
        © 2025 Industrias Cin
      </footer>
    </main>
  );
}

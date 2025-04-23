import Link from 'next/link';

export default function SeleccionProducto() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-100 to-yellow-50 flex flex-col items-center pt-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-3 tracking-tight">
          🎉 Promociones Especiales CIN COCHABAMBA
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          ¡Elige una promo para comenzar tu experiencia!
        </p>

        <div className="flex flex-col space-y-5">
          <Link href="/dashboard/promocionesss/cochabamba/daleplay" passHref>
            <button className="flex items-center justify-between gap-5 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-5 px-8 rounded-2xl transition duration-300 shadow-lg hover:shadow-2xl">
              <span className="text-2xl">🎭</span>
              <span className="flex-grow text-left">DALE PLAY A TU CARNAVAL (Finalizado el 12 de Abril 2025)</span>
              <img
                src="/Play-station-5.png"
                alt="Carnaval"
                className="w-14 h-14"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

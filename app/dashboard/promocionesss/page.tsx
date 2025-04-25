import Link from 'next/link';

const departamentos = [
  { nombre: 'La Paz-El alto', emoji: '🏔️' },
  { nombre: 'Santa Cruz', emoji: '🌴' },
  { nombre: 'Cochabamba', emoji: '🎉' },
  { nombre: 'Oruro', emoji: '🎭' },
  { nombre: 'Potosí', emoji: '⛰️' },
  { nombre: 'Sucre', emoji: '🏛️' },
];

export default function SeleccionProducto() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-100 to-yellow-50 flex flex-col items-center pt-10 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-3 tracking-tight">
          🇧🇴 Promociones Bolivia
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          ¡Elige tu departamento para descubrir las mejores promociones!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {departamentos.map((dep) => (
            <Link key={dep.nombre} href={`/dashboard/promocionesss/${dep.nombre.toLowerCase()}`} passHref>
              <button className="flex items-center justify-between w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-xl">
                <span className="text-2xl">{dep.emoji}</span>
                <span className="flex-grow text-center">{dep.nombre}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

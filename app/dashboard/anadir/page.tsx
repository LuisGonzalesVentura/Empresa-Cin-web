import Link from 'next/link';

export default function SeleccionProducto() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Añadir Productos</h1>
        <p className="text-gray-700 mb-8">Selecciona la categoría del producto que deseas añadir.</p>

        <div className="flex flex-col space-y-4">
          <Link href="/dashboard/anadir/jugos" passHref>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
              Añadir Jugos
            </button>
          </Link>

          <Link href="/productos/agregar-hervidos" passHref>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
              Añadir Hervidos
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

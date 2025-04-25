'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type PromocionesMap = {
  [key: string]: {
    nombre: string;
    promociones: string[];
  };
};

const promocionesPorCiudad: PromocionesMap = {
  'cochabamba': { nombre: 'Cochabamba', promociones: ['Promo 1', 'Promo 2'] },
  'la paz-el alto': { nombre: 'La Paz / El Alto', promociones: [] },
  'santa cruz': { nombre: 'Santa Cruz', promociones: [] },
  'oruro': { nombre: 'Oruro', promociones: [] },
  'potosí': { nombre: 'Potosí', promociones: [] },
  'sucre': { nombre: 'Sucre', promociones: [] },
};

export default function PromocionesCiudad() {
  const params = useParams() as Record<string, string>;
  const departamento = decodeURIComponent(params.departamento || '').toLowerCase();
  const dataCiudad = promocionesPorCiudad[departamento];

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (dataCiudad && dataCiudad.promociones.length === 0) {
      setMostrarModal(true);
    }
  }, [departamento]);

  if (!dataCiudad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <h2 className="text-xl font-semibold text-red-600">Ciudad no encontrada.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-yellow-50">
      {/* Modal Bonito */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-orange-600 mb-4">🚧 Próximamente</h3>
            <p className="text-gray-700 mb-4">
              ¡Pronto habrá promociones para <strong>{dataCiudad.nombre}</strong>!
            </p>
            <button
              onClick={() => setMostrarModal(false)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-orange-600 mb-6">
          Promociones en {dataCiudad.nombre}
        </h2>

        {dataCiudad.promociones.length > 0 ? (
          <ul className="text-lg text-gray-700 space-y-2">
            {dataCiudad.promociones.map((promo, index) => (
              <li key={index} className="bg-orange-100 p-3 rounded-md shadow-sm">
                {promo}
              </li>
            ))}
          </ul> 
        ) : (
          <p className="text-gray-500 mt-4">
            Actualmente no hay promociones disponibles en tu Ciudad. ¡Vuelve pronto!
          </p>
        )}
      </div>
    </div>
  );
}

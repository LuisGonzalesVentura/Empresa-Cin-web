// app/dashboard/quienes_somos/page.tsx
import React from 'react';

const QuienesSomos = () => {
  return (
    <div className=" text-black min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        

        <div className="bg-white text-gray-1000 rounded-lg shadow-xl p-8 mb-8">
          <h2 className="font-bold  text-3xl  text-orange-500 mb-4">Nuestra Misión</h2>
          <p className="text-lg font-medium">
          Somos una empresa dedicada a la elaboración y distribución de bebidas naturales no carbonatadas saludables,
            satisfaciendo al mercado regional y nacional. Comprometidos con el mejoramiento continuo de nuestros procesos,
            el cuidado del medio ambiente y la satisfacción de nuestros clientes, con criterios de mejoramiento continuo,
            con alto compromiso y satisfacción.
          </p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-orange-500 mb-4">Nuestra Visión</h2>
          <p className="text-lg font-medium">
          Ser una empresa líder en el mercado regional y nacional en la elaboración e innovación de bebidas naturales,
            velando siempre por la calidad en nuestros procesos de producción, contribuyendo al bienestar de la salud de
            la población y al desarrollo del país.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuienesSomos;

'use client';

import React from 'react';

const QuienesSomos = () => {
  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* Encabezado con video mejorado */}
      <div className="relative w-full h-[60vh] sm:h-[80vh] overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/videoscin.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <h1 className="text-4xl sm:text-6xl text-white font-bold drop-shadow-lg animate__animated animate__fadeIn">
            ¿Quiénes Somos?
          </h1>
        </div>
      </div>

      {/* Historia de la empresa */}
      <div className="w-full bg-gradient-to-b from-orange-50 to-white py-12 sm:py-16 px-6 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-8 sm:mb-10 text-center">
            Nuestra Historia
          </h2>
          <div className="space-y-6 sm:space-y-8 text-gray-800 text-lg sm:text-xl leading-relaxed text-justify">
            <p>
              <span className="font-semibold text-orange-500">Industrias CIN</span> es una empresa 100% boliviana dedicada a la elaboración y distribución de bebidas naturales no carbonatadas saludables.
              Comprometida con la mejora continua de sus procesos, busca la máxima excelencia en sus productos.
            </p>
            <p>
              A lo largo de los años, Industrias CIN ha consolidado su presencia en el mercado boliviano, ofreciendo jugos naturales que combinan tradición y calidad.
              La empresa celebra su compromiso con la innovación y la satisfacción de sus clientes, manteniéndose como un referente en la industria de bebidas saludables en Bolivia.
            </p>
            <p>
              Con una visión centrada en el bienestar de la población y el desarrollo del país, Industrias CIN continúa trabajando para ofrecer productos que reflejen la esencia y tradición boliviana.
            </p>
          </div>
        </div>
      </div>

      {/* Imagen decorativa arriba de misión y visión */}
      <div className="w-full flex justify-center mb-8 sm:mb-10">
        <img src="/logo.png" alt="Industrias CIN" className="h-32 sm:h-40 object-contain" />
      </div>

      {/* Misión y Visión en bloques lado a lado mejorados */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col sm:flex-row bg-orange-50 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Misión */}
          <div className="flex-1 p-6 sm:p-10 hover:bg-orange-100 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-4 text-center sm:text-left">Nuestra Misión</h2>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed text-justify">
              Somos una empresa dedicada a la elaboración y distribución de bebidas naturales no carbonatadas saludables,
              satisfaciendo al mercado regional y nacional. Comprometidos con el mejoramiento continuo de nuestros procesos,
              el cuidado del medio ambiente y la satisfacción de nuestros clientes.
            </p>
          </div>

          {/* Divisor vertical */}
          <div className="hidden sm:block w-[1px] bg-orange-300 my-6 sm:my-10"></div>

          {/* Visión */}
          <div className="flex-1 p-6 sm:p-10 hover:bg-orange-100 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-4 text-center sm:text-left">Nuestra Visión</h2>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed text-justify">
              Ser una empresa líder en el mercado regional y nacional en la elaboración e innovación de bebidas naturales,
              velando siempre por la calidad en nuestros procesos de producción, contribuyendo al bienestar de la salud de
              la población y al desarrollo del país.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default QuienesSomos;

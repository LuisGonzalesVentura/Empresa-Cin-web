import Head from 'next/head';
import Image from 'next/image';

export default function Merchandising() {
  return (
    <>
      <Head>
        <title>Merchandising | En construcción</title>
      </Head>
      <div className="bg-gray-100 px-4 pt-12 min-h-screen flex justify-center">
        <div className="text-center max-w-md">
          <Image
            src="/carga.png"
            alt="En construcción"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            ¡Página en construcción!
          </h1>
          <p className="text-gray-700 text-lg">
            Estamos trabajando en la sección de <strong>Merchandising</strong>.  
            ¡Muy pronto estará disponible!
          </p>
        </div>
      </div>
    </>
  );
}

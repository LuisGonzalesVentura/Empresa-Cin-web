'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number;
  foto: string;
  id_ciudad: number;
  nombre_ciudad: string;
}

export default function FiltradoBusqueda() {
  const router = useRouter();
  const [filtradosHervidos, setFiltradosHervidos] = useState<Producto[]>([]);
  const [filtradosJugos, setFiltradosJugos] = useState<Producto[]>([]);
  const [query, setQuery] = useState<string>('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(true);

  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cantidades');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('query') || '';
    setQuery(busqueda);

    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }

    if (!busqueda || !ciudadGuardada) return;

    const fetchProductos = async () => {
      const [resH, resJ] = await Promise.all([
        fetch('/api/productos/hervidos'),
        fetch('/api/productos/jugos'),
      ]);
      const dataH = await resH.json();
      const dataJ = await resJ.json();

      const filtradosH = dataH.filter((p: Producto) =>
        p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
        p.nombre_ciudad.toLowerCase() === ciudadGuardada.toLowerCase()
      );
      const filtradosJ = dataJ.filter((p: Producto) =>
        p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
        p.nombre_ciudad.toLowerCase() === ciudadGuardada.toLowerCase()
      );

      setFiltradosHervidos(filtradosH);
      setFiltradosJugos(filtradosJ);
      setCargando(false);
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
  }, [cantidades]);

  const agregarAlCarrito = (
    producto: Producto,
    origen: 'hervido' | 'jugo',
    cantidad: number = 1
  ) => {
    const carritoExistente: (Producto & { cantidad: number; origen: string; precio_final: number })[] =
      JSON.parse(localStorage.getItem('carrito') || '[]');

    const descuento = producto.descuento || 0;
    const precioFinal = parseFloat((producto.precio - (producto.precio * descuento / 100)).toFixed(2));

    const productoExistente = carritoExistente.find(
      (p) => p.id_producto === producto.id_producto && p.origen === origen
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      productoExistente.precio_final = precioFinal;
      if (productoExistente.cantidad <= 0) {
        const index = carritoExistente.indexOf(productoExistente);
        carritoExistente.splice(index, 1);
      }
    } else if (cantidad > 0) {
      carritoExistente.push({
        ...producto,
        cantidad,
        origen,
        precio_final: precioFinal
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carritoExistente));

    const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
      detail: {
        cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0)
      }
    });
    window.dispatchEvent(eventoCarritoActualizado);

    const nuevasCantidades = carritoExistente.reduce((acc: { [key: number]: number }, p) => {
      acc[p.id_producto] = p.cantidad;
      return acc;
    }, {});

    localStorage.setItem('cantidades', JSON.stringify(nuevasCantidades));

    const eventoCantidadesActualizadas = new CustomEvent('cantidadesActualizadas', {
      detail: nuevasCantidades
    });
    window.dispatchEvent(eventoCantidadesActualizadas);
  };

  const renderProducto = (producto: Producto, origen: 'hervido' | 'jugo') => {
    const keyId = `${origen}-${producto.id_producto}`;
    const cantidad = cantidades[keyId] || 0;
    const precioNumerico = Number(producto.precio);
    const precioFinal = producto.descuento > 0
      ? (precioNumerico - (precioNumerico * producto.descuento) / 100).toFixed(2)
      : precioNumerico.toFixed(2);
    const precioOriginal = precioNumerico.toFixed(2);

    return (
      <div key={keyId} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
  <img src={`/uploads/${producto.foto}`} alt={producto.nombre_producto} className="w-full h-100 object-cover rounded-xl mb-4" />
  
  <p className="text-lg font-semibold text-gray-800">{producto.nombre_producto}</p>

  {producto.descuento > 0 && (
    <div className="mt-2 text-sm text-red-700 font-semibold bg-red-100 py-1 px-3 inline-block rounded-full">
      {`Descuento: ${producto.descuento}% `}
      <span className="line-through text-gray-400 ml-1">{`Bs. ${precioOriginal}`}</span>
    </div>
  )}

  <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>

  {cantidad === 0 ? (
    <button
      className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-base font-medium shadow-sm transition duration-200"
      onClick={() => {
        const storedCantidades = JSON.parse(localStorage.getItem('cantidades') || '{}');
        const cantidadGuardada = storedCantidades[keyId] || 1;
        agregarAlCarrito(producto, origen, cantidadGuardada);
        setCantidades(prev => ({
          ...prev,
          [keyId]: cantidadGuardada,
        }));
      }}
    >
      Agregar
    </button>
  ) : (
    <div className="mt-4 flex justify-center items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner mx-auto max-w-[160px]">
      <button
        onClick={() => {
          const nuevaCantidad = cantidad - 1;
          agregarAlCarrito(producto, origen, -1);
          setCantidades(prev => {
            const updated = { ...prev };
            if (nuevaCantidad <= 0) delete updated[keyId];
            else updated[keyId] = nuevaCantidad;
            return updated;
          });
        }}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
      >
        −
      </button>
      <span className="text-lg font-semibold text-gray-800 w-6 text-center">{cantidad}</span>
      <button
        onClick={() => {
          const nuevaCantidad = cantidad + 1;
          agregarAlCarrito(producto, origen, 1);
          setCantidades(prev => ({
            ...prev,
            [keyId]: nuevaCantidad,
          }));
        }}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition duration-200 shadow"
      >
        +
      </button>
    </div>
  )}
</div>

    );
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] bg-gradient-to-br from-white to-orange-50 px-6 text-center animate-fade-in">
        <div className="w-48 h-48 mb-8 animate-bounce">
          <img
            src="/carga.png"
            alt="Cargando productos"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
       
        <p className="text-lg sm:text-xl text-gray-700 mt-4 font-medium">
  Esto tomará solo unos segundos
</p>


      </div>
    );
  }
  
  
  

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-3xl font-semibold mt-12 mb-8 text-orange-600 ">Resultados para: "{query}"</h2>
        <Link href="/dashboard" className="text-orange-500 text-lg flex items-center gap-2 font-semibold">
          <FaArrowLeft />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <h3 className="text-2xl font-bold mt-4 mb-6 text-orange-600 ">Hervidos encontrados</h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {filtradosHervidos.length > 0
          ? filtradosHervidos.map(producto => renderProducto(producto, 'hervido'))
          : <p>No se encontraron hervidos con ese nombre en tu ciudad.</p>}
      </section>

      <h3 className="text-2xl font-bold mt-12 mb-6">Jugos encontrados</h3>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {filtradosJugos.length > 0
          ? filtradosJugos.map(producto => renderProducto(producto, 'jugo'))
          : <p>No se encontraron jugos con ese nombre en tu ciudad.</p>}
      </section>
    </div>
  );
}

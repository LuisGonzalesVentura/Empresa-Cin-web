'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  foto: string;
  descuento: number;
  nombre_ciudad: string;
}


export default function FiltradoBusqueda() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrados, setFiltrados] = useState<Producto[]>([]);
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [query, setQuery] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('');
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [forzarRender, setForzarRender] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('query') || '';
    setQuery(busqueda);

    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }

    if (!busqueda || !ciudadGuardada) return;

    fetch('/api/productos/hervidos')
      .then(res => res.json())
      .then(data => {
        const resultado = data.filter((p: Producto) =>
          p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
          p.nombre_ciudad.toLowerCase() === ciudadGuardada.toLowerCase()
        );
        setProductos(data);
        setFiltrados(resultado);
      });

    fetch('/api/productos/jugos')
      .then(res => res.json())
      .then(data => {
        const resultado = data.filter((p: Producto) =>
          p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
          p.nombre_ciudad.toLowerCase() === ciudadGuardada.toLowerCase()
        );
        setJugos(resultado);
      });

    setCargando(false);
  }, [query]);
// Actualización en tiempo real desde localStorage
const actualizarEstadoCarrito = () => {
  const saved = localStorage.getItem('cantidades');
  setCantidades(saved ? JSON.parse(saved) : {});
};

  // Actualización en tiempo real desde localStorage
  
  
  useEffect(() => {
    actualizarEstadoCarrito();
  
    const handleCarritoActualizado = () => {
      actualizarEstadoCarrito();
      setForzarRender(prev => !prev);
    };
  
    window.addEventListener('carritoActualizado', handleCarritoActualizado);
    window.addEventListener('storage', handleCarritoActualizado);
  
    return () => {
      
      window.removeEventListener('carritoActualizado', handleCarritoActualizado);
      window.removeEventListener('storage', handleCarritoActualizado);
    };
  }, []);
  
  
  

  const agregarAlCarrito = (producto: Producto, origen: 'hervido' | 'jugo', cantidad: number = 1) => {
    const carritoExistente: (Producto & { cantidad: number; origen: string })[] = JSON.parse(localStorage.getItem('carrito') || '[]');
  
    // Buscar si el producto ya está en el carrito
    const productoExistente = carritoExistente.find(p =>
      p.id_producto === producto.id_producto && p.origen === origen
    );
  
    if (productoExistente) {
      // Si existe, modificar la cantidad
      productoExistente.cantidad += cantidad;
      if (productoExistente.cantidad <= 0) {
        // Si la cantidad es 0 o menos, eliminarlo del carrito
        const index = carritoExistente.indexOf(productoExistente);
        carritoExistente.splice(index, 1);
      }
    } else if (cantidad > 0) {
      // Si no existe, agregar el producto al carrito
      carritoExistente.push({ ...producto, cantidad, origen });
    }
  
    // Actualizar el carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoExistente));
  
    // Actualizar las cantidades directamente después de modificar el carrito
    const nuevasCantidades = carritoExistente.reduce((acc: { [key: string]: number }, p) => {
      const key = `${p.origen}-${p.id_producto}`;
      acc[key] = p.cantidad;
      return acc;
    }, {});
    

  
    // Actualizar las cantidades tanto en el estado como en localStorage
    localStorage.setItem('cantidades', JSON.stringify(nuevasCantidades));
    setCantidades(nuevasCantidades); // Actualización directa del estado
  
    // Emitir evento de carrito actualizado (si es necesario)
    const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
      detail: { cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0) }
    });
    window.dispatchEvent(eventoCarritoActualizado);
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
      <div key={keyId} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
        <img src={`/uploads/${producto.foto}`} alt={producto.nombre_producto} className="w-full h-auto" />
        <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>
  
        {producto.descuento > 0 && (
          <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
            {`Descuento: ${producto.descuento}%`}
            <span className="ml-2 line-through text-gray-500">{`Bs. ${precioOriginal}`}</span>
          </div>
        )}
  
        <p className="text-green-600 font-bold text-xl mt-2">{`Bs. ${precioFinal}`}</p>
  
        {cantidad <= 0 ? (
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
            onClick={() => agregarAlCarrito(producto, origen, 1)}
          >
            Añadir al carrito
          </button>
        ) : (
<div className="mt-4 flex justify-center items-center gap--2 bg-gray-100 rounded-full px-3 py-2 shadow-inner mx-auto" style={{ maxWidth: '150px' }}>
<button
              onClick={() => agregarAlCarrito(producto, origen, -1)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
            >
              −
            </button>
            <span className="text-lg font-semibold text-gray-800 w-6 text-center">{cantidad}</span>
            <button
              onClick={() => agregarAlCarrito(producto, origen, 1)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
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
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <img src="/carga.png" alt="Cargando jugos" className="w-24 h-24 animate-bounce" />
        <p className="mt-4 text-black-600 text-lg font-semibold animate-pulse">
          Cargando productos CIN...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h2 className="text-3xl font-semibold mt-12 mb-8">Resultados para: "{query}"</h2>
        <Link
    href="/dashboard"
    className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
  >
    <FaArrowLeft />
    <span>Volver al inicio</span>
  </Link>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {filtrados.length > 0
          ? filtrados.map(producto => renderProducto(producto, 'hervido'))
          : <p>No se encontraron productos con ese nombre en tu ciudad.</p>}
      </section>

      {jugos.length > 0 && (
        <>
          <h3 className="text-2xl font-bold mt-12 mb-6">Jugos encontrados</h3>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {jugos.map(producto => renderProducto(producto, 'jugo'))}
          </section>
        </>
      )}
    </div>
  );
}

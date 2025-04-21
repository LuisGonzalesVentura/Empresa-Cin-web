'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  foto: string;
  descuento: number;
  nombre_ciudad: string; // Asumo que es necesario para la comparación
}

export default function FiltradoBusqueda() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrados, setFiltrados] = useState<Producto[]>([]);
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [query, setQuery] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  
  // Detectar cambios en la URL y recargar productos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get("query") || "";
    setQuery(busqueda);

    // Cargar la ciudad seleccionada desde localStorage
    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    }

    if (!busqueda || !ciudadGuardada) return;

    // Buscar productos "hervidos"
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

    // Buscar productos "jugos"
    fetch("/api/productos/jugos")
      .then((res) => res.json())
      .then((jugosData) => {
        const jugosFiltrados = jugosData.filter(
          (j: Producto) =>
            j.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
            j.nombre_ciudad.toLowerCase() === ciudadGuardada.toLowerCase()
        );
        setJugos(jugosFiltrados);
      });

    setCargando(false);
  }, [query, ciudadSeleccionada]); // Reejecutar cuando query o ciudad seleccionada cambian


  
  const agregarAlCarrito = (producto: Producto, origen: 'hervido' | 'jugo') => {
    mostrarCantidadInput('¿Cuántos productos deseas añadir?', (cantidad: number) => {
      if (isNaN(cantidad) || cantidad <= 0) {
        mostrarAlerta('Por favor, ingresa una cantidad válida.', 'error');
        return;
      }
  
      const carritoExistente: (Producto & { cantidad: number; origen: string })[] = JSON.parse(localStorage.getItem('carrito') || '[]');
  
      // Buscamos si ya existe un producto con ese id Y de ese origen
      const productoExistente = carritoExistente.find(p => 
        p.id_producto === producto.id_producto && p.origen === origen
      );
  
      if (productoExistente) {
        productoExistente.cantidad += cantidad;
      } else {
        carritoExistente.push({ ...producto, cantidad, origen });
      }
  
      localStorage.setItem('carrito', JSON.stringify(carritoExistente));
  
      const eventoCarritoActualizado = new CustomEvent('carritoActualizado', {
        detail: { cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0) }
      });
  
      window.dispatchEvent(eventoCarritoActualizado);
      mostrarAlerta('Producto añadido al carrito correctamente.', 'success');
    });
  };
// Función para mostrar alerta bonita
const mostrarAlerta = (mensaje: string, tipo: 'success' | 'error') => {
  const alerta = document.createElement('div');
  alerta.textContent = mensaje;
  Object.assign(alerta.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: tipo === 'success' ? '#4CAF50' : '#F44336',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: '9999',
    transition: 'opacity 0.5s ease-in-out',
    opacity: '1'
  });

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.style.opacity = '0';
    setTimeout(() => alerta.remove(), 500);
  }, 3000);
};

// Función para mostrar input personalizado de cantidad
const mostrarCantidadInput = (mensaje: string, callback: (cantidad: number) => void) => {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10000'
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  });

  const texto = document.createElement('p');
  texto.textContent = mensaje;
  texto.style.marginBottom = '15px';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.value = '1';
  input.style.padding = '10px';
  input.style.width = '100%';
  input.style.marginBottom = '15px';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '5px';

  const boton = document.createElement('button');
  boton.textContent = 'Añadir';
  Object.assign(boton.style, {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  });

  boton.onclick = () => {
    const cantidad = parseInt(input.value);
    modal.remove();
    callback(cantidad);
  };

  content.appendChild(texto);
  content.appendChild(input);
  content.appendChild(boton);
  modal.appendChild(content);
  document.body.appendChild(modal);
};
if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <img
          src="/carga.png"
          alt="Cargando jugos"
          className="w-24 h-24 animate-bounce"
        />
        <p className="mt-4 text-black-600 text-lg font-semibold animate-pulse">
          Cargando productos CIN...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* Título de categoría */}
<div className="flex items-center justify-between mb-6 flex-wrap">
<h2 className="text-3xl font-semibold mt-12 mb-8">Resultados para: "{query}"</h2>

      <Link href="/dashboard" passHref>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-lg flex items-center space-x-2 transition duration-300">
          <FaArrowLeft /> {/* Icono de la flecha */}
          <span>Volver al inicio</span>
        </button>
      </Link>
    </div>




      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {filtrados.length > 0 ? (
          filtrados.map((producto) => {
            const precioFinal = producto.descuento > 0
              ? (producto.precio - (producto.precio * producto.descuento) / 100).toFixed(2)
              : producto.precio;

            return (
              <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
                <img
                  src={`/uploads/${producto.foto}`}
                  alt={producto.nombre_producto}
                  className="w-full h-auto"
                />
                <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

                {producto.descuento > 0 && (
                  <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                    {`Descuento: ${producto.descuento}%`} 
                    <span className="ml-2 line-through text-gray-500">{`Bs. ${producto.precio}`}</span>
                  </div>
                )}

                <p className="text-green-600 font-bold text-xl mt-2">
                  {`Bs. ${precioFinal}`}
                </p>

                <button
  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
  onClick={() => agregarAlCarrito(producto, 'hervido')}
>
  Añadir al carrito
</button>
              </div>
            );
          })
        ) : (
          <p>No se encontraron productos con ese nombre en tu ciudad.</p>
        )}
      </section>

      {/* Categoría Jugos */}
      {jugos.filter(j => j.nombre_ciudad === ciudadSeleccionada).length > 0 && (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {jugos
              .filter((producto) => producto.nombre_ciudad === ciudadSeleccionada)
              .map((producto) => {
                const precioFinal = producto.descuento > 0
                  ? (producto.precio - (producto.precio * producto.descuento) / 100).toFixed(2)
                  : producto.precio;

                return (
                  <div key={producto.id_producto} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition text-center">
                    <img
                      src={`/uploads/${producto.foto}`}
                      alt="Producto"
                      className="w-full h-auto"
                    />
                    <p className="mt-4 text-lg font-medium">{producto.nombre_producto}</p>

                    {producto.descuento > 0 && (
                      <div className="mt-2 text-sm text-red-600 font-semibold bg-red-100 py-1 px-2 inline-block rounded">
                        {`Descuento: ${producto.descuento}%`} 
                        <span className="ml-2 line-through text-gray-500">{`Bs. ${producto.precio}`}</span>
                      </div>
                    )}

                    <p className="text-green-600 font-bold text-xl mt-2">
                      {`Bs. ${precioFinal}`}
                    </p>

                    <button
  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
  onClick={() => agregarAlCarrito(producto, 'jugo')}
>
  Añadir al carrito
</button>
                  </div>
                );
              })}
          </section>
        </>
      )}
    </div>
  );
}
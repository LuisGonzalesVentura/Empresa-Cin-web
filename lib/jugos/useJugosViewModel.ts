"use client";

import { useEffect, useState } from "react";
import { Producto, Ciudad } from "@/types/types";
import {
  obtenerCiudadGuardada,
  obtenerJugos,
  obtenerCiudades,
  agregarAlCarrito,
  inicializarCantidades,
} from "@/lib/jugos/logica_jugos";

export const useJugosViewModel = () => {
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(
    inicializarCantidades,
  );
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  const [cargando, setCargando] = useState(true);

  // Handler para cargar datos iniciales
  const cargarDatos = async () => {
    setCiudadSeleccionada(obtenerCiudadGuardada());

    try {
      const [jugosData, ciudadesData] = await Promise.all([
        obtenerJugos(),
        obtenerCiudades(),
      ]);
      setJugos(jugosData);
      setCiudades(ciudadesData);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Handler para sincronizar cantidades con localStorage
  const sincronizarCantidadesLocalStorage = () => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("cantidades");
    const cantidadesGuardadas = saved ? JSON.parse(saved) : {};

    // Se combinan los valores guardados con el estado actual
    const nuevasCantidades = { ...cantidadesGuardadas, ...cantidades };

    // Elimina claves que ya no están en el estado actual
    Object.keys(cantidadesGuardadas).forEach((clave) => {
      if (!(clave in cantidades)) {
        delete nuevasCantidades[clave];
      }
    });

    localStorage.setItem("cantidades", JSON.stringify(nuevasCantidades));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    sincronizarCantidadesLocalStorage();
  }, [cantidades]);

  const actualizarCantidad = (producto: Producto, nuevaCantidad: number) => {
    const keyId = `jugo-${producto.id_producto}`;

    agregarAlCarrito(
      producto,
      "jugo",
      nuevaCantidad - (cantidades[keyId] || 0),
    );

    setCantidades((prev) => {
      const updated = { ...prev };
      if (nuevaCantidad <= 0) {
        delete updated[keyId];
      } else {
        updated[keyId] = nuevaCantidad;
      }
      return updated;
    });
  };

  // Función para calcular los jugos renderizados agrupados por volumen
  const calcularJugosRenderizados = () => {
    return ["330ml", "1 Litro", "2 Litros", "3 Litros"]
      .map((volumen) => {
        const productos = jugos
          .filter(
            (producto) =>
              producto.nombre_ciudad === ciudadSeleccionada &&
              producto.nombre_producto
                .toLowerCase()
                .includes(volumen.toLowerCase()),
          )
          .map((producto) => {
            const keyId = `jugo-${producto.id_producto}`;
            const cantidad = cantidades[keyId] || 0;
            const precioRaw = Number(producto.precio);
            const descuentoRaw = Number(producto.descuento);
            const tieneDescuento = descuentoRaw > 0;
            const precioFinal = (
              tieneDescuento ? precioRaw * (1 - descuentoRaw / 100) : precioRaw
            ).toFixed(2);
            const precioOriginal = precioRaw.toFixed(2);
            const mostrarBotonAgregar = cantidad === 0;

            return {
              id: producto.id_producto,
              nombre: producto.nombre_producto,
              foto: producto.foto,
              cantidad,
              tieneDescuento,
              descuentoRaw,
              precioFinal,
              precioOriginal,
              mostrarBotonAgregar,
              onAgregar: () => actualizarCantidad(producto, 1),
              onSumar: () => actualizarCantidad(producto, cantidad + 1),
              onRestar: () => actualizarCantidad(producto, cantidad - 1),
            };
          });

        return productos.length > 0 ? { volumen, productos } : null;
      })
      .filter(Boolean) as {
      volumen: string;
      productos: {
        id: number;
        nombre: string;
        foto: string;
        cantidad: number;
        tieneDescuento: boolean;
        descuentoRaw: number;
        precioFinal: string;
        precioOriginal: string;
        mostrarBotonAgregar: boolean;
        onAgregar: () => void;
        onSumar: () => void;
        onRestar: () => void;
      }[];
    }[];
  };

  const jugosRenderizados = calcularJugosRenderizados();

  return {
    jugosRenderizados,
    ciudadSeleccionada,
    ciudades,
    cargando,
  };
};

"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/types";
import {
  obtenerProductosMerchandising,
  obtenerCiudades,
  agregarAlCarrito,
  inicializarCantidades,
} from "./logica_merchandising";

export const useMerchandisingViewModel = () => {
  const [merchandising, setMerchandising] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(
    inicializarCantidades,
  );
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  const [cargando, setCargando] = useState(true);

  // Handler para cargar datos iniciales
  const cargarDatos = async () => {
    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadGuardada) setCiudadSeleccionada(ciudadGuardada);

    try {
      const productos = await obtenerProductosMerchandising();
      setMerchandising(productos);
    } catch (err) {
      console.error("Error al obtener Merchandising:", err);
    } finally {
      setCargando(false);
    }

    try {
      await obtenerCiudades();
    } catch (err) {
      console.error("Error al obtener ciudades:", err);
    }

    const savedCantidades = localStorage.getItem("cantidades");
    if (savedCantidades) {
      setCantidades(JSON.parse(savedCantidades));
    }
  };

  // Handler para sincronizar cantidades en localStorage
  const sincronizarCantidadesLocalStorage = () => {
    localStorage.setItem("cantidades", JSON.stringify(cantidades));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    sincronizarCantidadesLocalStorage();
  }, [cantidades]);

  const agregarProducto = (
    producto: Producto,
    keyId: string,
    cantidad: number,
  ) => {
    agregarAlCarrito(producto, "merchandising", cantidad);

    setCantidades((prev) => {
      const nuevaCantidad = (prev[keyId] || 0) + cantidad;

      if (nuevaCantidad <= 0) {
        const actualizado = { ...prev };
        delete actualizado[keyId];
        return actualizado;
      }

      return { ...prev, [keyId]: nuevaCantidad };
    });
  };

  const productosFiltrados = merchandising.filter(
    (producto) => producto.nombre_ciudad === ciudadSeleccionada,
  );

  const calcularPrecioFinal = (producto: Producto) => {
    if (producto.descuento > 0) {
      return (producto.precio * (1 - producto.descuento / 100)).toFixed(2);
    }
    return producto.precio.toFixed(2);
  };

  return {
    cargando,
    cantidades,
    productosFiltrados,
    agregarProducto,
    calcularPrecioFinal,
  };
};

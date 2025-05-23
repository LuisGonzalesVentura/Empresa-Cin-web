"use client";

import { Producto } from "@/types/types";

export const obtenerProductos = async (
  url: string,
  setter: React.Dispatch<React.SetStateAction<any>>,
) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    setter(data);
  } catch (err) {
    console.error(`Error al obtener productos desde ${url}:`, err);
  }
};
export const inicializarCantidades = (): Record<string, number> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cantidades");
    return saved ? JSON.parse(saved) : {};
  }
  return {};
};
export const obtenerCiudades = async (
  setter: React.Dispatch<React.SetStateAction<any>>,
) => {
  try {
    const res = await fetch("/api/ciudades");
    const data = await res.json();
    setter(data);
  } catch (err) {
    console.error("Error al obtener ciudades:", err);
  }
};

export const verificarCiudadGuardada = (
  setter: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
  if (ciudadGuardada) {
    setter(ciudadGuardada);
  }
};

export const guardarCantidadesEnLocalStorage = (cantidades: any) => {
  localStorage.setItem("cantidades", JSON.stringify(cantidades));
};

export const agregarAlCarrito = (
  producto: Producto,
  origen: "hervido" | "jugo",
  cantidad: number,
) => {
  const carritoExistente: (Producto & {
    cantidad: number;
    origen: string;
    precio_final: number;
  })[] = JSON.parse(localStorage.getItem("carrito") || "[]");

  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  const precioFinal = parseFloat(
    (precio - (precio * descuento) / 100).toFixed(2),
  );

  const productoExistente = carritoExistente.find(
    (p) => p.id_producto === producto.id_producto && p.origen === origen,
  );

  if (productoExistente) {
    // REEMPLAZAR cantidad en lugar de sumar
    productoExistente.cantidad = cantidad;
    productoExistente.precio_final = precioFinal;
    if (productoExistente.cantidad <= 0) {
      const index = carritoExistente.indexOf(productoExistente);
      carritoExistente.splice(index, 1);
    }
  } else if (cantidad > 0) {
    carritoExistente.push({
      ...producto,
      precio,
      cantidad,
      origen,
      precio_final: precioFinal,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carritoExistente));

  const cantidadTotal = carritoExistente.reduce(
    (acc, p) => acc + p.cantidad,
    0,
  );
  window.dispatchEvent(
    new CustomEvent("carritoActualizado", {
      detail: { cantidadTotal },
    }),
  );

  const nuevasCantidades = carritoExistente.reduce(
    (acc: { [key: number]: number }, p) => {
      acc[p.id_producto] = p.cantidad;
      return acc;
    },
    {},
  );

  localStorage.setItem("cantidades", JSON.stringify(nuevasCantidades));

  window.dispatchEvent(
    new CustomEvent("cantidadesActualizadas", {
      detail: nuevasCantidades,
    }),
  );
};

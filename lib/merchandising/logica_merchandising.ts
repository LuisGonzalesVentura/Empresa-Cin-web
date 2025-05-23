"use client";
import { Producto } from "@/types/types";

export const obtenerProductosMerchandising = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/merchandising");
  if (!res.ok) throw new Error("Error al obtener los productos");

  const data = await res.json();

  // Convertir precio y descuento a número (por si vienen como string)
  return data.map((producto: any) => ({
    ...producto,
    precio: parseFloat(producto.precio),
    descuento: parseFloat(producto.descuento),
  }));
};
export const inicializarCantidades = (): Record<string, number> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cantidades");
    return saved ? JSON.parse(saved) : {};
  }
  return {};
};
export const obtenerCiudades = async () => {
  const res = await fetch("/api/ciudades");
  if (!res.ok) throw new Error("Error al obtener ciudades");
  return await res.json();
};

export const agregarAlCarrito = (
  producto: Producto,
  origen: "hervido" | "jugo" | "merchandising",
  cantidad: number = 1,
) => {
  const carritoExistente: (Producto & {
    cantidad: number;
    origen: string;
    precio_final: number;
  })[] = JSON.parse(localStorage.getItem("carrito") || "[]");

  const descuento = producto.descuento || 0;
  const precioFinal = parseFloat(
    (producto.precio - (producto.precio * descuento) / 100).toFixed(2),
  );

  const productoExistente = carritoExistente.find(
    (p) => p.id_producto === producto.id_producto && p.origen === origen,
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
      precio_final: precioFinal,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carritoExistente));

  const eventoCarritoActualizado = new CustomEvent("carritoActualizado", {
    detail: {
      cantidadTotal: carritoExistente.reduce((acc, p) => acc + p.cantidad, 0),
    },
  });
  window.dispatchEvent(eventoCarritoActualizado);

  const nuevasCantidades = carritoExistente.reduce(
    (acc: { [key: number]: number }, p) => {
      acc[p.id_producto] = p.cantidad;
      return acc;
    },
    {},
  );

  localStorage.setItem("cantidades", JSON.stringify(nuevasCantidades));

  const eventoCantidadesActualizadas = new CustomEvent(
    "cantidadesActualizadas",
    {
      detail: nuevasCantidades,
    },
  );
  window.dispatchEvent(eventoCantidadesActualizadas);
};

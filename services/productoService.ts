// services/productoService.ts
import { Producto, Ciudad, Pedido, } from "@/types/types";

export const getProductosMerchandising = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/merchandising");
  if (!res.ok) throw new Error("No se pudieron cargar los productos.");
  return res.json();
};

export const getProductosJugos = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/jugos");
  if (!res.ok) throw new Error("No se pudieron cargar los productos.");
  return res.json();
};

export const getCiudades = async (): Promise<Ciudad[]> => {
  const res = await fetch("/api/ciudades");
  if (!res.ok) throw new Error("No se pudieron cargar las ciudades.");
  return res.json();
};

export const postProductoMerchandising = async (formData: FormData): Promise<Producto> => {
  const res = await fetch("/api/productos/agregar_merchandising", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al insertar el producto.");
  return res.json();
};

export const postProductoJugos = async (formData: FormData): Promise<Producto> => {
  const res = await fetch("/api/productos/agregar_jugos", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al insertar el producto.");
  return res.json();
};


export const getProductosHervidos = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/hervidos");
  if (!res.ok) throw new Error("No se pudieron cargar los hervidos.");
  return res.json();
};

export const postProductoHervidos = async (formData: FormData): Promise<Producto> => {
  const res = await fetch("/api/productos/agregar_hervidos", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error al agregar hervido:", errorData);
    throw new Error("Error al agregar hervido.");
  }

  return res.json();
};

export const obtenerProductosHervidos = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/hervidos");
  if (!res.ok) throw new Error("No se pudieron cargar los hervidos.");
  return res.json();
};

export const obtenerProductosJugos = async (): Promise<Producto[]> => {
  const res = await fetch("/api/productos/jugos");
  if (!res.ok) throw new Error("No se pudieron cargar los jugos.");
  return res.json();
};
export const obtenerMerchandising = async () => {
  const res = await fetch("/api/productos/merchandising");
  if (!res.ok) throw new Error("Error al obtener merchandising");
  return await res.json();
};
export const obtenerCiudades = async (): Promise<Ciudad[]> => {
  const res = await fetch("/api/ciudades");
  if (!res.ok) throw new Error("No se pudieron cargar las ciudades.");
  return res.json();
};
export const obtenerPedidosUsuario = async (usuarioId: string): Promise<Pedido[]> => {
  const res = await fetch(`/api/ver_pedidos_usuario?usuario_id=${usuarioId}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  const data = await res.json();
  return data.pedidos || [];
};

export const obtenerEstadoQR = async (
  qrId: number,
): Promise<"pagado" | "no_pagado" | "error"> => {
  try {
    const res = await fetch(`/api/test-estado-qr?qrId=${qrId}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();
    return data.estado;
  } catch {
    return "error";
  }
};



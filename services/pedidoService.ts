import {  PedidoPayload, } from "@/types/types";


export const realizarPedidoApi = async (payload: PedidoPayload) => {
  const res = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al realizar el pedido");

  return await res.json();
};
// lib/carrito/logica_carrito.ts
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ProductoCarrito } from "@/types/types";
import {
  cargarCarrito,
  quitarDelCarrito as quitarDeStorage,
  calcularTotal,
  calcularCantidadTotal,
} from "./utils";

export const prepararProductosParaRender = (
  productos: ProductoCarrito[],
): (ProductoCarrito & {
  key: string;
  precioFinal: number;
  total: number;
})[] => {
  return productos.map((producto, index) => {
    const key = `${producto.id_producto}-${index}`;
    const precioFinal =
      producto.precio - (producto.precio * producto.descuento) / 100;
    const total = precioFinal * producto.cantidad;

    return {
      ...producto,
      key,
      precioFinal,
      total,
    };
  });
};

export const useCarrito = () => {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);

  useEffect(() => {
    setProductos(cargarCarrito());

    const actualizar = () => {
      setProductos(cargarCarrito());
    };

    window.addEventListener("carritoActualizado", actualizar);
    return () => window.removeEventListener("carritoActualizado", actualizar);
  }, []);

  const quitarProducto = (id: number, origen: string) => {
    quitarDeStorage(id, origen, setProductos);
  };

  const irAPago = () => {
    const total = calcularTotal(productos); // Calcula el total de los productos
    const totalNumero = parseFloat(total);

    // Verifica si el total es mayor o igual a 144
    if (totalNumero >= 144) {
      const sesion = sessionStorage.getItem("usuario");
      if (sesion) {
        router.push("/dashboard/pedido");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para continuar con el pago.",
          confirmButtonText: "Ir al login",
          customClass: {
            popup: "rounded-lg p-4 text-sm",
            title: "text-xl font-semibold text-red-600",
            confirmButton:
              "bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md",
          },
        }).then(() => router.push("/dashboard/login"));
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Total incorrecto",
        text: "El total de los productos debe ser 144.00Bs o más para proceder con el pago.",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-lg p-4 text-sm",
          title: "text-xl font-semibold text-red-600",
          confirmButton:
            "bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md",
        },
      });
    }
  };

  return {
    productos,
    quitarProducto,
    irAPago,
    calcularTotal,
    calcularCantidadTotal,
    irAInicio: () => router.push("/dashboard"),
  };
};

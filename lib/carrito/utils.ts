//*Utils.ts

import { ProductoCarrito } from "@/types/types";

// Carga el carrito desde localStorage
export const cargarCarrito = (): ProductoCarrito[] => {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
};

export const calcularTotal = (productos: ProductoCarrito[]): string => {
  const total = productos.reduce((acc, producto) => {
    const precioConDescuento =
      producto.precio - (producto.precio * producto.descuento) / 100;
    return acc + producto.cantidad * precioConDescuento;
  }, 0);
  return total.toFixed(2);
};

// Calcula la cantidad total de productos
export const calcularCantidadTotal = (productos: ProductoCarrito[]): number => {
  return productos.reduce((acc, producto) => acc + producto.cantidad, 0);
};

// Quita un producto del carrito (uno a la vez)
export const quitarDelCarrito = (
  id_producto: number,
  origen: string,
  setProductos: React.Dispatch<React.SetStateAction<ProductoCarrito[]>>,
) => {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

  const index = carrito.findIndex(
    (item: any) => item.id_producto === id_producto && item.origen === origen,
  );

  if (index !== -1) {
    carrito[index].cantidad -= 1;

    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualiza también las cantidades individuales
    const cantidades = JSON.parse(localStorage.getItem("cantidades") || "{}");
    const key = `${origen}-${id_producto}`;

    if (cantidades[key]) {
      cantidades[key] -= 1;
      if (cantidades[key] <= 0) delete cantidades[key];
      localStorage.setItem("cantidades", JSON.stringify(cantidades));
    }

    // Refresca el estado de productos
    setProductos([...carrito]);

    // Dispara eventos para que otros componentes escuchen
    const cantidadTotal = carrito.reduce(
      (acc: number, item: any) => acc + item.cantidad,
      0,
    );

    const evento = new CustomEvent("carritoActualizado", {
      detail: { cantidadTotal },
    });
    window.dispatchEvent(evento);
    window.dispatchEvent(new CustomEvent("userChanged"));
  }
};

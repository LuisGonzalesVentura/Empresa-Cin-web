import { Categoria, Producto, ProductoConCategoria } from "@/types/types";

export const calcularPrecioFinal = (producto: Producto): number => {
  const precio = Number(producto.precio);
  const descuento = Number(producto.descuento) || 0;

  if (isNaN(precio)) return 0;

  return parseFloat((precio - (precio * descuento) / 100).toFixed(2));
};
export const inicializarCantidades = (): Record<string, number> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cantidades");
    return saved ? JSON.parse(saved) : {};
  }
  return {};
};

export const agregarAlCarrito = (
  producto: Producto,
  origen: Categoria,
  cantidad: number,
) => {
  const carritoExistente: (Producto & {
    cantidad: number;
    origen: string;
    precio_final: number;
  })[] = JSON.parse(localStorage.getItem("carrito") || "[]");

  const precioFinal = calcularPrecioFinal(producto);

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

  const cantidadTotal = carritoExistente.reduce(
    (acc, p) => acc + p.cantidad,
    0,
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
    new CustomEvent("carritoActualizado", {
      detail: { cantidadTotal },
    }),
  );

  window.dispatchEvent(
    new CustomEvent("cantidadesActualizadas", {
      detail: nuevasCantidades,
    }),
  );

  return nuevasCantidades;
};

export const ordenarProductos = (
  productos: ProductoConCategoria[],
  filtro: string,
): ProductoConCategoria[] => {
  if (filtro === "Precio Menor a Mayor") {
    return [...productos].sort(
      (a, b) => calcularPrecioFinal(a) - calcularPrecioFinal(b),
    );
  }
  if (filtro === "Precio Mayor a Menor") {
    return [...productos].sort(
      (a, b) => calcularPrecioFinal(b) - calcularPrecioFinal(a),
    );
  }
  return productos;
};

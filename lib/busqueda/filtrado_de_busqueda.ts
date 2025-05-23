import { Producto } from "@/types/types";

// Función para obtener los productos filtrados por búsqueda y ciudad
export async function fetchYFiltrarProductos(
  query: string,
  ciudad: string,
): Promise<[Producto[], Producto[]]> {
  const [resH, resJ] = await Promise.all([
    fetch("/api/productos/hervidos"),
    fetch("/api/productos/jugos"),
  ]);
  const dataH = await resH.json();
  const dataJ = await resJ.json();

  const filtradosH = dataH.filter(
    (p: Producto) =>
      p.nombre_producto.toLowerCase().includes(query.toLowerCase()) &&
      p.nombre_ciudad.toLowerCase() === ciudad.toLowerCase(),
  );
  const filtradosJ = dataJ.filter(
    (p: Producto) =>
      p.nombre_producto.toLowerCase().includes(query.toLowerCase()) &&
      p.nombre_ciudad.toLowerCase() === ciudad.toLowerCase(),
  );

  return [filtradosH, filtradosJ];
}

// Función para agregar un producto al carrito

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
    productoExistente.cantidad += cantidad;
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

export function calcularPrecioFinal(producto: Producto) {
  const precioOriginalNum = Number(producto.precio);
  const descuentoNum = Number(producto.descuento);

  if (isNaN(precioOriginalNum)) {
    console.error("Precio inválido para el producto:", producto);
    return { precioFinal: 0, precioOriginal: 0 };
  }
  if (isNaN(descuentoNum)) {
    console.error("Descuento inválido para el producto:", producto);
    return {
      precioFinal: precioOriginalNum,
      precioOriginal: precioOriginalNum,
    };
  }

  const precioFinal =
    descuentoNum > 0
      ? parseFloat(
          (
            precioOriginalNum -
            (precioOriginalNum * descuentoNum) / 100
          ).toFixed(2),
        )
      : parseFloat(precioOriginalNum.toFixed(2));

  return {
    precioFinal,
    precioOriginal: parseFloat(precioOriginalNum.toFixed(2)),
  };
}

import { Producto, Ciudad } from "@/types/types";

// Inicializadores
export const inicializarCantidades = (): Record<string, number> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cantidades");
    return saved ? JSON.parse(saved) : {};
  }
  return {};
};

export const inicializarCiudad = (): string => {
  return localStorage.getItem("ciudadSeleccionada") || "";
};

// Getters de datos
export const obtenerProductos = async (
  tipo: "hervidos" | "jugos",
  callback: (data: Producto[]) => void,
) => {
  try {
    const res = await fetch(`/api/productos/${tipo}`);
    const data: Producto[] = await res.json();
    callback(data);
  } catch (error) {
    console.error(`Error al obtener ${tipo}:`, error);
  }
};

export const obtenerCiudades = async (callback: (data: Ciudad[]) => void) => {
  try {
    const res = await fetch("/api/ciudades");
    const data = await res.json();
    callback(data);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
  }
};

export const manejarCargaInicial = async ({
  setJugos,
  setHervidos,
  setCiudades,
  setCargando,
  setCiudadSeleccionada,
}: {
  setJugos: (data: any) => void;
  setHervidos: (data: any) => void;
  setCiudades: (data: any) => void;
  setCargando: (value: boolean) => void;
  setCiudadSeleccionada: (value: string) => void;
}) => {
  const ciudadGuardada = inicializarCiudad();
  if (ciudadGuardada) setCiudadSeleccionada(ciudadGuardada);

  await obtenerProductos("hervidos", setHervidos);
  await obtenerProductos("jugos", (data) => {
    setJugos(data);
    setCargando(false);
  });

  await obtenerCiudades(setCiudades);
};

// Verifica carrito
export const verificarCarritoGuardado = () => {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  console.log(
    carrito.length === 0 ? "El carrito está vacío" : "Productos en el carrito:",
    carrito,
  );
};

// Manejo del carrito
export const manejarCarrito = (
  producto: Producto,
  origen: "hervido" | "jugo",
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

  const cantidadTotal = carritoExistente.reduce(
    (acc, p) => acc + p.cantidad,
    0,
  );
  window.dispatchEvent(
    new CustomEvent("carritoActualizado", { detail: { cantidadTotal } }),
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
    new CustomEvent("cantidadesActualizadas", { detail: nuevasCantidades }),
  );
};

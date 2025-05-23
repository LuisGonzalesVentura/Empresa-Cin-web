import { useState, useEffect } from "react";
import { Producto, Ciudad, ProductoAgrupadoPorVolumen } from "@/types/types";
import {
  obtenerProductosHervidos,
  obtenerProductosJugos,
  obtenerCiudades,
} from "@/services/productoService";
import {
  verificarCiudadGuardada,
  guardarCantidadesEnLocalStorage,
  agregarAlCarrito,
  inicializarCantidades,
} from "@/lib/hervidos/logica_hervidos";

export const useHervidosViewModel = () => {
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [hervidos, setHervidos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(inicializarCantidades);

  const cargarDatosIniciales = async () => {
    verificarCiudadGuardada(setCiudadSeleccionada);

    try {
      const [hervidosData, jugosData, ciudadesData] = await Promise.all([
        obtenerProductosHervidos(),
        obtenerProductosJugos(),
        obtenerCiudades(),
      ]);
      setHervidos(hervidosData);
      setJugos(jugosData);
      setCiudades(ciudadesData);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cantidades");
      const cantidadesGuardadas = saved ? JSON.parse(saved) : {};
      const nuevasCantidades = { ...cantidadesGuardadas, ...cantidades };
      localStorage.setItem("cantidades", JSON.stringify(nuevasCantidades));
    }
  }, [cantidades]);

  useEffect(() => {
    guardarCantidadesEnLocalStorage(cantidades);
  }, [cantidades]);

  const actualizarCantidad = (producto: Producto, cantidad: number) => {
    const keyId = `hervido-${producto.id_producto}`;
    setCantidades((prev) => ({
      ...prev,
      [keyId]: cantidad,
    }));
    agregarAlCarrito(producto, "hervido", cantidad);
  };

  const productosAgrupadosPorVolumen: ProductoAgrupadoPorVolumen[] = [
    "330ml",
    "1 Litro",
    "2 Litros",
    "3 Litros",
  ].map((volumen) => {
    const productos = hervidos
      .filter(
        (producto) =>
          producto.nombre_ciudad === ciudadSeleccionada &&
          producto.nombre_producto.toLowerCase().includes(volumen.toLowerCase())
      )
      .map((producto) => {
        const precioRaw = Number(producto.precio);
        const descuentoRaw = Number(producto.descuento);
        const precioFinalNum =
          descuentoRaw > 0 ? precioRaw * (1 - descuentoRaw / 100) : precioRaw;

        return {
          producto,
          cantidad: cantidades[`hervido-${producto.id_producto}`] || 0,
          precioFinal: precioFinalNum.toFixed(2),
          precioOriginal: precioRaw.toFixed(2),
        };
      });

    return { volumen, productos };
  });

  return {
    hervidos,
    jugos,
    ciudades,
    ciudadSeleccionada,
    cargando,
    cantidades,
    actualizarCantidad,
    productosAgrupadosPorVolumen,
  };
};

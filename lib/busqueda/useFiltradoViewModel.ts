import { useEffect, useState } from "react";
import { Producto } from "@/types/types";
import {
  fetchYFiltrarProductos,
  agregarAlCarrito,
  calcularPrecioFinal,
} from "./filtrado_de_busqueda";

type Origen = "hervido" | "jugo";

export function useFiltradoViewModel() {
  const [filtradosHervidos, setFiltradosHervidos] = useState<Producto[]>([]);
  const [filtradosJugos, setFiltradosJugos] = useState<Producto[]>([]);
  const [query, setQuery] = useState<string>("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cantidades");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Función para cargar la query y ciudad desde URL y localStorage
  const cargarParametrosIniciales = () => {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get("query") || "";
    setQuery(busqueda);

    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadGuardada) setCiudadSeleccionada(ciudadGuardada);

    return { busqueda, ciudadGuardada };
  };

  // Función para cargar productos filtrados
  const cargarProductosFiltrados = async (busqueda: string, ciudad: string) => {
    const [hervidos, jugos] = await fetchYFiltrarProductos(busqueda, ciudad);
    setFiltradosHervidos(hervidos);
    setFiltradosJugos(jugos);
    setCargando(false);
  };

  // useEffect para inicializar query, ciudad y productos
  useEffect(() => {
    const { busqueda, ciudadGuardada } = cargarParametrosIniciales();

    if (!busqueda || !ciudadGuardada) return;

    cargarProductosFiltrados(busqueda, ciudadGuardada);
  }, []);

  // useEffect para sincronizar cantidades en localStorage
  useEffect(() => {
    localStorage.setItem("cantidades", JSON.stringify(cantidades));
  }, [cantidades]);

  // Función para agregar o quitar productos del carrito y actualizar cantidades
  const agregarProducto = (
    producto: Producto,
    origen: Origen,
    cantidad: number,
  ) => {
    agregarAlCarrito(producto, origen, cantidad);
    const keyId = `${origen}-${producto.id_producto}`;

    setCantidades((prev) => {
      const updated = { ...prev };

      if (cantidad < 0 && (prev[keyId] || 0) + cantidad <= 0) {
        delete updated[keyId];
      } else {
        updated[keyId] = (prev[keyId] || 0) + cantidad;
      }

      return updated;
    });
  };

  // Mapear productos hervidos para enriquecer con cantidad y precio calculado
  const productosHervidosRender = filtradosHervidos.map((producto) => {
    const origen: Origen = "hervido";
    const keyId = `${origen}-${producto.id_producto}`;
    const cantidad = cantidades[keyId] || 0;
    const { precioFinal, precioOriginal } = calcularPrecioFinal(producto);

    return {
      ...producto,
      keyId,
      cantidad,
      precioFinal,
      precioOriginal,
      origen,
    };
  });

  // Mapear productos jugos para enriquecer con cantidad y precio calculado
  const productosJugosRender = filtradosJugos.map((producto) => {
    const origen: Origen = "jugo";
    const keyId = `${origen}-${producto.id_producto}`;
    const cantidad = cantidades[keyId] || 0;
    const { precioFinal, precioOriginal } = calcularPrecioFinal(producto);

    return {
      ...producto,
      keyId,
      cantidad,
      precioFinal,
      precioOriginal,
      origen,
    };
  });

  return {
    filtradosHervidos,
    filtradosJugos,
    productosHervidosRender,
    productosJugosRender,
    query,
    cargando,
    cantidades,
    agregarProducto,
    calcularPrecioFinal,
  };
}

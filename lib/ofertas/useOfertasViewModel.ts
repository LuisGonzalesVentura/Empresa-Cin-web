import { useEffect, useState } from "react";
import {
  Producto,
  Ciudad,
  ProductoConCategoria,
  Categoria,
} from "@/types/types";
import {
  agregarAlCarrito,
  ordenarProductos,
  calcularPrecioFinal,
  inicializarCantidades,
} from "./logica_ofertas";
import {
  obtenerProductosHervidos,
  obtenerProductosJugos,
  obtenerMerchandising,
  obtenerCiudades,
} from "@/services/productoService";

export function useOfertasViewModel() {
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [merchandising, setMerchandising] = useState<Producto[]>([]);
  const [hervidos, setHervidos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(
    inicializarCantidades,
  );
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Destacados");

  const cargarDatosIniciales = async () => {
    const savedCantidades = localStorage.getItem("cantidades");
    if (savedCantidades) setCantidades(JSON.parse(savedCantidades));

    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadGuardada) setCiudadSeleccionada(ciudadGuardada);

    try {
      const [h, j, m, c] = await Promise.all([
        obtenerProductosHervidos(),
        obtenerProductosJugos(),
        obtenerMerchandising(),
        obtenerCiudades(),
      ]);

      setHervidos(h);
      setJugos(j);
      setMerchandising(m);
      setCiudades(c);
    } catch (error) {
      console.error("Error al cargar productos o ciudades:", error);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    localStorage.setItem("cantidades", JSON.stringify(cantidades));
  }, [cantidades]);

  const handleFilterChange = (filtro: string) => {
    setSelectedFilter(filtro);
    setMenuOpen(false);
  };

  const productosCombinados: ProductoConCategoria[] = [
    ...hervidos.map((p) => ({
      ...p,
      categoria: "hervido" as Categoria,
      precio: Number(p.precio),
      descuento: Number(p.descuento),
    })),
    ...merchandising.map((p) => ({
      ...p,
      categoria: "merchandising" as Categoria,
      precio: Number(p.precio),
      descuento: Number(p.descuento),
    })),
    ...jugos.map((p) => ({
      ...p,
      categoria: "jugo" as Categoria,
      precio: Number(p.precio),
      descuento: Number(p.descuento),
    })),
  ].filter((p) => p.nombre_ciudad === ciudadSeleccionada && p.descuento > 0);

  const productosFiltrados = ordenarProductos(productosCombinados, selectedFilter);

  const incrementarCantidad = (key: string, producto: ProductoConCategoria) => {
    agregarAlCarrito(producto, producto.categoria, 1);
    setCantidades((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const decrementarCantidad = (key: string, producto: ProductoConCategoria) => {
    const nuevaCantidad = (cantidades[key] || 1) - 1;
    agregarAlCarrito(producto, producto.categoria, -1);
    setCantidades((prev) => {
      const updated = { ...prev };
      if (nuevaCantidad <= 0) delete updated[key];
      else updated[key] = nuevaCantidad;
      return updated;
    });
  };

  return {
    productosFiltrados,
    cantidades,
    selectedFilter,
    menuOpen,
    setMenuOpen,
    handleFilterChange,
    incrementarCantidad,
    decrementarCantidad,
    calcularPrecioFinal,
  };
}

// /lib/home/home_viewmodel.ts

import { useState, useEffect } from "react";
import { Producto, Ciudad } from "@/types/types";
import {
  inicializarCantidades,
  manejarCargaInicial,
  manejarCarrito,
  verificarCarritoGuardado,
} from "@/lib/home/logica_home";

export function useHomeViewModel() {
  const [current, setCurrent] = useState(0);
  const [jugos, setJugos] = useState<Producto[]>([]);
  const [hervidos, setHervidos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>(
    inicializarCantidades,
  );
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  useEffect(() => {
    manejarCargaInicial({
      setJugos,
      setHervidos,
      setCiudades,
      setCargando,
      setCiudadSeleccionada,
    });

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("cantidades", JSON.stringify(cantidades));
  }, [cantidades]);

  useEffect(() => {
    verificarCarritoGuardado();
  }, []);

  const goToNext = () => setCurrent((prev) => (prev + 1) % 3);
  const goToPrev = () => setCurrent((prev) => (prev - 1 + 3) % 3);

  const agregarAlCarrito = (
    producto: Producto,
    origen: "hervido" | "jugo",
    cantidad: number = 1,
  ) => {
    manejarCarrito(producto, origen, cantidad);
  };

  return {
    current,
    setCurrent,
    jugos,
    hervidos,
    cantidades,
    setCantidades,
    ciudadSeleccionada,
    setCiudadSeleccionada,
    ciudades,
    cargando,
    goToNext,
    goToPrev,
    agregarAlCarrito,
  };
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ciudad, ProductoCarrito } from "@/types/types";
import { obtenerCiudades } from "@/services/productoService";

export function useNavbarLogic() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cantidades, setCantidades] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cantidades");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const router = useRouter();

  const inicializarEstado = async () => {
    setIsClient(true);

    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadGuardada) {
      setCiudadSeleccionada(ciudadGuardada);
    } else {
      setMostrarAlerta(true);
    }

    try {
      const ciudades = await obtenerCiudades();
      setCiudades(ciudades);
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
    }

    const carritoLocal = localStorage.getItem("carrito");
    if (carritoLocal) {
      try {
        const carrito: ProductoCarrito[] = JSON.parse(carritoLocal);
        setCantidadTotal(carrito.reduce((acc, item) => acc + item.cantidad, 0));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCarritoActualizado = (e: any) => {
    setCantidadTotal(e.detail.cantidadTotal);
  };

  const handleStorageChange = () => {
    const actualizado = localStorage.getItem("carrito");
    if (actualizado) {
      try {
        const carrito: ProductoCarrito[] = JSON.parse(actualizado);
        setCantidadTotal(carrito.reduce((acc, item) => acc + item.cantidad, 0));
      } catch {
        setCantidadTotal(0);
      }
    } else {
      setCantidadTotal(0);
    }
  };

  const cargarNombre = () => {
    const userSession = sessionStorage.getItem("usuario");
    if (userSession) {
      try {
        setUserName(JSON.parse(userSession).nombre);
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  useEffect(() => {
    inicializarEstado();
    cargarNombre();

    window.addEventListener("carritoActualizado", handleCarritoActualizado);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("usuarioChanged", cargarNombre);
    document.addEventListener("visibilitychange", cargarNombre);

    return () => {
      window.removeEventListener("carritoActualizado", handleCarritoActualizado);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usuarioChanged", cargarNombre);
      document.removeEventListener("visibilitychange", cargarNombre);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cantidades", JSON.stringify(cantidades));
    }
  }, [cantidades]);

  const handleSeleccionCiudad = (nombre: string) => {
    localStorage.removeItem("carrito");
    localStorage.removeItem("cantidades");
    setCiudadSeleccionada(nombre);
    setMostrarAlerta(false);
    localStorage.setItem("ciudadSeleccionada", nombre);
    window.location.reload();
  };

  const handleCarritoClick = () => router.push("/dashboard/carrito");

  const handleUserClick = () => {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
      router.push("/dashboard/login/dashboard_login");
    } else {
      router.push("/dashboard/login");
    }
  };

  return {
    ciudades,
    ciudadSeleccionada,
    setCiudadSeleccionada,
    mostrarAlerta,
    setMostrarAlerta,
    cantidadTotal,
    userName,
    isClient,
    handleSeleccionCiudad,
    handleCarritoClick,
    handleUserClick,
  };
}

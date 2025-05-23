import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PromocionesMap = {
  [key: string]: {
    nombre: string;
    promociones: string[];
  };
};

const promocionesPorCiudad: PromocionesMap = {
  cochabamba: { nombre: "Cochabamba", promociones: ["Promo 1", "Promo 2"] },
  "la paz-el alto": { nombre: "La Paz / El Alto", promociones: [] },
  "santa cruz": { nombre: "Santa Cruz", promociones: [] },
  oruro: { nombre: "Oruro", promociones: [] },
  potosí: { nombre: "Potosí", promociones: [] },
  sucre: { nombre: "Sucre", promociones: [] },
};

export function usePromocionesCiudadViewModel() {
  const params = useParams() as Record<string, string>;
  const departamento = decodeURIComponent(
    params.departamento || "",
  ).toLowerCase();
  const dataCiudad = promocionesPorCiudad[departamento];

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (dataCiudad && dataCiudad.promociones.length === 0) {
      setMostrarModal(true);
    }
  }, [departamento]);

  return {
    dataCiudad,
    mostrarModal,
    setMostrarModal,
  };
}

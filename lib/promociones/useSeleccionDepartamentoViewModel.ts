// /lib/promociones/useSeleccionDepartamentoViewModel.ts
export function useSeleccionDepartamentoViewModel() {
  const departamentos = [
    { nombre: "La Paz-El alto", emoji: "🏔️" },
    { nombre: "Santa Cruz", emoji: "🌴" },
    { nombre: "Cochabamba", emoji: "🎉" },
    { nombre: "Oruro", emoji: "🎭" },
    { nombre: "Potosí", emoji: "⛰️" },
    { nombre: "Sucre", emoji: "🏛️" },
  ];

  return { departamentos };
}

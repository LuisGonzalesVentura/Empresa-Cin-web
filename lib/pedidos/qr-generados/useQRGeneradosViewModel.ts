import { useState } from "react";
import {
  getQRporFechaBNB,
  generarTokenBNB,
  DetalleQRGenerado,
} from "@/lib/servicios_bnb/api_bnb";

export function useQRGeneradosViewModel() {
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrs, setQrs] = useState<DetalleQRGenerado[]>([]);
  const [detalleQR, setDetalleQR] = useState<any | null>(null);
  const [detalleUsuario, setDetalleUsuario] = useState<any | null>(null);
  const [qrSeleccionado, setQRSeleccionado] = useState<string | number | null>(
    null,
  );

  const buscarQRs = async () => {
    if (!fecha) {
      setError("Debe seleccionar una fecha.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/qrs-generados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha }),
      });

      const data = await response.json();

      if (data.success) {
        setQrs(data.dTOqrDetails);
      } else {
        setError(data.message ?? "Error desconocido al obtener los QRs.");
      }
    } catch (e: any) {
      console.error("Error en buscarQRs:", e);
      setError("Ocurrió un error al obtener los QRs.");
    } finally {
      setLoading(false);
    }
  };

  const verQR = async (qrId: string | number) => {
    if (qrSeleccionado === qrId) {
      // Si ya está seleccionado, lo deseleccionamos para colapsar el detalle
      setQRSeleccionado(null);
      setDetalleQR(null);
      setDetalleUsuario(null);
      return;
    }

    try {
      // 1. Obtener detalle del pedido por qr_id
      const res = await fetch(`/api/pedidos_ver?qr_id=${qrId}`);
      if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
      const data = await res.json();
      setDetalleQR(data);

      // 2. Extraer usuario_id desde el pedido
      const usuarioId = data.pedido?.usuario_id;
      if (usuarioId) {
        // 3. Obtener datos del usuario
        const resUsuario = await fetch(
          `/api/usuario_ver?usuario_id=${usuarioId}`,
        );
        if (!resUsuario.ok)
          throw new Error(`Error al obtener usuario: ${resUsuario.status}`);
        const usuarioData = await resUsuario.json();
        setDetalleUsuario(usuarioData);
      } else {
        setDetalleUsuario(null);
      }

      setQRSeleccionado(qrId);
    } catch (error) {
      console.error("Error al obtener detalles del QR o usuario:", error);
      setDetalleQR(null);
      setDetalleUsuario(null);
      setQRSeleccionado(null);
    }
  };

  return {
    fecha,
    setFecha,
    loading,
    error,
    qrs,
    buscarQRs,
    verQR,
    detalleQR,
    detalleUsuario,
    qrSeleccionado,
  };
}

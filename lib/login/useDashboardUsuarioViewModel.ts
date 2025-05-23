import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Pedido } from "@/types/types";
import {
  handleLogin,
  getStoredUser,
  handleLogout,
} from "@/lib/login/logica_login";
import {
  obtenerPedidosUsuario,
  obtenerEstadoQR,
} from "@/services/productoService";

function prepararPedidosRender(
  pedidos: Pedido[],
  estadosPedidos: Record<string, string>,
  descripcionExpandidaId: number | null,
) {
  return pedidos.map((pedido) => {
    const fechaFormateada = new Date(pedido.fecha_creacion).toLocaleDateString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const mensajeWhatsApp = `Hola, quiero consultar el estado de mi pedido con ID QR ${pedido.qr_id}, realizado el ${fechaFormateada}.`;
    const estadoEnVivo = estadosPedidos[pedido.id];

    let contenidoEstado;
    let clasesEstado;

    if (!estadoEnVivo || estadoEnVivo === "consultando") {
      contenidoEstado = "Consultando...";
      clasesEstado = "bg-yellow-500 text-white";
    } else if (estadoEnVivo.toLowerCase() === "pagado") {
      contenidoEstado = "Pagado";
      clasesEstado = "bg-green-600 text-white";
    } else if (estadoEnVivo.toLowerCase() === "no_pagado") {
      contenidoEstado = "No pagado";
      clasesEstado = "bg-red-600 text-white";
    } else if (estadoEnVivo === "error") {
      contenidoEstado = "Error";
      clasesEstado = "bg-gray-600 text-white";
    } else {
      contenidoEstado = estadoEnVivo;
      clasesEstado = "bg-gray-400 text-white";
    }

    const descripcionReducida =
      descripcionExpandidaId === pedido.id
        ? pedido.descripcion
        : pedido.descripcion.length > 40
          ? `${pedido.descripcion.slice(0, 37)}...`
          : pedido.descripcion;

    return {
      ...pedido,
      fechaFormateada,
      mensajeWhatsApp,
      contenidoEstado,
      clasesEstado,
      descripcionReducida,
      descripcionExpandida: descripcionExpandidaId === pedido.id,
    };
  });
}

export function useDashboardUsuarioViewModel() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("perfil");
  const [user, setUser] = useState<User | null>(null);
  const [descripcionExpandidaId, setDescripcionExpandidaId] = useState<number | null>(null);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [errorPedidos, setErrorPedidos] = useState<string | null>(null);

  const [estadoQR, setEstadoQR] = useState<"pagado" | "no_pagado" | null>(null);
  const [loadingEstadoQR, setLoadingEstadoQR] = useState(false);
  const [errorEstadoQR, setErrorEstadoQR] = useState<string | null>(null);
  const [estadosPedidos, setEstadosPedidos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pedidos.length === 0) return;

    let isMounted = true;

    async function actualizarEstadosPedidos() {
      const nuevosEstados: Record<string, string> = {};

      for (const pedido of pedidos) {
        if (!isMounted) return;
        setEstadosPedidos((prev) => ({ ...prev, [pedido.id]: "consultando" }));

        try {
          const estado = await obtenerEstadoQR(pedido.qr_id);
          nuevosEstados[pedido.id] = estado;
        } catch {
          nuevosEstados[pedido.id] = "error";
        }
      }

      if (isMounted) {
        setEstadosPedidos((prev) => ({ ...prev, ...nuevosEstados }));
      }
    }

    actualizarEstadosPedidos();

    return () => {
      isMounted = false;
    };
  }, [pedidos]);

  useEffect(() => {
    const usuario = getStoredUser();
    if (usuario) {
      setUser(usuario);
      cargarPedidos(usuario.id.toString());
    }
  }, []);

  const cargarPedidos = async (usuarioId: string) => {
    setLoadingPedidos(true);
    setErrorPedidos(null);

    try {
      const pedidos = await obtenerPedidosUsuario(usuarioId);
      setPedidos(pedidos);
    } catch (error: any) {
      setErrorPedidos(error.message || "Error al obtener pedidos");
    } finally {
      setLoadingPedidos(false);
    }
  };

  const login = () => handleLogin(setUser, router);
  const logout = () => handleLogout(router);
  const toggleDescripcion = (id: number) => {
    setDescripcionExpandidaId((prev) => (prev === id ? null : id));
  };

  const pedidosRenderizados = prepararPedidosRender(
    pedidos,
    estadosPedidos,
    descripcionExpandidaId,
  );

  return {
    user,
    selectedOption,
    setSelectedOption,
    login,
    logout,
    pedidos,
    loadingPedidos,
    errorPedidos,
    toggleDescripcion,
    descripcionExpandidaId,
    estadoQR,
    loadingEstadoQR,
    errorEstadoQR,
    estadosPedidos,
    pedidosRenderizados,
  };
}

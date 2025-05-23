import { useEffect, useState } from "react";
import { realizarPedidoApi } from "@/services/pedidoService";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  nombre_factura: string;
  ci_nit: string;
  fecha_nacimiento: string;
  email: string;
  telefono: string;
  tipo_usuario: string;
  ubicacion?: { lat: number; lng: number };
}


export const usePedidoViewModel = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pedido, setPedido] = useState<any | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);


  const guardarImagenQR = () => {
  if (!qr) return;
  const enlace = document.createElement("a");
  enlace.href = `data:image/png;base64,${qr}`;
  enlace.download = "codigo-qr.png";
  enlace.click();
};
  const cargarUsuario = () => {
    const storedUsuario = sessionStorage.getItem("usuario");
    if (storedUsuario) setUsuario(JSON.parse(storedUsuario));
  };

  const cargarProductosDesdeCarrito = () => {
    const carrito = localStorage.getItem("carrito");
    if (!carrito) return;

    try {
      const productosCarrito = JSON.parse(carrito);

      const agrupados: Record<string, any> = {};
      for (const p of productosCarrito) {
        const tipo = p.origen || "producto";
        const key = `${tipo}-${p.id_producto}`;
        if (!agrupados[key]) {
          agrupados[key] = { ...p, tipo };
        } else {
          agrupados[key].cantidad += p.cantidad;
        }
      }

      const productosUnificados = Object.values(agrupados);
      setProductos(productosUnificados);

      const totalConDescuento = productosUnificados.reduce(
        (acc: number, p: any) => {
          const precioFinal = p.descuento
            ? p.precio - (p.precio * p.descuento) / 100
            : p.precio;
          return acc + precioFinal * p.cantidad;
        },
        0,
      );

      setTotal(totalConDescuento);
    } catch (error) {
      console.error("Error al cargar productos del carrito:", error);
    }
  };

  const reiniciarTemporizador = () => {
    if (qr) setTimeLeft(600);
  };

  const manejarTemporizador = () => {
    if (!qr || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  useEffect(() => {
    cargarProductosDesdeCarrito();
  }, []);

  useEffect(() => {
    reiniciarTemporizador();
  }, [qr]);

  useEffect(manejarTemporizador, [qr, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const actualizarUbicacion = (latlng: { lat: number; lng: number }) => {
    setUbicacion(latlng);
    if (usuario) {
      setUsuario({ ...usuario, ubicacion: latlng });
    }
  };

  const realizarPedido = async () => {
    if (!usuario || productos.length === 0 || !ubicacion || !direccion) {
      alert("Faltan datos para realizar el pedido");
      return;
    }

    const descripcion = productos
      .map((p) => {
        const precioFinal = p.descuento
          ? p.precio - (p.precio * p.descuento) / 100
          : p.precio;
        return `${p.cantidad}x ${p.nombre_producto.trim()}. Bs ${precioFinal.toFixed(2)} ${p.descuento ? `(desc ${p.descuento}%)` : ""}`;
      })
      .join("\n");

    const ubicacion_maps = `${ubicacion.lat.toFixed(5)}, ${ubicacion.lng.toFixed(5)}`;

    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 10 * 60 * 1000);
    const expirationDate = expiracion.toISOString();

    const datosQR = {
      currency: "BOB",
      gloss: `Reserva ${usuario.id}`,
      amount: total,
      singleUse: true,
      expirationDate,
      additionalData: descripcion,
      destinationAccountId: "1",
    };

    const payload = {
      usuario_id: usuario.id,
      descripcion,
      monto_total: total,
      ubicacion_texto: direccion,
      ubicacion_maps,
      datosQR,
    };

    try {
      const data = await realizarPedidoApi(payload);
      setPedido(data.pedido);
      setQr(data.qr);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al procesar el pedido");
    }
  };

  return {
    usuario,
    direccion,
    setDireccion,
    ubicacion,
    actualizarUbicacion,
    productos,
    total,
    pedido,
    qr,
    realizarPedido,
    timeLeft,
    formatTime,
    guardarImagenQR,
  };
};

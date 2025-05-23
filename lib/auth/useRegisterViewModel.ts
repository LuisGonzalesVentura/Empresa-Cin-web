import { useState, useEffect } from "react";
import supabase from "../supabase";
import Swal from "sweetalert2";

export function useRegisterViewModel() {
  const [loading, setLoading] = useState(false);

  // Función para manejar login con Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      mostrarErrorLoginGoogle(error);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar alerta de error en login con Google
  const mostrarErrorLoginGoogle = (error: unknown) => {
    console.error("Error al iniciar sesión con Google:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al iniciar sesión con Google. Por favor, intenta nuevamente.",
      customClass: {
        popup: "rounded-lg p-4 text-sm",
        title: "text-xl font-semibold text-orange-600",
        confirmButton:
          "bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md",
      },
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
    });
  };

  // Función que configura el listener de autenticación y maneja sesión inicial
  const configurarAuthListener = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          guardarDatosUsuarioSesion(session);
        } else {
          limpiarDatosUsuarioSesion();
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  };

  // Guardar datos relevantes del usuario en sessionStorage
  const guardarDatosUsuarioSesion = (session: any) => {
    const user = session.user;
    const userData = {
      id: user.id,
      email: user.email,
      nombre: user.user_metadata?.nombre || "Null",
      apellido: user.user_metadata?.apellido || "Apellido desconocido",
      nombre_factura:
        user.user_metadata?.nombre_factura || "Nombre de factura desconocido",
      ci_nit: user.user_metadata?.ci_nit || "CI/NIT desconocido",
      fecha_nacimiento:
        user.user_metadata?.fecha_nacimiento || "Fecha desconocida",
      telefono: user.user_metadata?.telefono || "Teléfono desconocido",
      tipo_usuario: user.user_metadata?.tipo_usuario || "invitado",
      fecha_creacion: user.created_at,
    };

    sessionStorage.setItem("usuario", JSON.stringify(userData));
    sessionStorage.setItem("accessToken", session.access_token || "");
  };

  // Limpiar datos de usuario en sessionStorage
  const limpiarDatosUsuarioSesion = () => {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("accessToken");
  };

  useEffect(() => {
    configurarAuthListener();
  }, []);

  return {
    loading,
    handleGoogleLogin,
  };
}

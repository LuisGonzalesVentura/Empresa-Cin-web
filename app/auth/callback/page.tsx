"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabase";
import { Loader2 } from "lucide-react";

async function verificarUsuario(router: ReturnType<typeof useRouter>) {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const access_token = hashParams.get("access_token");
  const refresh_token = hashParams.get("refresh_token");

  if (!access_token || !refresh_token) {
    console.error("No se encontraron tokens en el hash de la URL.");
    router.push("/dashboard/login");
    return;
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (sessionError) {
    console.error("Error al establecer la sesión:", sessionError);
    router.push("/dashboard/login");
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error al obtener el usuario:", error);
      router.push("/dashboard/login");
      return;
    }

    const { data: userData, error: queryError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", user.id)
      .single();

    if (queryError && queryError.code !== "PGRST116") {
      console.error("Error al consultar la tabla usuarios:", queryError);
      return;
    }

    if (!userData) {
      router.push("/dashboard/completar-datos");
    } else {
      sessionStorage.setItem(
        "usuario",
        JSON.stringify({
          id: user.id,
          email: user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          nombre_factura: userData.nombre_factura,
          ci_nit: userData.ci_nit,
          fecha_nacimiento: userData.fecha_nacimiento,
          telefono: userData.telefono,
          tipo_usuario: userData.tipo_usuario,
        }),
      );

      router.push("/dashboard");
    }
  } catch (err) {
    console.error("Error inesperado:", err);
    router.push("/dashboard/login");
  }
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    verificarUsuario(router);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-700">
      <Loader2 className="animate-spin w-8 h-8 text-orange-500 mb-4" />
      <p className="text-base font-medium">
        Verificando tu información, por favor espera...
      </p>
    </div>
  );
}

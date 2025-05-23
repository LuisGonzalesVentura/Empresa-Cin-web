import { useState, useEffect } from "react";
import supabase from "lib/supabase";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FormData } from "..../../../types/types";

export function useCompletarDatosViewModel() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    nombre_factura: "",
    ci_nit: "",
    fecha_nacimiento: "",
    telefono: "",
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener usuario actual de Supabase
  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error al obtener el usuario:", error);
      router.push("/dashboard/login");
      return;
    }
    setUserId(user.id);
  };

  useEffect(() => {
    fetchUser();
  }, [router]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no autenticado.",
      });
      return;
    }

    const { error } = await supabase.from("usuarios").insert({
      id: userId,
      ...form,
    });

    if (error) {
      console.error("Error al guardar datos:", error);
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la información. Intenta nuevamente.",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Datos guardados correctamente",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "rounded-xl p-6 text-sm",
        title: "text-xl font-semibold text-green-600",
        confirmButton:
          "bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md",
      },
    });

    router.push("/dashboard");
  };

  return { form, handleChange, handleSubmit };
}

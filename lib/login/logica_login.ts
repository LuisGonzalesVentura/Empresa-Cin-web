// logica_login.ts
import { User } from "@/types/types";
import Swal from "sweetalert2";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getStoredUser = (): User | null => {
  const user = sessionStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const handleLogin = async (
  setUser: (user: User) => void,
  router: AppRouterInstance,
) => {
  try {
    const response = await fetch("/api/login");
    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("usuario", JSON.stringify(data.user));
      setUser(data.user);

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido a tu cuenta.",
      });

      router.push("/dashboard/login/dashboard_login");
    } else {
      throw new Error("Fallo al iniciar sesión");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al iniciar sesión.",
    });
  }
};

export const handleLogout = (router: AppRouterInstance) => {
  Swal.fire({
    title: "¿Cerrar sesión?",
    text: "¿Seguro que quieres salir?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "rounded-xl p-6 text-sm",
      title: "text-xl font-semibold text-red-600",
      confirmButton:
        "bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.removeItem("usuario");
      window.dispatchEvent(new CustomEvent("usuarioChanged"));
      router.push("/dashboard/login");
    }
  });
};

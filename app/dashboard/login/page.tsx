// app/login/register/page.tsx
"use client";
import { FcGoogle } from "react-icons/fc";
import { useRegisterViewModel } from "../../../lib/auth/useRegisterViewModel";

export default function RegisterForm() {
  const { loading, handleGoogleLogin } = useRegisterViewModel();

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-xl px-8 py-10 mt-12">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-4">
          ¡Bienvenido!
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Inicia sesión o crea tu cuenta rápidamente con Google
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-md text-white font-semibold transition duration-300
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 shadow-md"}`}
        >
          <FcGoogle size={24} />
          {loading ? "Cargando..." : "Continuar con Google"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Tu información está segura y no será compartida sin tu consentimiento.
        </div>
      </div>
    </div>
  );
}

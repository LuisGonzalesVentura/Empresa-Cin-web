"use client";

import { useCompletarDatosViewModel } from "@/lib/completar-datos/useCompletarDatosViewModel";

export default function CompletarDatosPage() {
  const { form, handleChange, handleSubmit } = useCompletarDatosViewModel();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">
          Completa tus datos
        </h2>

        {[
          { name: "nombre", label: "Nombre" },
          { name: "apellido", label: "Apellido" },
          { name: "nombre_factura", label: "Nombre de Factura" },
          { name: "ci_nit", label: "CI/NIT" },
          {
            name: "fecha_nacimiento",
            label: "Fecha de Nacimiento",
            type: "date",
          },
          { name: "telefono", label: "Teléfono" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name} className="mb-4">
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

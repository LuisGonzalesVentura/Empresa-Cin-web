"use client";
import { useState, useEffect } from "react";
import { ContactoFormData } from "@/types/types";

export const useContactoForm = () => {
  const [formData, setFormData] = useState<ContactoFormData>({
    nombre: "",
    correo: "",
    mensaje: "",
    numeroReferencia: "",
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setCargando(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, correo, mensaje, numeroReferencia } = formData;

    const asunto = encodeURIComponent(`Mensaje de ${nombre}`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\nNúmero de Referencia: ${numeroReferencia}\n\nMensaje:\n${mensaje}`,
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@industriascin.com&su=${asunto}&body=${cuerpo}`;

    window.open(gmailUrl, "_blank");
  };

  return { formData, handleChange, handleSubmit, cargando };
};

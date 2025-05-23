import { useState, useEffect } from "react";
import { Producto, Ciudad } from "@/types/types";
import {
  getCiudades,
  getProductosHervidos,
  postProductoHervidos,
} from "@/services/productoService";

export const useHervidosViewModel = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descuento, setDescuento] = useState("");
  const [idCiudad, setIdCiudad] = useState<number | "">("");
  const [foto, setFoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<
    "nombre_producto" | "precio" | "descuento" | "nombre_ciudad"
  >("nombre_producto");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [productosData, ciudadesData] = await Promise.all([
        getProductosHervidos(),
        getCiudades(),
      ]);
      setProductos(productosData);
      setCiudades(ciudadesData);
    } catch (err) {
      setError("Error al cargar hervidos o ciudades.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !precio || !idCiudad || !foto) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_producto_hervidos", nombre);
    formData.append("precio_hervidos", precio);
    formData.append("descuento_hervidos", descuento || "0");
    formData.append("id_ciudad_hervidos", idCiudad.toString());
    formData.append("foto_hervidos", foto);

    try {
      const nuevoProducto = await postProductoHervidos(formData);
      setProductos((prev) => [...prev, nuevoProducto]);
      resetFormulario();
      alert("¡Producto hervido agregado exitosamente!");
    } catch (err) {
      setError("Hubo un problema al enviar los datos. Intenta más tarde.");
    }
  };

  const resetFormulario = () => {
    setNombre("");
    setPrecio("");
    setDescuento("");
    setIdCiudad("");
    setFoto(null);
    setError(null);
  };

  const handleSort = (key: typeof sortKey) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
  };

  const filteredProducts = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return {
    nombre,
    setNombre,
    precio,
    setPrecio,
    descuento,
    setDescuento,
    idCiudad,
    setIdCiudad,
    foto,
    setFoto,
    loading,
    error,
    ciudades,
    handleSubmit,
    searchTerm,
    setSearchTerm,
    handleSort,
    productos: sortedProducts,
  };
};

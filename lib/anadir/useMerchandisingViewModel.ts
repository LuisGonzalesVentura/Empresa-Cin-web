import { useState, useEffect } from "react";
import { Producto, Ciudad } from "@/types/types";
import {
  getProductosMerchandising,
  getCiudades,
  postProductoMerchandising,
} from "@/services/productoService";

export const useMerchandisingViewModel = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [nombreProducto, setNombreProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [descuento, setDescuento] = useState("");
  const [ciudad, setCiudad] = useState<number | "">("");
  const [foto, setFoto] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"nombre_producto" | "precio" | "descuento" | "nombre_ciudad">("nombre_producto");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [productosData, ciudadesData] = await Promise.all([
        getProductosMerchandising(),
        getCiudades(),
      ]);
      setProductos(productosData);
      setCiudades(ciudadesData);
    } catch (err) {
      setError("Error al cargar datos iniciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMerchandising = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProducto || !precio || !ciudad || !foto) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_producto", nombreProducto);
    formData.append("precio", precio.toString());
    formData.append("descuento", descuento || "0");
    formData.append("id_ciudad", ciudad.toString());
    formData.append("foto", foto);

    try {
      const nuevo = await postProductoMerchandising(formData);
      setProductos((prev) => [...prev, nuevo]);
      resetForm();
      alert("Producto de merchandising agregado exitosamente");
    } catch (err) {
      setError("Ocurrió un error al insertar el producto.");
    }
  };

  const resetForm = () => {
    setNombreProducto("");
    setPrecio("");
    setDescuento("");
    setCiudad("");
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
    productos,
    ciudades,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortedProducts,
    handleSubmitMerchandising,
    nombreProducto,
    setNombreProducto,
    precio,
    setPrecio,
    descuento,
    setDescuento,
    ciudad,
    setCiudad,
    foto,
    setFoto,
  };
};

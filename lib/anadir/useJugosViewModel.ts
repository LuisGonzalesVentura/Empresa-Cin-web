import { useState, useEffect } from "react";
import { Producto, Ciudad } from "@/types/types";
import {
  getProductosJugos,
  getCiudades,
  postProductoJugos,
} from "@/services/productoService";

export const useJugosViewModel = () => {
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
        getProductosJugos(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProducto || !precio || !ciudad || !foto) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_producto", nombreProducto);
    formData.append("precio", precio);
    formData.append("descuento", descuento || "0");
    formData.append("ciudad", ciudad.toString());
    formData.append("foto", foto);

    try {
      const nuevo = await postProductoJugos(formData);
      setProductos((prev) => [...prev, nuevo]);
      resetForm();
      alert("Producto agregado exitosamente");
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

  const filteredProducts = productos.filter((producto) =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
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
    productos: sortedProducts,
    ciudades,
    loading,
    error,
    searchTerm,
    setSearchTerm,
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
    handleSubmit,
    handleSort,
  };
};

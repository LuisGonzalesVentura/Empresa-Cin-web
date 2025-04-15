"use client";
import React, { createContext, useContext, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

type CarritoContextType = {
  carrito: Producto[];
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  total: number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarProducto = (producto: Producto) => {
    console.log("Producto añadido al carrito:", producto);
  
    setCarrito((prev) => {
      const existente = prev.find(p => p.id === producto.id);
      if (existente) {
        return prev; // Evitamos duplicados si no usamos cantidad
      } else {
        return [...prev, producto];
      }
    });
  };
  

  const eliminarProducto = (id: number) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, eliminarProducto, vaciarCarrito, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};

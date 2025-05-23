export interface ProductoCarrito {
  id_producto: number;
  nombre_producto: string;
  descuento: number;
  cantidad: number;
  precio: number;
  foto: string;
  origen: string;
}

export interface ContactoFormData {
  nombre: string;
  correo: string;
  mensaje: string;
  numeroReferencia: string;
}

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento: number;
  foto: string;
  id_ciudad: number;
  nombre_ciudad: string;
  precioFinal: number;
}

export interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
}
export type Categoria = "hervido" | "jugo" | "merchandising";

export interface ProductoConCategoria extends Producto {
  categoria: Categoria;
}

export interface FormData {
  nombre: string;
  apellido: string;
  nombre_factura: string;
  ci_nit: string;
  fecha_nacimiento: string;
  telefono: string;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombre_factura: string;
  ci_nit: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  tipo_usuario: string;
  fecha_creacion: string;
}

export interface PedidoInput {
  usuario_id: string;
  descripcion: string;
  monto_total: number;
  ubicacion_texto: string;
  ubicacion_maps: string;
}

export interface ProductoAgrupadoPorVolumen {
  volumen: string;
  productos: {
    producto: Producto;
    cantidad: number;
    precioFinal: string;
    precioOriginal: string;
  }[];
}
export interface Pedido {
  id: number;
  descripcion: string;
  qr_id: number;
  fecha_creacion: string;
  monto_total: number;
  // agrega otros campos que uses
}
export interface DatosQR {
  currency: string;
  gloss: string;
  amount: number;
  singleUse: boolean;
  expirationDate: string;
  additionalData: string;
  destinationAccountId: string;
}

export interface PedidoPayload {
  usuario_id: string;
  descripcion: string;
  monto_total: number;
  ubicacion_texto: string;
  ubicacion_maps: string;
  datosQR: DatosQR;
}
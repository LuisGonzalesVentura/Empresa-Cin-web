// /lib/servicios_bnb/api_bnb.ts

// --- Interfaces ---
export interface DatosQR {
  currency: "BOB" | "USD";
  gloss: string; // Ej: "Reserva 123"
  amount: number; // Ej: 50
  singleUse: boolean;
  expirationDate: string; // Formato "YYYY-MM-DD"
  additionalData?: string;
  destinationAccountId: "1" | "2"; // 1 = moneda nacional, 2 = extranjera
}
export interface EstadoQR {
  id: number;
  statusId: number; // 1=No Usado; 2=Usado; 3=Expirado; 4=Con error
  expirationDate: string;
  voucherId: string | null;
  success: boolean;
  message: string | null;
}
export interface RespuestaQR {
  id: string;
  qr: string; // Imagen en base64 (array de bytes)
  success: boolean;
  message: string | null;
}

export interface DetalleQRGenerado {
  id: number;
  amount: number;
  currency: string;
  generationDate: string;
  expirationDate: string;
  statusId: number;
  transactionDate: string;
  sourceBank: string | null;
  gloss: string;
  destinationAccountNumber: number;
  notificationSuccess: boolean;
  notificationResponse: string | null;
  voucherId: string | null;
}

export interface RespuestaQRGenerados {
  dTOqrDetails: DetalleQRGenerado[];
  success: boolean;
  message: string | null;
}
// --- Generar token (autenticación BNB) ---
export async function generarTokenBNB(): Promise<string> {
  const response = await fetch(
    "http://test.bnb.com.bo/ClientAuthentication.API/api/v1/auth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: "vAOQyCSAqRKHvtSyBcpumg==",
        authorizationId: "IndustriasCin2025#*",
      }),
    },
  );
  const raw = await response.text(); 

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al generar el token BNB:", errorText);
    throw new Error("No se pudo generar el token del BNB");
  }

  const data = JSON.parse(raw); 

  if (!data.success || !data.message) {
    throw new Error("Respuesta inválida al generar token del BNB");
  }

  return data.message; // JWT token
}

// --- Generar QR con imagen ---
export async function generarQRConImagenBNB(
  token: string,
  datos: DatosQR,
): Promise<RespuestaQR> {
  const response = await fetch(
    "http://test.bnb.com.bo/QRSimple.API/api/v1/main/getQRWithImageAsync",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al generar QR:", errorText);
    throw new Error("No se pudo generar el QR");
  }

  const data = await response.json();
  return data as RespuestaQR;
}

// --- Obtener QRs generados en una fecha específica ---
export async function getQRporFechaBNB(
  token: string,
  fecha: string,
): Promise<RespuestaQRGenerados> {
  const response = await fetch(
    "http://test.bnb.com.bo/QRSimple.API/api/v1/main/getQRbyGenerationDateAsync",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ generationDate: fecha }),
    },
  );

  const raw = await response.text();

  if (!response.ok) {
    console.error(" Error al obtener QRs por fecha:", raw);
    throw new Error("No se pudieron obtener los QRs generados");
  }

  const data = JSON.parse(raw);

  if (!data.success) {
    throw new Error(data.message || "Consulta fallida");
  }

  return data as RespuestaQRGenerados;
}

// --- Obtener estado del QR por su ID ---

export async function obtenerEstadoQRporId(
  token: string,
  qrId: number,
): Promise<"Pagado" | "No_pagado"> {
  const response = await fetch(
    "http://test.bnb.com.bo/QRSimple.API/api/v1/main/getQRStatusAsync",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qrId }),
    },
  );

  const raw = await response.text();

  if (!response.ok) {
    console.error("Error al obtener estado del QR:", raw);
    throw new Error("No se pudo consultar el estado del QR");
  }

  const data: EstadoQR = JSON.parse(raw);

  if (!data.success) {
    console.error("Consulta de estado fallida:", data.message);
    throw new Error(data.message || "Consulta fallida");
  }

  return data.statusId === 2 ? "Pagado" : "No_pagado";
}

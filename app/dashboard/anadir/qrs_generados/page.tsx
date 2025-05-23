"use client";

import { useQRGeneradosViewModel } from "@/lib/pedidos/qr-generados/useQRGeneradosViewModel";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

export default function QRGeneradosPage() {
  const {
    fecha,
    setFecha,
    loading,
    error,
    qrs,
    buscarQRs,
    verQR,
    detalleQR,
    detalleUsuario,
    qrSeleccionado,
  } = useQRGeneradosViewModel();
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Consultar QRs generados por fecha
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={buscarQRs}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        <button
          onClick={() =>
            router.push("/dashboard/anadir/qrs_generados/qrs_pagados")
          }
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Ver QRs Pagados
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {qrs.length > 0 ? (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Monto</th>
              <th className="border px-3 py-2">Moneda</th>
              <th className="border px-3 py-2">Fecha Generación</th>
              <th className="border px-3 py-2">Fecha Expiración</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Fecha Transacción</th>
              <th className="border px-3 py-2">Banco Origen</th>
              <th className="border px-3 py-2">Glosa</th>
              <th className="border px-3 py-2">Nº Cuenta Destino</th>
              <th className="border px-3 py-2">Notif. Éxito</th>
              <th className="border px-3 py-2">Resp. Notificación</th>
              <th className="border px-3 py-2">Voucher ID</th>
              <th className="border px-3 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {qrs.map((qr, index) => (
              <React.Fragment key={qr.id ?? index}>
                <tr>
                  <td className="border px-3 py-1">{qr.id ?? "N/A"}</td>
                  <td className="border px-3 py-1">{qr.amount}</td>
                  <td className="border px-3 py-1">{qr.currency}</td>
                  <td className="border px-3 py-1">
                    {qr.generationDate
                      ? format(new Date(qr.generationDate), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </td>
                  <td className="border px-3 py-1">
                    {qr.expirationDate
                      ? format(new Date(qr.expirationDate), "yyyy-MM-dd")
                      : "N/A"}
                  </td>
                  <td className="border px-3 py-1">
                    {qr.statusId === 1
                      ? "No usado"
                      : qr.statusId === 2
                        ? "Usado"
                        : qr.statusId === 4
                          ? "Con error"
                          : "Desconocido"}
                  </td>
                  <td className="border px-3 py-1">
                    {qr.transactionDate &&
                    qr.transactionDate !== "0001-01-01T00:00:00"
                      ? format(new Date(qr.transactionDate), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </td>
                  <td className="border px-3 py-1">{qr.sourceBank ?? "N/A"}</td>
                  <td className="border px-3 py-1">{qr.gloss ?? ""}</td>
                  <td className="border px-3 py-1">
                    {qr.destinationAccountNumber ?? 0}
                  </td>
                  <td className="border px-3 py-1">
                    {qr.notificationSuccess ? "Sí" : "No"}
                  </td>
                  <td className="border px-3 py-1">
                    {qr.notificationResponse ?? "N/A"}
                  </td>
                  <td className="border px-3 py-1">{qr.voucherId ?? "N/A"}</td>
                  <td className="border px-3 py-1 text-center">
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-sm rounded"
                      onClick={() => verQR(qr.id)}
                    >
                      {qrSeleccionado === qr.id ? "Ocultar" : "Ver"}
                    </button>
                  </td>
                </tr>

                {qrSeleccionado === qr.id && detalleQR && (
                  <tr>
                    <td colSpan={14} className="border px-4 py-3 bg-gray-50">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Detalle del Pedido
                        </h3>
                        <p>
                          <strong>ID Pedido:</strong>{" "}
                          {detalleQR.pedido?.id ?? "N/A"}
                        </p>
                        <p>
                          <strong>Usuario ID:</strong>{" "}
                          {detalleQR.pedido?.usuario_id ?? "N/A"}
                        </p>
                        <p>
                          <strong>Total:</strong>{" "}
                          {detalleQR.pedido?.monto_total ?? "N/A"}
                        </p>
                        <p>
                          <strong>QR ID:</strong>{" "}
                          {detalleQR.pedido?.qr_id ?? "N/A"}
                        </p>
                        <p>
                          <strong>Ubicación (texto):</strong>{" "}
                          {detalleQR.pedido?.ubicacion_texto ?? "N/A"}
                        </p>
                        <p>
                          <strong>Ubicación (Maps):</strong>{" "}
                          {detalleQR.pedido?.ubicacion_maps ?? "N/A"}
                        </p>
                        <p>
                          <strong>Fecha de creación:</strong>{" "}
                          {detalleQR.pedido?.fecha_creacion
                            ? new Date(
                                detalleQR.pedido.fecha_creacion,
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                        <p className="mt-2 font-semibold">Descripción:</p>
                        <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                          {detalleQR.pedido?.descripcion ?? ""}
                        </pre>

                        <ul className="list-disc pl-5">
                          {detalleQR.pedido?.productos?.map(
                            (prod: any, idx: number) => (
                              <li key={idx}>
                                {prod.nombre} x {prod.cantidad}
                              </li>
                            ),
                          )}
                        </ul>

                        {/* Aquí mostramos los datos del usuario si existen */}
                        {detalleUsuario && detalleUsuario.usuario && (
                          <>
                            <h3 className="font-semibold text-lg mt-6 mb-2">
                              Detalle del Usuario
                            </h3>
                            <p>
                              <strong>ID Usuario:</strong>{" "}
                              {detalleUsuario.usuario.id ?? "N/A"}
                            </p>
                            <p>
                              <strong>Nombre:</strong>{" "}
                              {detalleUsuario.usuario.nombre ?? "N/A"}
                            </p>
                            <p>
                              <strong>Apellido:</strong>{" "}
                              {detalleUsuario.usuario.apellido ?? "N/A"}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {detalleUsuario.usuario.email ?? "N/A"}
                            </p>

                            <p>
                              <strong>Nombre Factura:</strong>{" "}
                              {detalleUsuario.usuario.nombre_factura ?? "N/A"}
                            </p>
                            <p>
                              <strong>CI/NIT:</strong>{" "}
                              {detalleUsuario.usuario.ci_nit ?? "N/A"}
                            </p>
                            <p>
                              <strong>Fecha de Nacimiento:</strong>{" "}
                              {detalleUsuario.usuario.fecha_nacimiento
                                ? new Date(
                                    detalleUsuario.usuario.fecha_nacimiento,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Teléfono:</strong>{" "}
                              {detalleUsuario.usuario.telefono ?? "N/A"}
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No hay QRs para la fecha seleccionada.</p>
      )}
    </div>
  );
}

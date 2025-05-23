"use client";
import { FaWhatsapp, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { User as UserIcon, Package, LogOut } from "lucide-react";
import { useDashboardUsuarioViewModel } from "../../../../lib/login/useDashboardUsuarioViewModel";
import { InputField } from "@/components/UI/InputField";
import Link from "next/link";
import Head from "next/head";

export default function DashboardUsuario() {
  const {
    user,
    selectedOption,
    setSelectedOption,
    login,
    logout,
    loadingPedidos,
    errorPedidos,
    toggleDescripcion,
    descripcionExpandidaId,
    pedidos,
    estadosPedidos,
    pedidosRenderizados,
  } = useDashboardUsuarioViewModel();

  const menuItems = [
    {
      label: "Mi Perfil",
      value: "perfil",
      icon: <UserIcon size={18} className="mr-2" />,
    },
    {
      label: "Mis Pedidos",
      value: "mis-pedidos",
      icon: <Package size={18} className="mr-2" />,
    },
  ];

  const renderContent = () => {
    if (!user) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Debes iniciar sesión
          </h2>
          <p className="mb-4">
            No has iniciado sesión. Por favor, ingresa con tu cuenta.
          </p>
          <button
            onClick={login}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-200"
            aria-label="Iniciar sesión"
          >
            Iniciar Sesión
          </button>
        </div>
      );
    }

    switch (selectedOption) {
      case "perfil":
        return (
          <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-10">
              <FaUserCircle className="text-orange-500 text-5xl mr-3" />
              <h2 className="text-4xl font-extrabold text-gray-700">
                Mi Perfil
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <InputField label="Nombre" value={user.nombre} />
              <InputField label="Apellido" value={user.apellido} />
              <InputField label="Nombre Factura" value={user.nombre_factura} />
              <InputField label="CI/NIT" value={user.ci_nit} />
              <InputField
                label="Fecha de Nacimiento"
                value={user.fecha_nacimiento}
              />
              <InputField label="Email" value={user.email} />
              <InputField label="Teléfono" value={user.telefono} />
              <InputField label="Tipo de Usuario" value={user.tipo_usuario} />
            </div>
          </div>
        );

      case "mis-pedidos":
        return (
          <section className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Mis Pedidos
            </h2>

            {loadingPedidos && (
              <p className="text-gray-600 italic">Cargando pedidos...</p>
            )}
            {errorPedidos && (
              <p className="text-red-600 font-medium">Error: {errorPedidos}</p>
            )}
            {!loadingPedidos && !errorPedidos && pedidos.length === 0 && (
              <p className="text-gray-700">No tienes pedidos para mostrar.</p>
            )}

            {/* Tabla para pantallas md en adelante */}
            {!loadingPedidos && !errorPedidos && pedidos.length > 0 && (
              <>
                {/* Tabla Desktop */}
                <div className="hidden md:block overflow-x-auto rounded-md border border-gray-300 shadow">
                  <table className="w-full min-w-[900px] text-sm text-gray-800 bg-white">
                    <thead className="bg-orange-500 text-white">
                      <tr>
                        <th className="px-5 py-3 border border-orange-400 max-w-[280px]">
                          Descripción
                        </th>
                        <th className="px-5 py-3 border border-orange-400">
                          QR ID
                        </th>
                        <th className="px-5 py-3 border border-orange-400">
                          Fecha
                        </th>
                        <th className="px-5 py-3 border border-orange-400">
                          Total
                        </th>
                        <th className="px-5 py-3 border border-orange-400 text-center">
                          Estado
                        </th>
                        <th className="px-5 py-3 border border-orange-400 text-center">
                          Consulta
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosRenderizados.map((pedido) => (
                        <tr
                          key={pedido.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td
                            onClick={() => toggleDescripcion(pedido.id)}
                            className="px-4 py-3 border max-w-[280px] cursor-pointer hover:bg-orange-50 transition rounded"
                            title="Haz clic para ver más"
                          >
                            {pedido.descripcionReducida}
                          </td>
                          <td className="text-center px-4 py-3 border">
                            {pedido.qr_id}
                          </td>
                          <td className="text-center px-4 py-3 border">
                            {pedido.fechaFormateada}
                          </td>
                          <td className="text-center px-4 py-3 border">
                            Bs {pedido.monto_total}
                          </td>
                          <td className="text-center px-4 py-3 border">
                            <span
                              className={`px-3 py-1 text-sm rounded-md font-medium ${pedido.clasesEstado}`}
                            >
                              {pedido.contenidoEstado}
                            </span>
                          </td>
                          <td className="text-center px-4 py-3 border">
                            <a
                              href={`https://wa.me/59165334544?text=${encodeURIComponent(pedido.mensajeWhatsApp)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button
                                className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                title="Consultar por WhatsApp"
                              >
                                <FaWhatsapp size={16} />
                                <span className="hidden sm:inline">
                                  WhatsApp
                                </span>
                              </button>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Versión móvil - tarjetas */}
                <div className="md:hidden space-y-4">
                  {pedidosRenderizados.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="border rounded-md shadow-sm p-4 bg-white"
                      onClick={() => toggleDescripcion(pedido.id)}
                    >
                      <p className="font-semibold mb-1">
                        {pedido.descripcionReducida}
                      </p>
                      <p>
                        <strong>QR ID:</strong> {pedido.qr_id}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {pedido.fechaFormateada}
                      </p>
                      <p>
                        <strong>Total:</strong> Bs {pedido.monto_total}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-md text-white font-semibold ${pedido.clasesEstado}`}
                        >
                          {pedido.contenidoEstado}
                        </span>
                      </p>
                      <p className="mt-2">
                        <a
                          href={`https://wa.me/59165334544?text=${encodeURIComponent(pedido.mensajeWhatsApp)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button
                            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                            title="Consultar por WhatsApp"
                          >
                            <FaWhatsapp size={16} />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard Usuario | Mi Perfil</title>
      </Head>

      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br to-white">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-gradient-to-br from-white to-white shadow-2xl rounded-3xl p-6 md:mt-8 md:ml-4 transition-all">
          <div className="flex flex-col items-center mt-6 mb-10">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
              {user ? user.nombre[0] : "U"}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-700 text-center">
              {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              {user?.email}
            </p>
          </div>

          <nav className="flex flex-col gap-4 mt-6">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedOption(item.value)}
                className={`flex items-center ${
                  selectedOption === item.value
                    ? "bg-orange-600"
                    : "bg-orange-500"
                } hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105`}
                aria-label={`Ir a ${item.label}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <button
              onClick={logout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} className="mr-2" />
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Panel derecho */}
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="bg-gradient-to-br from-white to-white rounded-3xl shadow-2xl p-10">
            <div className="flex justify-end mb-6">
              <Link
                href="/dashboard"
                className="text-orange-500 text-lg flex items-center gap-2 font-semibold"
              >
                <FaArrowLeft />
                <span>Volver al inicio</span>
              </Link>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}

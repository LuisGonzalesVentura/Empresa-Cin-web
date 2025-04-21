// app/dashboard/layout.tsx
import Footer from "./Footeer"; // Asegúrate que esté bien escrito
import Navbar from "./Navbar";
import { CarritoProvider } from "./context/CarritoContext";

export const metadata = {
  title: 'Industrias CIN',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <CarritoProvider>
      <main className="flex-1 pt-24 sm:pt-20 md:pt-32"> {/* Ajusta padding en dispositivos móviles y más grandes */}
  {children}
</main>

      </CarritoProvider>

      <Footer />
    </div>
  );
}

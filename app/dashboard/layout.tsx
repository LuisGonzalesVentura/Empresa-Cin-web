import Footer from "./Footeer"; 
import Navbar from "./Navbar";
import { CarritoProvider } from "./context/CarritoContext";
import { UserProvider } from "./context/userContext";  // Importa tu UserProvider

export const metadata = {
  title: 'Industrias CIN',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Envuelve con ambos contextos */}
      <UserProvider>
        <CarritoProvider>
          <main className="flex-1 pt-24 sm:pt-20 md:pt-32">
            {children}
          </main>
        </CarritoProvider>
      </UserProvider>

      <Footer />
    </div>
  );
}

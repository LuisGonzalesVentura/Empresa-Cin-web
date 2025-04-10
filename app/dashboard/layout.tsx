// app/dashboard/layout.tsx
import Footer from "./Footeer"; // Asegúrate que esté bien escrito
import Navbar from "./Navbar";

export const metadata = {
  title: 'Industrias CIN',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

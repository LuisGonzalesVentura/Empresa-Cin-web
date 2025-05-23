import Footer from "./Footeer";
import Navbar from "./Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
/* En tu archivo globals.css o directamente en layout.tsx con import */
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Industrias CIN",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Envuelve con ambos contextos */}
      <main className="flex-1 pt-24 sm:pt-20 md:pt-32">
        {children}
        <Analytics />
        <SpeedInsights />
      </main>

      <Footer />
    </div>
  );
}

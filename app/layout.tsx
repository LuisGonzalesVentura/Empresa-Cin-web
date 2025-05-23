// app/layout.tsx
import "@/components/UI/global.css";

export const metadata = {
  title: "Industrias CIN",
  description: "Bienvenido al panel de Industrias CIN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

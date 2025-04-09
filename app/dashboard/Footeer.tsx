// components/Footer.tsx

import { FaFacebookF, FaWhatsapp, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-orange-500 text-white mt-12">
      <div className="py-10 px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        
        {/* Sección 1 */}
        <div>
          <h3 className="font-bold mb-3">Industrias CIN</h3>
          <ul className="space-y-1">
            <li><Link href="#">Mi Cuenta</Link></li>
            <li><Link href="https://wa.me/59170700290">Seguimiento en línea</Link></li>
            <li><Link href="/dashboard/invoices">Ofertas</Link></li>
          </ul>
        </div>

        {/* Sección 2 */}
        <div>
          <h3 className="font-medium mb-3">Promociones Empresariales</h3>
          <ul className="space-y-1">
            <li><Link href="#">Ganadores de promociones</Link></li>
            <li><Link href="#">Bases legales</Link></li>
          </ul>
        </div>

        {/* Sección 3 */}
        <div>
          <h3 className="font-medium mb-3">Centro de Ayuda</h3>
          <ul className="space-y-1">
            <li><Link href="#">Preguntas frecuentes</Link></li>
            <li><Link href="#">Cobertura</Link></li>
            <li><Link href="#">Covid-19</Link></li>
          </ul>
        </div>

        {/* Sección 4 */}
        <div>
          <h3 className="font-medium   mb-3">Síguenos</h3>
          <div className="flex space-x-4 text-lg">
          <a href="https://www.facebook.com/industriascin.bo/?locale=es_LA" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="cursor-pointer hover:text-black transition" />
          </a>
          <a href="https://wa.me/59170700290" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="cursor-pointer hover:text-black transition" />
         </a>
            <a href="https://www.tiktok.com/@industriascin" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="cursor-pointer hover:text-black transition" />
         </a> 
          </div>
        </div>
      </div>

      <div className="text-center border-t border-white/30 text-xs py-4 px-4">
        © Insdustrias Cin 2025. Todos los Derechos Reservados.{" "}
        <Link href="#" className="font-semibold underline hover:text-black ml-1">Términos y Condiciones</Link> {" | "}
        <Link href="#" className="font-semibold underline hover:text-black ml-1">Políticas de privacidad</Link>
      </div>
    </footer>
  );
}

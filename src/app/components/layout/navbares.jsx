"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiUser, FiClipboard, FiHome, FiLogOut, FiMenu, FiAward, FiActivity } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "@/styles/layouts/navbares.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const indicatorRef = useRef(null); // Referencia para la burbuja
  const menuRef = useRef(null);      // Referencia para el contenedor del menú
  const router = useRouter();
  const pathname = usePathname();

  // Función para mover el indicador
useEffect(() => {
  const activeItem = menuRef.current?.querySelector(".menu-item.active");
  if (activeItem && indicatorRef.current) {
    const { offsetTop } = activeItem;
    // Alineación vertical perfecta con el ítem
    indicatorRef.current.style.top = `${offsetTop}px`;
    indicatorRef.current.style.opacity = "1";
  }
}, [pathname, open]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => router.push("/designs/vistaLogin");

  return (
    <aside className={`sliderstu ${open ? "sliderstu-open" : "sliderstu-closed"}`}>
      <div className="sliderstu-header logo-toggle-container">
        {open && (
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={40} height={40} />
            <span className="designer-text">Eventos ITE</span>
          </div>
        )}
        <button className="sliderstu-toggle-btn" onClick={() => setOpen(!open)}>
          <FiMenu />
        </button>
      </div>

      {/* Añadimos la referencia al ul */}
      <ul className="menu" ref={menuRef}>
        {/* El Indicador (Burbuja) */}
        <div className="nav-indicator" ref={indicatorRef}></div>

        <li className={`menu-item ${pathname === "/designs/menuestu/vistaInicio" ? "active" : ""}`}>
          <Link href="/designs/menuestu/vistaInicio" className="menu-link">
            <FiHome className="icon" />
            {open && <span className="title">Inicio</span>}
          </Link>
        </li>

        <li className={`menu-item ${pathname === "/designs/menuestu" ? "active" : ""}`}>
          <Link href="/designs/menuestu" className="menu-link">
            <FiUser className="icon" />
            {open && <span className="title">Perfil</span>}
          </Link>
        </li>

        <li className={`menu-item ${pathname === "/designs/menuestu/vistaCategorias" ? "active" : ""}`}>
          <Link href="/designs/menuestu/vistaCategorias" className="menu-link">
            <FiClipboard className="icon" />
            {open && <span className="title">Actividades Ofertadas</span>}
          </Link>
        </li>

        <li className={`menu-item ${pathname === "/designs/menuestu/misActividades" ? "active" : ""}`}>
          <Link href="/designs/menuestu/misActividades" className="menu-link">
            <FiActivity className="icon" />
            {open && <span className="title">Mis Actividades</span>}
          </Link>
        </li>

        <li className={`menu-item ${pathname === "/designs/menuestu/misConstancias" ? "active" : ""}`}>
          <Link href="/designs/menuestu/misConstancias" className="menu-link">
            <FiAward className="icon" />
            {open && <span className="title">Constancias</span>}
          </Link>
        </li>

        <li className="menu-item" onClick={handleLogout}>
          <div className="menu-link">
            <FiLogOut className="icon" />
            {open && <span className="title">Cerrar Sesión</span>}
          </div>
        </li>
      </ul>
    </aside>
  );
}
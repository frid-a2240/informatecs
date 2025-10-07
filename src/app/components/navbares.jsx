"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiClipboard,
  FiUserPlus,
  FiHome,
  FiLogOut,
  FiMenu,
  FiCalendar,
  FiAward,
  FiActivity,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import "../styles/navbares.css";
import Image from "next/image";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar inicia cerrado en móvil
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    // Aquí puedes limpiar tokens o redirigir
    alert("Sesión cerrada");
    router.push("/login"); // o a la página que necesites
  };

  return (
    <aside
      className={`sliderstu ${open ? "sliderstu-open" : "sliderstu-closed"}`}
    >
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

      <ul className="menu">
        <li className="menu-item">
          <Link href="/designs/vistaInicio" className="menu-link">
            <FiHome className="icon" />
            {open && <span className="title">Inicio</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/designs/menuestu" className="menu-link">
            <FiUser className="icon" />
            {open && <span className="title">Perfil</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/designs/vistaCategorias" className="menu-link">
            <FiClipboard className="icon" />
            {open && <span className="title">Actividades Ofertadas</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/designs/misActividades" className="menu-link">
            <FiActivity className="icon" />
            {open && <span className="title"> Mis Actividades</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/configuracion" className="menu-link">
            <FiAward className="icon" />
            {open && <span className="title">Constancias/certificados</span>}
          </Link>
        </li>

        <li className="menu-item" onClick={handleLogout}>
          <FiLogOut className="icon" />
          {open && <span className="title">Cerrar Sesión</span>}
        </li>
      </ul>
    </aside>
  );
}

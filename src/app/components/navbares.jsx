"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiUser,
  FiClipboard,
  FiHome,
  FiLogOut,
  FiMenu,
  FiAward,
  FiActivity,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";
import "../styles/navbares.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detecta tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Persistir estado del sidebar
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) setOpen(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", open);
  }, [open]);

  const handleLogout = () => router.push("/designs/vistaLogin");

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
        <li
          className={`menu-item ${
            pathname === "/designs/menuestu/vistaInicio" ? "active" : ""
          }`}
        >
          <Link href="/designs/menuestu/vistaInicio" className="menu-link">
            <FiHome className="icon" />
            {open && <span className="title">Inicio</span>}
          </Link>
        </li>

        <li
          className={`menu-item ${
            pathname === "/designs/menuestu" ? "active" : ""
          }`}
        >
          <Link href="/designs/menuestu" className="menu-link">
            <FiUser className="icon" />
            {open && <span className="title">Perfil</span>}
          </Link>
        </li>

        <li
          className={`menu-item ${
            pathname === "/designs/menuestu/vistaCategorias" ? "active" : ""
          }`}
        >
          <Link href="/designs/menuestu/vistaCategorias" className="menu-link">
            <FiClipboard className="icon" />
            {open && <span className="title">Actividades Ofertadas</span>}
          </Link>
        </li>

        <li
          className={`menu-item ${
            pathname === "/designs/menuestu/misActividades" ? "active" : ""
          }`}
        >
          <Link href="/designs/menuestu/misActividades" className="menu-link">
            <FiActivity className="icon" />
            {open && <span className="title">Mis Actividades</span>}
          </Link>
        </li>

          <li
           className={`menu-item ${
            pathname === "/designs/menuestu/misConstancias" ? "active" : ""  // ✅ CORRECTO
            }`}
>
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

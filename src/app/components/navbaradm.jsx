"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar cerrado por defecto en móvil
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("adminData");
      router.push("/login");
    }
  };

  return (
    <aside className={`sliderbaradm ${open ? "open" : "closed"}`}>
      {/* Encabezado */}
      <div className="sliderbaradm-header">
        {open && (
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={40} height={40} />
            <span className="logo-text">Eventos ITE</span>
          </div>
        )}
        <button className="toggle-btn" onClick={() => setOpen(!open)}>
          <FiMenu />
        </button>
      </div>

      {/* Menú */}
      <ul className="menu">
        <SidebarItem
          href="/admin/dashboard"
          icon={<FiHome />}
          label="Inicio"
          open={open}
        />
        <SidebarItem
          href="/designs/vistaeventosAdm"
          icon={<FiCalendar />}
          label="Gestionar Eventos"
          open={open}
        />
        <SidebarItem
          href="/designs/vistaalumnosadm"
          icon={<FiUsers />}
          label="Usuarios"
          open={open}
        />
        <SidebarItem
          href="/admin/inscripciones"
          icon={<FiFileText />}
          label="Inscripciones"
          open={open}
        />
        <SidebarItem
          href="/admin/reportes"
          icon={<FiBarChart2 />}
          label="Reportes"
          open={open}
        />
        <SidebarItem
          href="/admin/configuracion"
          icon={<FiSettings />}
          label="Configuración"
          open={open}
        />

        <li className="menu-item logout" onClick={handleLogout}>
          <FiLogOut className="icon" />
          {open && <span className="title">Cerrar Sesión</span>}
        </li>
      </ul>
    </aside>
  );
}

function SidebarItem({ href, icon, label, open }) {
  return (
    <li className="menu-item">
      <Link href={href} className="menu-link">
        <span className="icon">{icon}</span>
        {open && <span className="title">{label}</span>}
      </Link>
    </li>
  );
}

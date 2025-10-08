"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("adminData");
      router.push("/designs/vistaLogin");
    }
  };

  const menuItems = [
    { href: "/designs/menuadmin", icon: <FiHome />, label: "Inicio" },
    {
      href: "/designs/vistaeventosAdm",
      icon: <FiCalendar />,
      label: "Gestionar Eventos",
    },
    { href: "/designs/vistaalumnosadm", icon: <FiUsers />, label: "Usuarios" },
    {
      href: "/designs/vistaInscripcionesAdmin",
      icon: <FiFileText />,
      label: "Inscripciones",
    },
    { href: "/admin/reportes", icon: <FiBarChart2 />, label: "Reportes" },
    {
      href: "/admin/configuracion",
      icon: <FiSettings />,
      label: "Configuración",
    },
  ];

  return (
    <aside className={`sliderbaradm ${open ? "open" : "closed"}`}>
      {/* Header */}
      <div className="sliderbaradm-header">
        {open && (
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={40} height={40} />
            <div className="logo-text-container">
              <span className="logo-text">Eventos ITE</span>
              <span className="admin-badge">ADMIN</span>{" "}
              {/* Badge de administrador */}
            </div>
          </div>
        )}
        <button className="toggle-btn" onClick={() => setOpen(!open)}>
          <FiMenu />
        </button>
      </div>

      {/* Menu */}
      <ul className="menu">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            open={open}
            active={pathname === item.href}
          />
        ))}

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

function SidebarItem({ href, icon, label, open, active }) {
  return (
    <li className={`menu-item ${active ? "active" : ""}`}>
      <Link href={href} className="menu-link">
        <span className="icon">{icon}</span>
        {open && <span className="title">{label}</span>}
      </Link>
    </li>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiBook,
  FiClock,
  FiFileText,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

export default function NavbarMaestro() {
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
      localStorage.removeItem("maestroData");
      router.push("/designs/vistaLogin");
    }
  };

  const menuItems = [
    { 
      href: "/designs/menumaestros", 
      icon: <FiHome />, 
      label: "Inicio" 
    },
    {
      href: "/designs/menumaestros/perfil",
      icon: <FiUser />,
      label: "Mi Perfil",
    },
    {
      href: "/designs/menumaestros/vistaMismaterias",
      icon: <FiBook />,
      label: "Mis Materias",
    },
    {
      href: "/designs/menumaestros/vistaMihorario",
      icon: <FiClock />,
      label: "Mi Horario",
    },
    {
      href: "/designs/menumaestros/vistaCalificaciones",
      icon: <FiFileText />,
      label: "Calificaciones",
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
              <span className="teacher-badge">MAESTRO</span>
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

        <li className="menu-item logout" onClick={handleLogout}>
          <div className="menu-link">
            <span className="icon">
              <FiLogOut />
            </span>
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

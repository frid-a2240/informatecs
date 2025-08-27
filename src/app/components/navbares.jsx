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
} from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Header con logo, texto y toggle en la misma fila */}
      {open && (
        <div className="sidebar-header logo-toggle-container">
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={40} height={40} />
            <span className="designer-text">Informatec</span>
          </div>

          {/* Toggle */}
          <button className="sidebar-toggle-btn" onClick={() => setOpen(!open)}>
            <FiMenu />
          </button>
        </div>
      )}

      {/* Menú principal */}
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
            {open && <span className="title">Actividades</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/configuracion" className="menu-link">
            <FiUserPlus className="icon" />
            {open && <span className="title">Formulario</span>}
          </Link>
        </li>

        <li className="menu-item" onClick={() => router.back()}>
          <FiLogOut className="icon" />
          {open && <span className="title">Cerrar Sesión</span>}
        </li>
      </ul>
    </aside>
  );
}

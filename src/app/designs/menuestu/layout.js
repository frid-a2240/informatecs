"use client";

import { useState } from "react"; // 1. Importar useState
import Sidebar from "@/app/components/layout/navbares";
import SidebarEstudiante from "@/app/components/layout/navbares";

export default function EstudiantesLayout({ children }) {
  // 2. Crear el estado para controlar si está abierto o cerrado
  const [open, setOpen] = useState(true);

  return (
    <div className="estudiantes-layout">
      <SidebarEstudiante open={open} setOpen={setOpen} />

      <main
        className="content-area"
        style={{
          marginLeft: open ? "260px" : "75px",
          transition: "margin 0.3s ease, width 0.3s ease",
          width: open ? "calc(100% - 260px)" : "calc(100% - 75px)",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}

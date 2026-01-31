"use client";

import Sidebar from "@/app/components/layout/navbares";
import "@/styles/layouts/estudiantes-layout.css"; // ¡No olvides tus estilos organizados!

export default function EstudiantesLayout({ children }) {
  return (
    <div className="estudiantes-layout">
      <Sidebar />
      <main className="content-area">
        {children}
      </main>
    </div>
  );
}
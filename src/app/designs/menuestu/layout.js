"use client";

import Sidebar from "@/app/components/navbares";

export default function EstudiantesLayout({ children }) {
  return (
    <div className="estudiantes-layout">
      <Sidebar /> {/* Sidebar fijo */}
      <main className="content-area">{children}</main>
    </div>
  );
}

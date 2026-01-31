"use client";

import Sidebar from "@/app/components/layout/navbares";

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
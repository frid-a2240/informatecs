"use client";

import AdminSidebar from "@/app/components/navbaradm";
import Sidebar from "@/app/components/navbares";

export default function EstudiantesLayout({ children }) {
  return (
    <div className="estudiantes-layout">
      <AdminSidebar />
      <main className="content-area">{children}</main>
    </div>
  );
}

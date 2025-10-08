"use client";
import React from "react";
import AdminPanel from "@/app/components/admin/AdminPanel";
import AdminSidebar from "@/app/components/navbaradm";

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64">
        <AdminSidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">📅 Gestión de Eventos</h2>
        <AdminPanel />
      </div>
    </div>
  );
}

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
      <div>
        <AdminPanel />
      </div>
    </div>
  );
}

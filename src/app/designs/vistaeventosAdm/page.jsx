"use client";
import React from "react";
import AdminPanel from "@/app/components/admin/AdminPanel";
import AdminSidebar from "@/app/components/navbaradm";

export default function EventosPage() {
  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {" "}
      <AdminSidebar />
      <h2>📅 Gestión de Eventos</h2>
      <div>
        <AdminPanel />
      </div>
    </div>
  );
}

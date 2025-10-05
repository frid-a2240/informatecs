import React, { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  FileText,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Inicio", icon: <Home size={18} /> },
  { id: "events", label: "Gestionar Eventos", icon: <Calendar size={18} /> },
  { id: "users", label: "Usuarios", icon: <Users size={18} /> },
  { id: "inscriptions", label: "Inscripciones", icon: <FileText size={18} /> },
  { id: "reports", label: "Reportes", icon: <BarChart size={18} /> },
  { id: "settings", label: "Configuración", icon: <Settings size={18} /> },
];

const AdminSidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Auto cerrar sidebar en mobile si la pantalla es pequeña
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Si estamos en mobile, el sidebar inicia cerrado
  useEffect(() => {
    if (isMobile) setIsOpen(false);
    else setIsOpen(true);
  }, [isMobile]);

  return (
    <>
      {/* Botón hamburguesa */}
      {isMobile && (
        <button
          className="mobile-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={24} color="var(--yellow-accent)" />
          ) : (
            <Menu size={24} color="var(--yellow-accent)" />
          )}
        </button>
      )}

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="logo-title">Eventos ITE</h1>
          <p className="logo-subtitle">Panel de Administración</p>
        </div>

        <div className="admin-profile-box">
          <div className="admin-avatar">A</div>
          <div className="admin-role">Administrador</div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-button ${
                    activeSection === item.id ? "active" : ""
                  }`}
                >
                  <span
                    className="nav-icon"
                    style={{ color: "var(--yellow-accent)" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} color="white" style={{ marginRight: "1rem" }} />
          Cerrar Sesión
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;

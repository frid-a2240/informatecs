'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Limpiar datos de sesión si los tienes
      localStorage.removeItem('adminData');
      router.push('/');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'events', label: 'Gestionar Eventos', icon: '📅' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'inscriptions', label: 'Inscripciones', icon: '📝' },
    { id: 'reports', label: 'Reportes', icon: '📈' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

  const stats = [
    { number: '24', label: 'Eventos Activos', icon: '📅', color: 'events' },
    { number: '1,247', label: 'Usuarios Registrados', icon: '👥', color: 'users' },
    { number: '356', label: 'Inscripciones Hoy', icon: '✅', color: 'active' },
    { number: '89%', label: 'Ocupación Promedio', icon: '📈', color: 'reports' }
  ];

  const quickActions = [
    { title: 'Crear Evento', desc: 'Configura un nuevo evento', icon: '🎪' },
    { title: 'Gestionar Usuarios', desc: 'Administrar cuentas de estudiantes', icon: '👤' },
    { title: 'Ver Inscripciones', desc: 'Revisar registros recientes', icon: '📋' },
    { title: 'Generar Reporte', desc: 'Estadísticas y análisis', icon: '📊' },
    { title: 'Configuración', desc: 'Ajustes del sistema', icon: '🔧' },
    { title: 'Notificaciones', desc: 'Enviar avisos masivos', icon: '📢' }
  ];

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <h1 style={styles.logoTitle}>Eventos ITE</h1>
          <p style={styles.logoSubtitle}>Panel de Administración</p>
        </div>

        <div style={styles.adminProfile}>
          <div style={styles.adminAvatar}>A</div>
          <div style={styles.adminName}>Administrador</div>
          <div style={styles.adminRole}>Super Usuario</div>
        </div>

        <nav>
          <ul style={styles.navMenu}>
            {navItems.map((item) => (
              <li key={item.id} style={styles.navItem}>
                <a
                  href="#"
                  style={{
                    ...styles.navLink,
                    ...(activeSection === item.id ? styles.navLinkActive : {})
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                  }}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Panel de Control</h2>
            <p style={styles.headerSubtitle}>Bienvenido de vuelta, Administrador</p>
          </div>
          <div style={styles.headerActions}>
            <button style={{...styles.btn, ...styles.btnPrimary}}>
              ➕ Crear Evento
            </button>
            <button style={{...styles.btn, ...styles.btnSecondary}}>
              📊 Ver Reportes
            </button>
          </div>
        </header>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles[`statIcon${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}}>
                {stat.icon}
              </div>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section style={styles.quickActions}>
          <h3 style={styles.quickActionsTitle}>Acciones Rápidas</h3>
          <div style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <div key={index} style={styles.actionCard}>
                <span style={styles.actionIcon}>{action.icon}</span>
                <div style={styles.actionTitle}>{action.title}</div>
                <div style={styles.actionDesc}>{action.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#333'
  },
  sidebar: {
    width: '280px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '2rem 1.5rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0'
  },
  logoTitle: {
    color: '#0055aa',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    fontWeight: '700',
    margin: 0
  },
  logoSubtitle: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0
  },
  adminProfile: {
    background: 'linear-gradient(135deg, #0055aa, #0066cc)',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  adminAvatar: {
    width: '60px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  adminName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  adminRole: {
    fontSize: '0.85rem',
    opacity: '0.9'
  },
  navMenu: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  navItem: {
    marginBottom: '0.5rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#555',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    cursor: 'pointer'
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, #0055aa, #0066cc)',
    color: 'white',
    transform: 'translateX(5px)'
  },
  navIcon: {
    marginRight: '0.75rem',
    fontSize: '1.1rem'
  },
  logoutBtn: {
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
    right: '1.5rem',
    padding: '0.75rem 1.5rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
  },
  headerTitle: {
    color: '#333',
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: 0
  },
  headerSubtitle: {
    color: '#666',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0 0'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  btn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #0055aa, #0066cc)',
    color: 'white'
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    border: '1px solid #ddd'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease',
    borderTop: '4px solid transparent',
    borderImage: 'linear-gradient(90deg, #667eea, #764ba2) 1'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 1rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white'
  },
  statIconEvents: { background: 'linear-gradient(135deg, #667eea, #764ba2)' },
  statIconUsers: { background: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  statIconActive: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  statIconReports: { background: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#666',
    fontWeight: '500'
  },
  quickActions: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
  },
  quickActionsTitle: {
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.3rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionCard: {
    background: 'linear-gradient(135deg, rgba(0, 85, 170, 0.1), rgba(0, 102, 204, 0.1))',
    border: '2px solid rgba(0, 85, 170, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  actionIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
    display: 'block'
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  actionDesc: {
    fontSize: '0.9rem',
    opacity: '0.8'
  }
};

export default AdminDashboard;
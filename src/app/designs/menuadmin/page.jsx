'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '../../components/admin/AdminPanel';
import InscripcionesPanel from '../../components/admin/InscripcionesPanel';
import AlumPanel from '../../components/admin/AlumPanel';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('adminData');
      router.push('/');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'events', label: 'Gestionar Eventos', icon: '📅' },
    { id: 'users', label: 'Alumnos', icon: '👥' },
    { id: 'inscriptions', label: 'Inscripciones', icon: '📝' },
    { id: 'reports', label: 'Reportes', icon: '📈' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRight: '1px solid #ddd'
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#0055aa', fontSize: '1.5rem', margin: 0 }}>
            Eventos ITE
          </h1>
          <p
            style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0.5rem 0 0 0'
            }}
          >
            Panel de Administración
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#0055aa',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}
          >
            A
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            Administrador
          </div>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor:
                      activeSection === item.id ? '#0055aa' : 'transparent',
                    color: activeSection === item.id ? 'white' : '#555',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  <span
                    style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            marginTop: '2rem',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
        {activeSection === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
              Panel de Control
            </h2>
            <p style={{ color: '#666' }}>
              Bienvenido de vuelta, Administrador
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}
                >
                  24
                </div>
                <div style={{ color: '#666', fontWeight: '500' }}>
                  Eventos Activos
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}
                >
                  1,247
                </div>
                <div style={{ color: '#666', fontWeight: '500' }}>
                  Usuarios Registrados
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}
                >
                  356
                </div>
                <div style={{ color: '#666', fontWeight: '500' }}>
                  Inscripciones Hoy
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'events' && (
          <div>
            <AdminPanel />
          </div>
        )}

        {(activeSection === 'users' ||
          activeSection === 'inscriptions' ||
          activeSection === 'reports' ||
          activeSection === 'settings') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {activeSection === 'users' && 'Gestión de Usuarios'}
              {activeSection === 'inscriptions' && 'Inscripciones'}
              {activeSection === 'reports' && 'Reportes'}
              {activeSection === 'settings' && 'Configuración'}
            </h2>

            {/* Aquí van los paneles directamente relacionados */}
            {activeSection === 'inscriptions' && <InscripcionesPanel />}
            {activeSection === 'users' && <AlumPanel />}

            {/* Para lo que aún no implementas */}
            {(activeSection === 'reports' || activeSection === 'settings') && (
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                Funcionalidad en desarrollo...
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

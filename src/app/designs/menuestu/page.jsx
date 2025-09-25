'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EstuPanel from '../../components/student/EstuPanel';

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setStudentData(data);
      } catch (error) {
        console.error('Error al parsear datos del estudiante:', error);
      }
    }
    setLoading(false);
  }, []);

  const navItems = [
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
    { id: 'activities', label: 'Actividades Com.', icon: '🏃‍♂️' },
    { id: 'events', label: 'Mis Actividades', icon: '📅' },
    { id: 'certificates', label: 'Certificados', icon: '🏆' }
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('studentData');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Cargando información...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'rgba(255, 255, 255, 0.95)', 
        padding: '2rem 1.5rem',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f0f0f0' }}>
          <h1 style={{ color: '#0055aa', fontSize: '1.5rem', margin: 0 }}>Eventos ITE</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Portal del Estudiante</p>
        </div>

        {/* Profile */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
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
          }}>
            {(studentData?.nombreCompleto || 'E').charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {studentData?.nombreCompleto || 'Estudiante'}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
            {studentData?.numeroControl || 'Estudiante ITE'}
          </div>
        </div>

        {/* Navigation */}
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
                    backgroundColor: activeSection === item.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                    color: activeSection === item.id ? 'white' : '#555',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          style={{
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
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
              {activeSection === 'profile' && 'Mi Perfil'}
              {activeSection === 'activities' && 'Actividades Complementarias'}
              {activeSection === 'events' && 'Mis Actividades'}
              {activeSection === 'certificates' && 'Certificados'}
            </h2>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              Bienvenido, {studentData?.nombreCompleto || 'Estudiante'}
            </p>
          </div>
        </header>

        {/* Profile Content */}
        {activeSection === 'profile' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Información Personal */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ backgroundColor: '#0070f3', color: '#fff', padding: '1rem 2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                  📋 Información Personal
                </h3>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Número de Control
                    </span>
                    <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                      {studentData?.numeroControl || 'No disponible'}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Nombre Completo
                    </span>
                    <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                      {studentData?.nombreCompleto || 'No disponible'}
                    </div>
                  </div>

                  {studentData?.fechaNacimiento && (
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Fecha de Nacimiento
                      </span>
                      <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                        {studentData.fechaNacimiento}
                      </div>
                    </div>
                  )}

                  {studentData?.bloodType && (
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tipo de Sangre
                      </span>
                      <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                        {studentData.bloodType}
                      </div>
                    </div>
                  )}

                  {studentData?.email && (
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </span>
                      <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                        {studentData.email}
                      </div>
                    </div>
                  )}

                  {studentData?.telefono && (
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Teléfono
                      </span>
                      <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                        {studentData.telefono}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ backgroundColor: '#0070f3', color: '#fff', padding: '1rem 2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                  🎓 Información Académica
                </h3>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Carrera
                    </span>
                    <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                      {studentData?.carrera || 'Sin carrera asignada'}
                    </div>
                  </div>

                  {studentData?.carreraId && (
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ID Carrera
                      </span>
                      <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                        {studentData.carreraId}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel dinámico */}
        <EstuPanel 
          activeSection={activeSection} 
          studentData={studentData} 
          setStudentData={setStudentData} 
        />

        {/* Certificates */}
        {activeSection === 'certificates' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.8rem', color: '#333', margin: '0 0 1rem 0' }}>
                Certificados
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
                Descarga tus certificados de participación en eventos completados
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

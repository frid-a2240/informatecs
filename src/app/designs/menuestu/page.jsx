'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const fullName = searchParams.get('name');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedSport, setSelectedSport] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    hasPracticed: '',
    hasIllness: '',
    purpose: ''
  });

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
    { id: 'events', label: 'Mis Eventos', icon: '📅' },
    { id: 'certificates', label: 'Certificados', icon: '🏆' }
  ];

  const sports = [
    { id: 'futbol', name: 'Fútbol', icon: '⚽', color: '#28a745' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#ff6b35' },
    { id: 'volleyball', name: 'Voleibol', icon: '🏐', color: '#007bff' }
  ];

  const handleSportClick = (sportId, sportName) => {
    setSelectedSport({ id: sportId, name: sportName });
    setShowForm(true);
    setFormData({ hasPracticed: '', hasIllness: '', purpose: '' });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.hasPracticed || !formData.hasIllness || !formData.purpose) {
      alert('Por favor completa todas las preguntas');
      return;
    }
    
    console.log('Datos del formulario:', {
      sport: selectedSport,
      ...formData
    });
    
    alert(`Inscripción a ${selectedSport.name} registrada exitosamente`);
    setShowForm(false);
    setSelectedSport('');
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('studentData');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div>Cargando información...</div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <h1 style={styles.logoTitle}>Eventos ITE</h1>
          <p style={styles.logoSubtitle}>Portal del Estudiante</p>
        </div>

        <div style={styles.studentProfile}>
          <div style={styles.studentAvatar}>
            {(studentData?.nombreCompleto || 'E').charAt(0).toUpperCase()}
          </div>
          <div style={styles.studentName}>
            {studentData?.nombreCompleto || 'Estudiante'}
          </div>
          <div style={styles.studentRole}>
            {studentData?.numeroControl || 'Estudiante ITE'}
          </div>
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
                    setShowForm(false);
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
            <h2 style={styles.headerTitle}>
              {activeSection === 'profile' && 'Mi Perfil'}
              {activeSection === 'activities' && 'Actividades Complementarias'}
              {activeSection === 'events' && 'Mis Eventos'}
              {activeSection === 'certificates' && 'Certificados'}
            </h2>
            <p style={styles.headerSubtitle}>
              Bienvenido, {studentData?.nombreCompleto || 'Estudiante'}
            </p>
          </div>
          <div style={styles.headerActions}>
            <button style={{...styles.btn, ...styles.btnPrimary}}>
              📚 Ver Eventos
            </button>
            <button style={{...styles.btn, ...styles.btnSecondary}}>
              📊 Mi Progreso
            </button>
          </div>
        </header>

        {/* Contenido Mi Perfil */}
        {activeSection === 'profile' && (
          <div style={styles.profileSection}>
            {/* Información Personal */}
            <div style={styles.infoCard}>
              <div style={{...styles.cardHeader, backgroundColor: '#0070f3'}}>
                <h3 style={styles.cardTitle}>📋 Información Personal</h3>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Número de Control</span>
                    <span style={styles.infoValue}>
                      {studentData?.numeroControl || 'No disponible'}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Nombre Completo</span>
                    <span style={styles.infoValue}>
                      {studentData?.nombreCompleto || 'No disponible'}
                    </span>
                  </div>
                  {studentData?.fechaNacimiento && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Fecha de Nacimiento</span>
                      <span style={styles.infoValue}>{studentData.fechaNacimiento}</span>
                    </div>
                  )}
                  {studentData?.email && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Email</span>
                      <span style={styles.infoValue}>{studentData.email}</span>
                    </div>
                  )}
                  {studentData?.telefono && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Teléfono</span>
                      <span style={styles.infoValue}>{studentData.telefono}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div style={styles.infoCard}>
              <div style={{...styles.cardHeader, backgroundColor: '#28a745'}}>
                <h3 style={styles.cardTitle}>🎓 Información Académica</h3>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Carrera</span>
                    <span style={styles.infoValue}>
                      {studentData?.carrera || 'Sin carrera asignada'}
                    </span>
                  </div>
                  {studentData?.carreraId && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>ID Carrera</span>
                      <span style={styles.infoValue}>{studentData.carreraId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Actividades Complementarias */}
        {activeSection === 'activities' && !showForm && (
          <div style={styles.activitiesSection}>
            <div style={styles.sportsGrid}>
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  style={{...styles.sportCard, borderTopColor: sport.color}}
                  onClick={() => handleSportClick(sport.id, sport.name)}
                >
                  <div style={{...styles.sportIcon, backgroundColor: sport.color}}>
                    {sport.icon}
                  </div>
                  <h3 style={styles.sportName}>{sport.name}</h3>
                  <p style={styles.sportDescription}>
                    Inscríbete en {sport.name.toLowerCase()} y obtén créditos complementarios
                  </p>
                  <button style={{...styles.sportButton, backgroundColor: sport.color}}>
                    Inscribirme
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario de inscripción */}
        {showForm && (
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>
                  📝 Inscripción a {selectedSport.name}
                </h3>
                <button 
                  style={styles.closeButton}
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={styles.form}>
                {/* Pregunta 1 */}
                <div style={styles.questionContainer}>
                  <label style={styles.questionLabel}>
                    1. ¿Has practicado {selectedSport.name.toLowerCase()} antes?
                  </label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasPracticed"
                        value="si"
                        checked={formData.hasPracticed === 'si'}
                        onChange={(e) => setFormData({...formData, hasPracticed: e.target.value})}
                        style={styles.radioInput}
                      />
                      Sí
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasPracticed"
                        value="no"
                        checked={formData.hasPracticed === 'no'}
                        onChange={(e) => setFormData({...formData, hasPracticed: e.target.value})}
                        style={styles.radioInput}
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Pregunta 2 */}
                <div style={styles.questionContainer}>
                  <label style={styles.questionLabel}>
                    2. ¿Padeces de alguna enfermedad?
                  </label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasIllness"
                        value="si"
                        checked={formData.hasIllness === 'si'}
                        onChange={(e) => setFormData({...formData, hasIllness: e.target.value})}
                        style={styles.radioInput}
                      />
                      Sí
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasIllness"
                        value="no"
                        checked={formData.hasIllness === 'no'}
                        onChange={(e) => setFormData({...formData, hasIllness: e.target.value})}
                        style={styles.radioInput}
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Pregunta 3 */}
                <div style={styles.questionContainer}>
                  <label style={styles.questionLabel}>
                    3. ¿Te interesa como pasatiempo o para créditos?
                  </label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="purpose"
                        value="pasatiempo"
                        checked={formData.purpose === 'pasatiempo'}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        style={styles.radioInput}
                      />
                      a) Pasatiempo
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="purpose"
                        value="creditos"
                        checked={formData.purpose === 'creditos'}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        style={styles.radioInput}
                      />
                      b) Créditos
                    </label>
                  </div>
                </div>

                <div style={styles.formButtons}>
                  <button 
                    type="button" 
                    style={styles.cancelButton}
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    style={styles.submitButton}
                  >
                    Enviar Inscripción
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contenido de otras secciones */}
        {activeSection === 'events' && (
          <div style={styles.comingSoonSection}>
            <div style={styles.comingSoonCard}>
              <div style={styles.comingSoonIcon}>📅</div>
              <h3 style={styles.comingSoonTitle}>Mis Eventos</h3>
              <p style={styles.comingSoonDesc}>
                Aquí podrás ver todos los eventos en los que te has inscrito
              </p>
            </div>
          </div>
        )}

        {activeSection === 'certificates' && (
          <div style={styles.comingSoonSection}>
            <div style={styles.comingSoonCard}>
              <div style={styles.comingSoonIcon}>🏆</div>
              <h3 style={styles.comingSoonTitle}>Certificados</h3>
              <p style={styles.comingSoonDesc}>
                Descarga tus certificados de participación en eventos completados
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#333'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8'
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
  studentProfile: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  studentAvatar: {
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
  studentName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  studentRole: {
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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white'
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    border: '1px solid #ddd'
  },
  profileSection: {
    display: 'grid',
    gap: '2rem'
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
  },
  cardHeader: {
    color: '#fff',
    padding: '1rem 2rem'
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  cardContent: {
    padding: '2rem'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  infoLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoValue: {
    fontSize: '1rem',
    color: '#333',
    fontWeight: '500'
  },
  activitiesSection: {
    padding: '1rem 0'
  },
  sportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  sportCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    borderTop: '4px solid',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  sportIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 1rem',
    color: '#fff'
  },
  sportName: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0'
  },
  sportDescription: {
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  },
  sportButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  formSection: {
    display: 'flex',
    justifyContent: 'center'
  },
  formCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  },
  formHeader: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  formTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  form: {
    padding: '2rem'
  },
  questionContainer: {
    marginBottom: '2rem'
  },
  questionLabel: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#555',
    cursor: 'pointer'
  },
  radioInput: {
    marginRight: '0.75rem',
    transform: 'scale(1.2)'
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '2rem'
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  comingSoonSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  comingSoonCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
  },
  comingSoonIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  comingSoonTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '1rem',
    margin: '0 0 1rem 0'
  },
  comingSoonDesc: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.6'
  }
};
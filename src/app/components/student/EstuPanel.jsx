import React, { useState, useEffect } from 'react';

const EstuPanel = ({ activeSection, studentData, setStudentData }) => {
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [misActividades, setMisActividades] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    hasPracticed: '',
    hasIllness: '',
    purpose: '',
    bloodType: ''
  });

 useEffect(() => {
  if (activeSection === 'activities') {
    cargarActividadesDisponibles();
  }
}, [activeSection]);

useEffect(() => {
  if (activeSection === 'events') {
    cargarMisActividades();
  }
}, [activeSection, studentData]);

const cargarMisActividades = async () => {
  try {
    const response = await fetch(`/api/inscripciones?aluctr=${studentData.numeroControl}`);
    const data = await response.json();
    setMisActividades(data);
  } catch (error) {
    console.error('Error al cargar mis actividades', error);
  }
};
  const cargarActividadesDisponibles = async () => {
    try {
      setLoadingActividades(true);
       setActividadesDisponibles([]); // <--- limpiar antes de cargar
      const response = await fetch('/api/act-disponibles');
      
      if (response.ok) {
        const actividades = await response.json();
        setActividadesDisponibles(actividades);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingActividades(false);
    }
  };

  const handleSportClick = (ofertaId, actividad) => {
    setSelectedSport({ 
      id: ofertaId, 
      actividadId: actividad.id,
      name: actividad.aconco || actividad.aticve 
    });
    setShowForm(true);
    setFormData({ hasPracticed: '', hasIllness: '', purpose: '', bloodType: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hasPracticed || !formData.hasIllness || !formData.purpose || !formData.bloodType) {
      alert('Por favor completa todas las preguntas');
      return;
    }

    try {
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluctr: studentData?.aluctr || studentData?.numeroControl,
          actividadId: selectedSport.actividadId,
          ...formData
        })
      });

      if (response.ok) {
        const newActivity = { 
          ...selectedSport, 
          ...formData,
          fechaInscripcion: new Date().toLocaleDateString()
        };
        setMisActividades([...misActividades, newActivity]);
        setStudentData({ ...studentData, bloodType: formData.bloodType });
        setShowForm(false);
        setSelectedSport('');
        alert(`Inscripción a ${selectedSport.name} registrada exitosamente`);
      } else {
        const data = await response.json();
        alert('Error al registrar inscripción: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  // Renderizar según la sección activa
  if (activeSection === 'activities' && !showForm) {
    return (
      <div style={{ padding: '1rem 0' }}>
        {loadingActividades ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>
              Cargando actividades disponibles...
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {actividadesDisponibles.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
                  No hay actividades disponibles
                </h3>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  El administrador aún no ha publicado actividades para este semestre.
                </p>
              </div>
            ) : (
              actividadesDisponibles.map((oferta) => (
                <div
                  key={oferta.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '15px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                    borderTop: '4px solid #007bff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleSportClick(oferta.id, oferta.actividad)}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    margin: '0 auto 1rem',
                    backgroundColor: '#007bff',
                    color: '#fff'
                  }}>
                    🎯
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    color: '#333',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {oferta.actividad.aconco || oferta.actividad.aticve}
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '1.5rem',
                    lineHeight: '1.4'
                  }}>
                    Código: {oferta.actividad.aticve}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      color: '#1976d2', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {oferta.actividad.acocre} créditos
                    </span>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      color: '#7b1fa2', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {oferta.actividad.acohrs} horas
                    </span>
                  </div>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '25px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Inscribirme
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  if (showForm) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
              📝 Inscripción a {selectedSport.name}
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleFormSubmit} style={{ padding: '2rem' }}>
            {/* Pregunta 1 */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '1rem'
              }}>
                1. ¿Has practicado esta actividad antes?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="hasPracticed"
                    value="si"
                    checked={formData.hasPracticed === 'si'}
                    onChange={(e) => setFormData({...formData, hasPracticed: e.target.value})}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  Sí
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="hasPracticed"
                    value="no"
                    checked={formData.hasPracticed === 'no'}
                    onChange={(e) => setFormData({...formData, hasPracticed: e.target.value})}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Pregunta 2 */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '1rem'
              }}>
                2. ¿Tienes alguna enfermedad o lesión relevante?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="hasIllness"
                    value="si"
                    checked={formData.hasIllness === 'si'}
                    onChange={(e) => setFormData({...formData, hasIllness: e.target.value})}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  Sí
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="hasIllness"
                    value="no"
                    checked={formData.hasIllness === 'no'}
                    onChange={(e) => setFormData({...formData, hasIllness: e.target.value})}
                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Pregunta 3 */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '1rem'
              }}>
                3. Propósito de inscripción:
              </label>
              <input
                type="text"
                placeholder="Ej: Obtener créditos complementarios"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Pregunta 4 */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '1rem'
              }}>
                4. Tipo de sangre:
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Selecciona tu tipo de sangre</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#666',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enviar Inscripción
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeSection === 'events') {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '1rem 2rem'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
            📅 Mis Actividades Inscritas
          </h3>
        </div>
        <div style={{ padding: '2rem' }}>
          {misActividades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h4 style={{ marginBottom: '0.5rem' }}>No tienes actividades inscritas</h4>
              <p>Ve a "Actividades Complementarias" para inscribirte en alguna actividad.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {misActividades.map((actividad, index) => (
                <div key={index} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {actividad.name}
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <p><strong>Fecha de inscripción:</strong> {actividad.fechaInscripcion}</p>
                    <p><strong>Propósito:</strong> {actividad.purpose}</p>
                    <p><strong>Tipo de sangre:</strong> {actividad.bloodType}</p>
                    <p><strong>Ha practicado antes:</strong> {actividad.hasPracticed === 'si' ? 'Sí' : 'No'}</p>
                    <p><strong>Tiene enfermedad:</strong> {actividad.hasIllness === 'si' ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EstuPanel;
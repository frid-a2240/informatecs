import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Calendar, Search, Clock } from 'lucide-react';

const AdminPanel = () => {
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalHorario, setModalHorario] = useState(null);
  const [horarioForm, setHorarioForm] = useState({
    dias: [],
    horaInicio: '',
    horaFin: '',
    salon: ''
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/actividades');
      if (response.ok) {
        const actividades = await response.json();
        setTodasActividades(actividades);
      } else {
        alert('Error al cargar actividades');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const agregarAOferta = (actividad) => {
    if (!actividadesOfertadas.find(act => act.id === actividad.id)) {
      setActividadesOfertadas([...actividadesOfertadas, actividad]);
    }
  };

  const quitarDeOferta = (actividadId) => {
    setActividadesOfertadas(actividadesOfertadas.filter(act => act.id !== actividadId));
  };

  const abrirModalHorario = (actividad) => {
    setModalHorario(actividad);
    // Cargar horario existente si lo hay
    if (actividad.horario) {
      setHorarioForm(actividad.horario);
    } else {
      setHorarioForm({
        dias: [],
        horaInicio: '',
        horaFin: '',
        salon: ''
      });
    }
  };

  const toggleDia = (dia) => {
    setHorarioForm(prev => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia]
    }));
  };

  const guardarHorario = async () => {
    if (horarioForm.dias.length === 0 || !horarioForm.horaInicio || !horarioForm.horaFin) {
      alert('Por favor completa todos los campos del horario');
      return;
    }

    try {
      const response = await fetch(`/api/horario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: modalHorario.id,
          horario: horarioForm })
      });

      if (response.ok) {
        alert('Horario guardado exitosamente');
        // Actualizar la actividad en el estado
        setActividadesOfertadas(prev => 
          prev.map(act => 
            act.id === modalHorario.id 
              ? { ...act, horario: horarioForm }
              : act
          )
        );
        setTodasActividades(prev => 
          prev.map(act => 
            act.id === modalHorario.id 
              ? { ...act, horario: horarioForm }
              : act
          )
        );
        setModalHorario(null);
      } else {
        alert('Error al guardar horario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const publicarActividades = async () => {
    if (actividadesOfertadas.length === 0) {
      alert('Selecciona al menos una actividad para ofertar.');
      return;
    }

    // Verificar que todas tengan horario
    const sinHorario = actividadesOfertadas.filter(act => !act.horario);
    if (sinHorario.length > 0) {
      if (!window.confirm(`Hay ${sinHorario.length} actividad(es) sin horario asignado. ¿Deseas continuar?`)) {
        return;
      }
    }

    if (!window.confirm(`¿Publicar ${actividadesOfertadas.length} actividades para los estudiantes?`)) {
      return;
    }

    try {
      setPublicando(true);
      
      const ofertas = actividadesOfertadas.map(actividad => ({
        actividadId: actividad.id,
        semestre: '2024-2',
        activa: true
      }));

      const response = await fetch('/api/ofertas-semestre/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ofertas })
      });

      if (response.ok) {
        alert(`¡Actividades publicadas! ${actividadesOfertadas.length} actividades están disponibles para los estudiantes.`);
        setActividadesOfertadas([]);
      } else {
        alert('Error al publicar actividades');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setPublicando(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando actividades...</div>;
  }

  const actividadesFiltradas = todasActividades.filter(act =>
    (act.aconco || act.aticve || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Modal de Horario */}
      {modalHorario && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
                🕐 Configurar Horario
              </h3>
              <button
                onClick={() => setModalHorario(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <strong>{modalHorario.aconco || modalHorario.aticve}</strong>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  Código: {modalHorario.aticve}
                </div>
              </div>

              {/* Días */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  color: '#333'
                }}>
                  Días de la semana:
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {diasSemana.map(dia => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid',
                        borderColor: horarioForm.dias.includes(dia) ? '#007bff' : '#ddd',
                        borderRadius: '8px',
                        backgroundColor: horarioForm.dias.includes(dia) ? '#e7f3ff' : 'white',
                        color: horarioForm.dias.includes(dia) ? '#007bff' : '#666',
                        fontWeight: horarioForm.dias.includes(dia) ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    color: '#333'
                  }}>
                    Hora de inicio:
                  </label>
                  <input
                    type="time"
                    value={horarioForm.horaInicio}
                    onChange={(e) => setHorarioForm({...horarioForm, horaInicio: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    color: '#333'
                  }}>
                    Hora de fin:
                  </label>
                  <input
                    type="time"
                    value={horarioForm.horaFin}
                    onChange={(e) => setHorarioForm({...horarioForm, horaFin: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Salón */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  Salón/Ubicación:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Gimnasio, Cancha 1, Aula 301"
                  value={horarioForm.salon}
                  onChange={(e) => setHorarioForm({...horarioForm, salon: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setModalHorario(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#666',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarHorario}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Guardar Horario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestionar Actividades</h2>
        <p className="text-gray-600">Selecciona las actividades que deseas ofertar este semestre</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel izquierdo: Catálogo completo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Catálogo de Actividades ({todasActividades.length})
            </h3>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {actividadesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron actividades</p>
              </div>
            ) : (
              actividadesFiltradas.map((actividad) => (
                <div key={actividad.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {actividad.aconco || actividad.aticve}
                      </h4>
                      <p className="text-sm text-gray-600">Código: {actividad.aticve}</p>
                      <p className="text-sm text-gray-600">Clave: {actividad.acocve}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {actividad.acocre} créditos
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {actividad.acohrs} horas
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {actividad.depcve} Dpt
                        </span>
                        {actividad.horario && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            ✓ Con horario
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => abrirModalHorario(actividad)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ffc107',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#ffc107',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Clock size={16} />
                        Horario
                      </button>
                      <button
                        onClick={() => agregarAOferta(actividad)}
                        disabled={actividadesOfertadas.find(act => act.id === actividad.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          actividadesOfertadas.find(act => act.id === actividad.id)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {actividadesOfertadas.find(act => act.id === actividad.id) ? 'Agregada' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho: Actividades seleccionadas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Oferta del Semestre ({actividadesOfertadas.length})
            </h3>
            <button
              onClick={publicarActividades}
              disabled={actividadesOfertadas.length === 0 || publicando}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                actividadesOfertadas.length > 0 && !publicando
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Calendar size={20} />
              {publicando ? 'Publicando...' : 'Publicar Oferta'}
            </button>
          </div>

          {actividadesOfertadas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay actividades seleccionadas</p>
              <p className="text-sm">Agrega actividades del catálogo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actividadesOfertadas.map((actividad) => (
                <div key={actividad.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {actividad.aconco || actividad.aticve}
                      </h4>
                      <p className="text-sm text-gray-600">Código: {actividad.aticve}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Créditos: {actividad.acocre}</span>
                        <span>Horas: {actividad.acohrs}</span>
                      </div>
                      {actividad.horario && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          fontSize: '0.85rem'
                        }}>
                          <strong>📅 Horario:</strong> {actividad.horario.dias.join(', ')}<br/>
                          <strong>🕐</strong> {actividad.horario.horaInicio} - {actividad.horario.horaFin}<br/>
                          <strong>📍</strong> {actividad.horario.salon}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => quitarDeOferta(actividad.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Total Actividades</h4>
          <p className="text-2xl font-bold">{todasActividades.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Ofertadas</h4>
          <p className="text-2xl font-bold">{actividadesOfertadas.length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Créditos Totales</h4>
          <p className="text-2xl font-bold">
            {actividadesOfertadas.reduce((sum, act) => sum + (act.acocre || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
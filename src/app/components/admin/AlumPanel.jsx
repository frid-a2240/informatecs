'use client';
import React, { useState, useEffect } from 'react';
import  jsPDF  from 'jspdf';
import autoTable from 'jspdf-autotable';

const EvaluacionesPanel = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [estudianteEvaluando, setEstudianteEvaluando] = useState(null);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [evaluacion, setEvaluacion] = useState({
    asistencia: '',
    participacion: '',
    desempeno: '',
    observaciones: '',
    calificacion: ''
  });

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/studentsactivos-inscritos');
      
      if (!response.ok) {
        throw new Error('Error al cargar estudiantes');
      }
      
      const estudiantes = await response.json();
      
      console.log('Estudiantes recibidos:', estudiantes); // Debug
      
      if (Array.isArray(estudiantes)) {
        // Agrupar estudiantes por actividad
        const actividadesMap = new Map();
        
        estudiantes.forEach(estudiante => {
          console.log('Procesando estudiante:', estudiante.aluctr, estudiante.inscripciones); // Debug
          
          if (estudiante.inscripciones && Array.isArray(estudiante.inscripciones) && estudiante.inscripciones.length > 0) {
            estudiante.inscripciones.forEach(insc => {
              console.log('Inscripción:', insc); // Debug
              
              // Intentar diferentes formas de obtener el ID y nombre de la actividad
              const actividadId = insc.actividad?.actcve || insc.actividad?.id || insc.actcve || insc.actividadId;
              const actividadNombre = insc.actividad?.actnom || insc.actividad?.nombre || insc.actnom || insc.nombreActividad;
              
              console.log('Actividad encontrada:', actividadId, actividadNombre); // Debug
              
              if (actividadId && actividadNombre) {
                if (!actividadesMap.has(actividadId)) {
                  actividadesMap.set(actividadId, {
                    id: actividadId,
                    nombre: actividadNombre,
                    estudiantes: []
                  });
                }
                
                // Evitar duplicados del mismo estudiante
                const actividadData = actividadesMap.get(actividadId);
                const yaExiste = actividadData.estudiantes.some(e => e.aluctr === estudiante.aluctr);
                
                if (!yaExiste) {
                  actividadData.estudiantes.push({
                    ...estudiante,
                    inscripcionId: insc.insid || insc.id
                  });
                }
              }
            });
          }
        });
        
        const actividadesArray = Array.from(actividadesMap.values());
        console.log('Actividades agrupadas:', actividadesArray); // Debug
        setActividades(actividadesArray);
        
        if (actividadesArray.length === 0) {
          console.warn('No se encontraron actividades. Revisa la estructura de datos.');
        }
      } else {
        console.error('La respuesta no es un array:', estudiantes);
        setActividades([]);
        setError('Error en el formato de datos');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message);
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  const actividadesFiltradas = actividades.filter(act =>
    act.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSeleccionEstudiante = (aluctr) => {
    setEstudiantesSeleccionados(prev => {
      if (prev.includes(aluctr)) {
        return prev.filter(id => id !== aluctr);
      } else {
        return [...prev, aluctr];
      }
    });
  };

  const seleccionarTodos = () => {
    if (estudiantesSeleccionados.length === actividadSeleccionada.estudiantes.length) {
      setEstudiantesSeleccionados([]);
    } else {
      setEstudiantesSeleccionados(actividadSeleccionada.estudiantes.map(e => e.aluctr));
    }
  };

  const generarListaPDF = () => {
    if (!actividadSeleccionada) return;
    
    const estudiantesParaImprimir = estudiantesSeleccionados.length > 0
      ? actividadSeleccionada.estudiantes.filter(e => estudiantesSeleccionados.includes(e.aluctr))
      : actividadSeleccionada.estudiantes;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;
    
    // Encabezado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTITUTO TECNOLÓGICO DE ENSENADA', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Lista de Asistencia - Actividades Complementarias', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 85, 170);
    doc.text(`Actividad: ${actividadSeleccionada.nombre}`, pageWidth / 2, 38, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const fecha = new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Fecha: ${fecha}`, marginLeft, 46);
    doc.text(`Total de estudiantes: ${estudiantesParaImprimir.length}`, marginLeft, 52);
    
    // Preparar datos para la tabla
    const tableData = estudiantesParaImprimir.map((estudiante, index) => {
      const nombreCompleto = `${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm}`;
      
      return [
        index + 1,
        estudiante.aluctr,
        nombreCompleto,
        estudiante.alumai,
        '', // Columna vacía para firma
      ];
    });
    
   // Generar tabla
    autoTable(doc, {
      startY: 58,
      head: [['#', 'Control', 'Nombre Completo', 'Email', 'Firma']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 85, 170],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 65 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30, halign: 'center', minCellHeight: 12 }
      },
      margin: { left: marginLeft, right: marginLeft },
    });
    
    // Pie de página
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Descargar PDF
    const nombreArchivo = `Lista_${actividadSeleccionada.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);
  };

  const handleEstudianteClick = (estudiante) => {
    setEstudianteEvaluando(estudiante);
    setEvaluacion({
      asistencia: '',
      participacion: '',
      desempeno: '',
      observaciones: '',
      calificacion: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvaluacion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEvaluacion = async (e) => {
    e.preventDefault();
    
    console.log('Evaluación para:', estudianteEvaluando);
    console.log('Actividad:', actividadSeleccionada.nombre);
    console.log('Datos:', evaluacion);
    
    // Aquí puedes hacer el POST a tu API
    // const response = await fetch('/api/evaluaciones', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     aluctr: estudianteEvaluando.aluctr,
    //     actividadId: actividadSeleccionada.id,
    //     ...evaluacion
    //   })
    // });
    
    alert('Evaluación guardada exitosamente');
    setEstudianteEvaluando(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
        <p>Error: {error}</p>
        <button
          onClick={cargarActividades}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0055aa',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Vista de evaluación de estudiante
  if (estudianteEvaluando) {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <button
            onClick={() => setEstudianteEvaluando(null)}
            style={{
              marginBottom: '1.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#666',
              fontWeight: '500'
            }}
          >
            ← Volver a la lista
          </button>

          <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.5rem' }}>
            Evaluación de Estudiante
          </h3>
          
          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }}
          >
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Actividad:</strong> <span style={{ color: '#0055aa' }}>{actividadSeleccionada.nombre}</span>
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Control:</strong> {estudianteEvaluando.aluctr}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Nombre:</strong> {`${estudianteEvaluando.alunom} ${estudianteEvaluando.aluapp} ${estudianteEvaluando.aluapm}`}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Email:</strong> {estudianteEvaluando.alumai}
            </p>
          </div>

          <form onSubmit={handleSubmitEvaluacion}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Asistencia
              </label>
              <select
                name="asistencia"
                value={evaluacion.asistencia}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Seleccionar...</option>
                <option value="excelente">Excelente (90-100%)</option>
                <option value="buena">Buena (70-89%)</option>
                <option value="regular">Regular (50-69%)</option>
                <option value="deficiente">Deficiente (0-49%)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Participación
              </label>
              <select
                name="participacion"
                value={evaluacion.participacion}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Seleccionar...</option>
                <option value="excelente">Excelente</option>
                <option value="buena">Buena</option>
                <option value="regular">Regular</option>
                <option value="deficiente">Deficiente</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Desempeño
              </label>
              <select
                name="desempeno"
                value={evaluacion.desempeno}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Seleccionar...</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="deficiente">Deficiente</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Calificación Final
              </label>
              <input
                type="number"
                name="calificacion"
                value={evaluacion.calificacion}
                onChange={handleInputChange}
                min="0"
                max="100"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="0-100"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={evaluacion.observaciones}
                onChange={handleInputChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Comentarios adicionales sobre el desempeño del estudiante..."
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#0055aa',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#003d7a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0055aa'}
            >
              Guardar Evaluación
            </button>
          </form>
        </div>
      </div>
    );
  }

  
  if (actividadSeleccionada) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <button
              onClick={() => {
                setActividadSeleccionada(null);
                setEstudiantesSeleccionados([]);
              }}
              style={{
                marginBottom: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#666',
                fontWeight: '500'
              }}
            >
              ← Volver a actividades
            </button>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
              📋 {actividadSeleccionada.nombre}
            </h2>
            <p style={{ color: '#666', margin: 0 }}>
              {actividadSeleccionada.estudiantes.length} estudiantes inscritos
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={seleccionarTodos}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              {estudiantesSeleccionados.length === actividadSeleccionada.estudiantes.length 
                ? '☑️ Deseleccionar todos' 
                : '☐ Seleccionar todos'}
            </button>
            
            <button
              onClick={generarListaPDF}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              📄 Imprimir Lista {estudiantesSeleccionados.length > 0 && `(${estudiantesSeleccionados.length})`}
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#666', fontWeight: '600', width: '50px' }}>
                    ☐
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#666', fontWeight: '600' }}>
                    Control
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#666', fontWeight: '600' }}>
                    Nombre Completo
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#666', fontWeight: '600' }}>
                    Email
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#666', fontWeight: '600' }}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {actividadSeleccionada.estudiantes.map((estudiante) => (
                  <tr
                    key={estudiante.aluctr}
                    style={{
                      borderBottom: '1px solid #f5f5f5',
                      backgroundColor: estudiantesSeleccionados.includes(estudiante.aluctr) ? '#f0f8ff' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={estudiantesSeleccionados.includes(estudiante.aluctr)}
                        onChange={() => toggleSeleccionEstudiante(estudiante.aluctr)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                      {estudiante.aluctr}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {`${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm}`}
                    </td>
                    <td style={{ padding: '1rem', color: '#666' }}>
                      {estudiante.alumai}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEstudianteClick(estudiante)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          backgroundColor: '#0055aa',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#003d7a'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0055aa'}
                      >
                        Evaluar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal de actividades
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
          🎯 Evaluaciones por Actividad
        </h2>
        <p style={{ color: '#666', margin: 0, marginBottom: '1rem' }}>
          Selecciona una actividad para evaluar a los estudiantes inscritos
        </p>
        
        <input
          type="text"
          placeholder="🔍 Buscar actividad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '0.75rem 1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#0055aa'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      {actividadesFiltradas.length === 0 ? (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '3rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            {busqueda ? 'No se encontraron actividades con ese nombre' : 'No hay actividades con estudiantes inscritos'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              onClick={() => setActividadSeleccionada(actividad)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 85, 170, 0.15)';
                e.currentTarget.style.borderColor = '#0055aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>
                  {actividad.nombre}
                </h3>
                <span
                  style={{
                    backgroundColor: '#0055aa',
                    color: 'white',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {actividad.estudiantes.length}
                </span>
              </div>
              
              <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
                👥 {actividad.estudiantes.length} {actividad.estudiantes.length === 1 ? 'estudiante inscrito' : 'estudiantes inscritos'}
              </p>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                <span style={{ color: '#0055aa', fontWeight: '600', fontSize: '0.9rem' }}>
                  Click para ver estudiantes →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluacionesPanel;
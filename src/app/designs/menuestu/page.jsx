'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const fullName = searchParams.get('name');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del estudiante desde localStorage
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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8'
      }}>
        <div>Cargando información...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh'
    }}>
      {/* Mensaje de Bienvenida */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          color: '#0070f3'
        }}>
          Bienvenido {studentData?.nombreCompleto || 'Estudiante'}
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          margin: '0.5rem 0'
        }}>
        </p>    
      </div>

      {/* Información Personal */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#0070f3',
          color: '#fff',
          padding: '1rem 2rem',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          Información Personal
        </div>

        <div style={{ padding: '1rem 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Número de Control</span>
            <span>{studentData?.numeroControl || 'No disponible'}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Nombre Completo</span>
            <span>{studentData?.nombreCompleto || 'No disponible'}</span>
          </div>

          {studentData?.fechaNacimiento && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>Fecha de Nacimiento</span>
              <span>{studentData.fechaNacimiento}</span>
            </div>
          )}

          {studentData?.rfc && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>RFC</span>
              <span>{studentData.rfc}</span>
            </div>
          )}

          {studentData?.curp && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>CURP</span>
              <span>{studentData.curp}</span>
            </div>
          )}

          {studentData?.telefono && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>Teléfono</span>
              <span>{studentData.telefono}</span>
            </div>
          )}

          {studentData?.email && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>Email</span>
              <span>{studentData.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Información Académica */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '1rem 2rem',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          Información Académica
        </div>

        <div style={{ padding: '1rem 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Carrera</span>
            <span>{studentData?.carrera || 'Sin carrera asignada'}</span>
          </div>

          {studentData?.carreraId && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>ID Carrera</span>
              <span>{studentData.carreraId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Debug info - remover en producción */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          maxWidth: '800px',
          margin: '2rem auto',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h3>Debug - Datos del estudiante:</h3>
          <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
            {JSON.stringify(studentData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
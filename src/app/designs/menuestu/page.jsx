'use client';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const fullName = searchParams.get('name');

  const studentData = {
    numeroControl: '21760457',
    carrera: 'Sistemas'
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#333'
      }}>
        ¡Bienvenido, {fullName || 'Estudiante'}!
      </h1>
      <p style={{
        marginBottom: '2rem',
        color: '#555'
      }}>
        Estás en la página principal del sistema.
      </p>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
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
          Información del Estudiante
        </div>

        <div style={{ padding: '1rem 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Número de Control</span>
            <span>{studentData.numeroControl}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0'
          }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Carrera</span>
            <span>{studentData.carrera}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useSearchParams } from 'next/navigation';

// export default function DashboardPage() {
//   const searchParams = useSearchParams();
//   const fullName = searchParams.get('name');

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1 style={{ fontSize: '2rem' }}>¡Bien, {fullName}!</h1>
//       <p>Estás en la página principal del sistema.</p>
//     </div>
//   );
// }'
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const datosFicticios = {
  matricula: '2024001',
  carrera: 'Ingeniería en Sistemas',
  semestre: 5,
  creditos: 42,
  email: 'correo@example.com',
  telefono: '555-123-4567',
  horario: [
    { dia: 'Lunes', materia: 'Matemáticas', hora: '8:00 - 10:00' },
    { dia: 'Miércoles', materia: 'Programación', hora: '10:00 - 12:00' },
    { dia: 'Viernes', materia: 'Física', hora: '14:00 - 16:00' },
  ],
};

export default function PerfilEstudiante() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');

  const [nombreReal, setNombreReal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nameParam) return;

    setLoading(true);
    setTimeout(() => {
      setNombreReal(nameParam);
      setLoading(false);
    }, 600);
  }, [nameParam]);

  if (!nameParam) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>No se proporcionó un nombre en la URL.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Nombre separado */}
        <h1 style={styles.title}>Bienvenido, {nombreReal}</h1>

        {/* Cuadro azul con datos */}
        <div style={styles.infoBox}>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Matrícula</strong>
              <span>{datosFicticios.matricula}</span>
            </div>
            <div style={styles.infoItem}>
              <strong>Carrera</strong>
              <span>{datosFicticios.carrera}</span>
            </div>
            <div style={styles.infoItem}>
              <strong>Semestre</strong>
              <span>{datosFicticios.semestre}</span>
            </div>
            <div style={styles.infoItem}>
              <strong>Créditos</strong>
              <span>{datosFicticios.creditos}</span>
            </div>
            <div style={styles.infoItem}>
              <strong>Email</strong>
              <span>{datosFicticios.email}</span>
            </div>
            <div style={styles.infoItem}>
              <strong>Teléfono</strong>
              <span>{datosFicticios.telefono}</span>
            </div>
          </div>
        </div>

        <h2 style={styles.scheduleTitle}>Horario de clases</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Día</th>
              <th style={styles.th}>Materia</th>
              <th style={styles.th}>Hora</th>
            </tr>
          </thead>
          <tbody>
            {datosFicticios.horario.map(({ dia, materia, hora }) => (
              <tr key={dia + materia} style={styles.tr}>
                <td style={styles.td}>{dia}</td>
                <td style={styles.td}>{materia}</td>
                <td style={styles.td}>{hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '3rem 1rem',
  
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2.5rem 3rem',
    
    maxWidth: '720px',
    width: '100%',
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e3a8a', // azul intenso
    marginBottom: '1.5rem',
    justifyContent:'center',
  },
  infoBox: {
   
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(30, 60, 200, 0.1)', // sombra azul más ligera
    marginBottom: '3rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.6rem 2.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    color: '#1e40af', // azul medio
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  scheduleTitle: {
    fontSize: '2rem',
   
    borderBottom: '3px solid #3b82f6', // azul vivo
    paddingBottom: '0.3rem',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 0.75rem',
  },
  th: {
    textAlign: 'left',
    color: '#2563eb', // azul más vivo
    fontWeight: '600',
    paddingBottom: '0.5rem',
  },
  tr: {
    backgroundColor: '#bfdbfe', // azul muy suave para filas
    borderRadius: '12px',
  },
  td: {
    padding: '0.75rem 1rem',
    color: '#1e40af',
    fontWeight: '500',
  },
  message: {
    fontSize: '1.4rem',
    color: '#3b82f6',
    backgroundColor: '#dbE9ff',
    padding: '1rem 2rem',
    borderRadius: '12px',
  },
};

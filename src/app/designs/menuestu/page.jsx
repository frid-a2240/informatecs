'use client';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const fullName = searchParams.get('name');

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>¡Bienvenido, {fullName}!</h1>
      <p>Estás en la página principal del sistema.</p>
    </div>
  );
}

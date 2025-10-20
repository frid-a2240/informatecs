'use client';
import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';

export default function AlumnosPanel() {
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const buscar = async (valor) => {
    const query = valor.trim().toLowerCase();
    if (!query) return setBuscado(false), setAlumnos([]);

    try {
      setLoading(true);
      setBuscado(true);
      const res = await fetch('/api/estudiantes');
      if (!res.ok) return;
      const data = await res.json();
      const filtrados = data.filter((e) => {
        const nombre = `${e.alunom ?? ''} ${e.aluapp ?? ''} ${e.aluapm ?? ''}`.toLowerCase();
        return nombre.includes(query) || (e.aluctr ?? '').toLowerCase().includes(query);
      });
      setAlumnos(filtrados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setBusqueda(val);
    val.length >= 2 ? buscar(val) : (setBuscado(false), setAlumnos([]));
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Encabezado */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Alumnos</h2>
        <p className="text-gray-500">Busca estudiantes por nombre o número de control</p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            value={busqueda}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && buscar(busqueda)}
            placeholder="Escribe nombre o número de control..."
            className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2 focus:border-blue-400 focus:outline-none"
          />
        </div>
        
      </div>

      {/* Cargando */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-md text-center p-12 text-gray-600">
          Buscando estudiantes...
        </div>
      )}

      {/* Resultados */}
      {!loading && buscado && (
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
          {alumnos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users size={64} className="mx-auto opacity-40 mb-4" />
              <h3 className="font-semibold text-gray-700">No se encontraron estudiantes</h3>
              <p>Intenta con otro nombre o número de control</p>
            </div>
          ) : (
            <>
              <div className="inline-block bg-blue-500 text-white rounded-xl px-6 py-3 mb-4">
                <p className="text-sm">Resultados Encontrados</p>
                <h2 className="text-2xl font-bold">{alumnos.length}</h2>
              </div>

              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left py-3 px-4 border-b">No. Control</th>
                    <th className="text-left py-3 px-4 border-b">Nombre Completo</th>
                    <th className="text-left py-3 px-4 border-b">Carrera</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((a, i) => (
                    <tr
                      key={a.aluctr}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="py-3 px-4 border-b">{a.aluctr}</td>
                      <td className="py-3 px-4 border-b">
                        {[a.alunom, a.aluapp, a.aluapm].filter(Boolean).join(' ') || 'Sin nombre'}
                      </td>
                      <td className="py-3 px-4 border-b text-gray-600">{a.carrera || 'Sin carrera'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Estado inicial */}
      {!loading && !buscado && (
        <div className="bg-white rounded-2xl shadow-md text-center py-16 px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-700">Busca un estudiante</h3>
          <p className="text-gray-500">
            Usa el buscador para encontrar estudiantes por nombre o número de control
          </p>
        </div>
      )}

      {/* Panel inferior (opcional) */}
      {buscado && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
            <p className="text-sm">Total Alumnos</p>
            <h2 className="text-3xl font-bold">{alumnos.length}</h2>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-4 text-center">
            <p className="text-sm">Activos</p>
            <h2 className="text-3xl font-bold">
              {alumnos.filter((a) => a.activo).length || 0}
            </h2>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-4 text-center">
            <p className="text-sm">Carreras Registradas</p>
            <h2 className="text-3xl font-bold">
              {[...new Set(alumnos.map((a) => a.carrera))].length || 0}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

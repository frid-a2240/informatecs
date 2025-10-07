"use client";

import React, { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";

const AlumnosPanel = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/estudiantes");
      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
      est.aluapm || ""
    }`.toLowerCase();
    const numControl = (est.aluctr || "").toLowerCase();
    const termino = busqueda.toLowerCase();
    return nombreCompleto.includes(termino) || numControl.includes(termino);
  });

  if (loading) {
    return <div className="apanel-loading">Cargando estudiantes...</div>;
  }

  return (
    <div className="apanel-container">
      <div className="apanel-header">
        <h2>Lista de Alumnos</h2>
        <p>Total de estudiantes registrados: {estudiantes.length}</p>
      </div>

      <div className="apanel-buscador">
        <div className="apanel-search-wrapper">
          <Search className="apanel-search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o número de control..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="apanel-stats">
        <div className="apanel-stat total-estudiantes">
          <h4>Total Estudiantes</h4>
          <p>{estudiantes.length}</p>
        </div>
        <div className="apanel-stat resultados-busqueda">
          <h4>Resultados Búsqueda</h4>
          <p>{estudiantesFiltrados.length}</p>
        </div>
      </div>

      <div className="apanel-lista">
        {estudiantesFiltrados.length === 0 ? (
          <div className="apanel-no-results">
            <Users size={48} />
            <p>No se encontraron estudiantes</p>
          </div>
        ) : (
          <div className="apanel-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No. Control</th>
                  <th>Nombre Completo</th>
                  <th>Carrera</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map((est) => {
                  const nombreCompleto = `${est.alunom || ""} ${
                    est.aluapp || ""
                  } ${est.aluapm || ""}`.trim();
                  return (
                    <tr key={est.aluctr}>
                      <td>{est.aluctr}</td>
                      <td>{nombreCompleto || "Sin nombre"}</td>
                      <td>{est.carrera || "Sin carrera"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumnosPanel;

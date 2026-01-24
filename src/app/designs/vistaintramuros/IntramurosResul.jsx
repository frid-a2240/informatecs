"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Trophy, TrendingUp, Filter } from "lucide-react";
import "./IntramurosResults.css";

// URL de tu API de Google Apps Script (Resultados)
const RESULTS_API_URL = "https://script.google.com/macros/s/AKfycbzWV3wcc8CST1SNaZQoj1zHcOvbHriuLZzEcbrV9IZ1oS9X67Ndf_ekkiWeSuOF4uMa6Q/exec";

const IntramurosResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [activityList, setActivityList] = useState([]);

  // Carga de datos inicial
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(RESULTS_API_URL);
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        
        const rawData = await response.json();
        if (rawData.error) throw new Error(rawData.error);

        const dataArray = rawData.data || [];
        
        // Extraer lista única de actividades para el filtro
        const uniqueActivitiesMap = dataArray.reduce((acc, current) => {
          if (current.ID_Actividad && current.Actividad && !acc[current.ID_Actividad]) {
            acc[current.ID_Actividad] = current.Actividad;
          }
          return acc;
        }, {});

        const activities = Object.keys(uniqueActivitiesMap).map((id) => ({
          ID: id,
          Nombre: uniqueActivitiesMap[id],
        }));

        setResults(dataArray);
        setActivityList(activities);
        
        if (activities.length > 0) {
          setSelectedActivityID(activities[0].ID);
        }
      } catch (e) {
        setError(`Error al obtener datos: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Transformación de datos para la gráfica
  const chartDetails = useMemo(() => {
    if (!selectedActivityID || results.length === 0) {
      return { chartData: [], dataKey: "Puntos", yAxisLabel: "Puntos" };
    }

    // Filtramos por actividad y ordenamos por la columna "Posición" del Excel
    const filteredResults = results
      .filter((r) => String(r.ID_Actividad) === String(selectedActivityID))
      .sort((a, b) => (Number(a.Posición) || 0) - (Number(b.Posición) || 0));

    if (filteredResults.length === 0) {
      return { chartData: [], dataKey: "Puntos", yAxisLabel: "Puntos" };
    }

    // La llave que Recharts buscará en cada objeto es "Puntos"
    const dataKey = "Puntos";

    const chartData = filteredResults.map((r) => {
      // Si hay un equipo (que no sea Individual), lo mostramos como nombre principal
      const displayName = r.Nombre_Equipo && r.Nombre_Equipo !== "Individual" 
        ? r.Nombre_Equipo 
        : r.Nombre_Participante;

      // Importante: Convertir el valor de Puntos a número para que la barra suba
      const valorNumerico = parseFloat(r.Puntos) || 0;

      return {
        name: `${r.Posición}° ${displayName}`,
        [dataKey]: valorNumerico,
        unidad: r.Unidad || "Puntos",
        posicion: Number(r.Posición)
      };
    });

    return { 
      chartData, 
      dataKey, 
      yAxisLabel: filteredResults[0]?.Unidad || "Puntos" 
    };
  }, [results, selectedActivityID]);

  const { chartData, dataKey, yAxisLabel } = chartDetails;

  // Colores para el podio (Oro, Plata, Bronce)
  const getBarColor = (pos) => {
    switch(pos) {
      case 1: return "#fbbf24"; // Amarillo/Oro
      case 2: return "#94a3b8"; // Gris/Plata
      case 3: return "#92400e"; // Café/Bronce
      default: return "#2563eb"; // Azul institucional
    }
  };

  if (loading) return <div className="intramuros-container"><div className="loading-state">Cargando resultados...</div></div>;
  if (error) return <div className="intramuros-container"><div className="error-state">{error}</div></div>;

  return (
    <div className="intramuros-container">
      <header className="intramuros-header">
        <div className="header-info">
          <div className="header-icon"><Trophy size={28} /></div>
          <div className="intramuros-title">
            <h1>Ranking y Estadísticas</h1>
            <p>Instituto Tecnológico de Ensenada</p>
          </div>
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={selectedActivityID || ""}
            onChange={(e) => setSelectedActivityID(e.target.value)}
            className="activity-select"
          >
            {activityList.map((activity) => (
              <option key={activity.ID} value={activity.ID}>{activity.Nombre}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="content-area">
        <h3 className="activity-subtitle">
          {activityList.find(a => String(a.ID) === String(selectedActivityID))?.Nombre} - Top Resultados
        </h3>

        {chartData.length > 0 ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-40} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 12, fill: "#374151" }}
                  height={100}
                />
                <YAxis 
                  label={{ value: yAxisLabel, angle: -90, position: "insideLeft", offset: -5 }} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name, props) => [`${value} ${props.payload.unidad}`, "Resultado"]}
                />
                <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.posicion)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data-state">
            <TrendingUp size={48} className="no-data-icon" />
            <p>No hay datos de ranking disponibles para esta actividad.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntramurosResults;
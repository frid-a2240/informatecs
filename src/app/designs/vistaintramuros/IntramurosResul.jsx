"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Trophy, TrendingUp, Filter } from "lucide-react";
import "./IntramurosResults.css";

<<<<<<< HEAD
// Cambia la URL para apuntar específicamente a la hoja de resultados
const RESULTS_API_URL = "/api/intramuros?hoja=resultado";
=======
// URL de tu API de Google Apps Script (Resultados)
const RESULTS_API_URL = "https://script.google.com/macros/s/AKfycbzWV3wcc8CST1SNaZQoj1zHcOvbHriuLZzEcbrV9IZ1oS9X67Ndf_ekkiWeSuOF4uMa6Q/exec";
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e

const IntramurosResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [activityList, setActivityList] = useState([]);

<<<<<<< HEAD
=======
  // Carga de datos inicial
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(RESULTS_API_URL);
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        
<<<<<<< HEAD
        const result = await response.json();
        
        // Log para que verifiques los nombres de las columnas en la consola del navegador console.log("Datos recibidos de Google Sheets:", result);

        if (result.status === "success" && Array.isArray(result.data)) {
          const dataArray = result.data;

          // Mapeo de actividades usando los nombres exactos de tu Excel
          const uniqueActivitiesMap = dataArray.reduce((acc, current) => {
            const id = current.ID_Actividad; 
            const nombre = current.Actividad;
            
            if (id && nombre && !acc[id]) {
              acc[id] = nombre;
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
=======
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
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
        }
      } catch (e) {
        setError(`Error al obtener datos: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

<<<<<<< HEAD
  const chartDetails = useMemo(() => {
    if (!selectedActivityID || results.length === 0) {
      return { chartData: [], dataKey: "Puntaje_Final", yAxisLabel: "Puntos" };
    }

    // Filtrado por ID_Actividad (asegurando coincidencia de tipos)
    const filteredResults = results
      .filter((r) => String(r.ID_Actividad) === String(selectedActivityID))
      .sort((a, b) => (Number(a.Posicion) || 0) - (Number(b.Posicion) || 0));

    if (filteredResults.length === 0) return { chartData: [], dataKey: "Puntaje_Final", yAxisLabel: "Puntos" };

    const firstResult = filteredResults[0];
    const unitLabel = firstResult.Unidad || "Puntos";

    const chartData = filteredResults.map((r) => {
      // Prioridad: Nombre_Equipo > Nombre_Participante
      const etiquetaPrincipal = (r.Nombre_Equipo && r.Nombre_Equipo !== "Individual") 
        ? r.Nombre_Equipo 
        : (r.Nombre_Participante || "Participante");

      // Limpieza de valores numéricos (maneja casos donde el Excel envía texto)
      const valorNumerico = typeof r.Puntaje_Final === 'string' 
        ? parseFloat(r.Puntaje_Final.replace(',', '.')) 
        : parseFloat(r.Puntaje_Final);

      return {
        name: `${r.Posicion || "S/P"}° ${etiquetaPrincipal}`,
        Puntaje_Final: valorNumerico || 0,
        unidad: r.Unidad || "Puntos",
        participante: r.Nombre_Participante || "N/A",
        equipo: r.Nombre_Equipo || "Individual"
      };
    });

    return { chartData, dataKey: "Puntaje_Final", yAxisLabel: unitLabel };
=======
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
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
  }, [results, selectedActivityID]);

  const { chartData, dataKey, yAxisLabel } = chartDetails;

<<<<<<< HEAD
  if (loading) return <div className="intramuros-container"><div className="loading-state">Cargando estadísticas...</div></div>;

=======
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

>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
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
<<<<<<< HEAD
=======

>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={selectedActivityID || ""}
            onChange={(e) => setSelectedActivityID(e.target.value)}
            className="activity-select"
          >
<<<<<<< HEAD
            {activityList.map((act) => (
              <option key={act.ID} value={act.ID}>{act.Nombre}</option>
=======
            {activityList.map((activity) => (
              <option key={activity.ID} value={activity.ID}>{activity.Nombre}</option>
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
            ))}
          </select>
        </div>
      </header>

      <div className="content-area">
<<<<<<< HEAD
=======
        <h3 className="activity-subtitle">
          {activityList.find(a => String(a.ID) === String(selectedActivityID))?.Nombre} - Top Resultados
        </h3>

>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
        {chartData.length > 0 ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
<<<<<<< HEAD
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unidad}`,
                    props.payload.equipo !== "Individual" 
                      ? `Equipo: ${props.payload.equipo}` 
                      : `Participante: ${props.payload.participante}`
                  ]}
                />
                <Bar dataKey={dataKey} fill="#2563eb" radius={[4, 4, 0, 0]} />
=======
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
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data-state">
<<<<<<< HEAD
            <TrendingUp size={48} />
            <p>No hay resultados disponibles para esta actividad.</p>
=======
            <TrendingUp size={48} className="no-data-icon" />
            <p>No hay datos de ranking disponibles para esta actividad.</p>
>>>>>>> df34d6307ddc3415dfb074a99d512a71222d601e
          </div>
        )}
      </div>
    </div>
  );
};

export default IntramurosResults;
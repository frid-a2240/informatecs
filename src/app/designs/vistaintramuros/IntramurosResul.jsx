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
} from "recharts";
import { Trophy, TrendingUp, Filter } from "lucide-react";
import "./IntramurosResults.css";

// ¡URL DE LA API MANTENIDA SIN CAMBIOS!
const RESULTS_API_URL =
  "https://script.google.com/macros/s/AKfycbzWV3wcc8CST1SNaZQoj1zHcOvbHriuLZzEcbrV9IZ1oS9X67Ndf_ekkiWeSuOF4uMa6Q/exec";

const IntramurosResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [activityList, setActivityList] = useState([]);

  // Lógica para cargar resultados y lista de actividades
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(RESULTS_API_URL);

        if (!response.ok) {
          throw new Error(
            `Error HTTP ${response.status}: No se pudo acceder a la API.`
          );
        }

        const rawData = await response.json();

        if (rawData.error) {
          throw new Error(`Error de Google Apps Script: ${rawData.error}`);
        }

        const dataArray = rawData.data || [];

        const uniqueActivitiesMap = dataArray.reduce((acc, current) => {
          if (
            current.ID_Actividad &&
            current.Actividad &&
            !acc[current.ID_Actividad]
          ) {
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
        } else {
          setSelectedActivityID(null);
        }
      } catch (e) {
        setError(`Error al obtener datos: ${e.message || "Error desconocido"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Lógica para transformar los datos para el gráfico
  const chartDetails = useMemo(() => {
    if (!selectedActivityID || results.length === 0) {
      return { chartData: [], dataKey: null, yAxisLabel: null };
    }

    const filteredResults = results
      .filter((r) => String(r.ID_Actividad) === String(selectedActivityID))
      .sort((a, b) => a.Posicion - b.Posicion);

    if (filteredResults.length === 0) {
      return { chartData: [], dataKey: null, yAxisLabel: null };
    }

    const firstResult = filteredResults[0];
    const unit = firstResult.Unidad
      ? String(firstResult.Unidad).toLowerCase()
      : "puntos";

    const valueKey =
      unit.includes("minuto") || unit.includes("segundo")
        ? "Tiempo_minutos"
        : "Puntos_totales";

    const chartData = filteredResults.map((r) => {
      const numericValue = r.Puntaje_Final || 0;
      return {
        name: `${r.Posicion}° ${r.Nombre_Participante}`,
        [valueKey]: Number(numericValue),
        unidad: r.Unidad,
      };
    });

    const yAxisLabel =
      firstResult?.Unidad ||
      (valueKey === "Tiempo_minutos" ? "Tiempo (minutos)" : "Puntos");

    return { chartData, dataKey: valueKey, yAxisLabel };
  }, [results, selectedActivityID]);

  const { chartData, dataKey, yAxisLabel } = chartDetails;

  const chartTitle = useMemo(() => {
    return (
      activityList.find((a) => String(a.ID) === String(selectedActivityID))
        ?.Nombre || "Actividad Desconocida"
    );
  }, [activityList, selectedActivityID]);

  const handleActivityChange = useCallback((e) => {
    setSelectedActivityID(e.target.value);
  }, []);

  // Renderizado de estados de carga y error
  if (loading) {
    return (
      <div className="intramuros-container">
        <div className="loading-state">
          Cargando resultados y estadísticas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="intramuros-container">
        <div className="error-state">
          <p className="error-title">Error al cargar datos:</p>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="intramuros-container">
        <div className="empty-state">
          <TrendingUp size={48} className="empty-icon" />
          <p className="empty-title">
            No hay resultados finales cargados en la base de datos.
          </p>
          <p className="empty-description">
            Verifique la conexión de la API o la fuente de datos.
          </p>
        </div>
      </div>
    );
  }

  // RENDERIZADO PRINCIPAL
  return (
    <div className="intramuros-container">
      {/* ============================== */}
      {/* HEADER (Encabezado Oscuro con Filtro Integrado) */}
      {/* ============================== */}
      <header className="intramuros-header">
        <div className="header-info">
          <div className="header-icon">
            <Trophy size={28} />
          </div>
          <div className="intramuros-title">
            <h1>Ranking y Estadísticas</h1>
            <p>Instituto Tecnológico de Ensenada</p>
          </div>
        </div>

        {/* FILTRO DENTRO DEL HEADER */}
        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={selectedActivityID || ""}
            onChange={handleActivityChange}
            className="activity-select"
          >
            <option value="" disabled>
              Selecciona una Actividad
            </option>
            {activityList.map((activity) => (
              <option key={activity.ID} value={activity.ID}>
                {activity.Nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* ============================== */}
      {/* CONTENIDO (Subtítulo y Gráfico) */}
      {/* ============================== */}
      <div className="content-area">
        <h3 className="activity-subtitle">{chartTitle} - Top Resultados</h3>

        {/* GRÁFICO O ESTADO SIN DATOS PARA LA ACTIVIDAD */}
        {chartData.length > 0 && dataKey ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unidad}`,
                    name,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey={dataKey}
                  name={yAxisLabel}
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data-state">
            <TrendingUp size={48} className="no-data-icon" />
            <p className="no-data-title">
              No hay datos de ranking para esta actividad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntramurosResults;

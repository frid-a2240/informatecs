"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const RESULTS_API_URL =
  "https://script.google.com/macros/s/AKfycbzWV3wcc8CST1SNaZQoj1zHcOvbHriuLZzEcbrV9IZ1oS9X67Ndf_ekkiWeSuOF4uMa6Q/exec";

const IntramurosResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(RESULTS_API_URL);

        if (!response.ok) {
          throw new Error(
            `Error HTTP ${response.status}: No se pudo acceder a la API.`
          );
        }

        const rawData = await response.json();

        if (rawData.error) {
          throw new Error(`Error de GAS: ${rawData.error}`);
        }

        const dataArray = rawData.data || [];

        const uniqueActivitiesMap = dataArray.reduce((acc, current) => {
          if (!acc[current.ID_Actividad]) {
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

        setLoading(false);
      } catch (e) {
        setError(`Error: ${e.message}`);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const chartData = useMemo(() => {
    if (!selectedActivityID) return [];

    return results
      .filter((r) => r.ID_Actividad == selectedActivityID)
      .sort((a, b) => a.Posicion - b.Posicion)
      .map((r) => {
        const unit = r.Unidad ? String(r.Unidad).toLowerCase() : "puntos";
        const valueKey =
          unit.includes("minuto") || unit.includes("segundo")
            ? "Tiempo_minutos"
            : "Puntos_totales";

        const numericValue = r.Puntaje_Final || 0;

        return {
          name: `${r.Posicion}° ${r.Nombre_Participante}`,
          [valueKey]: Number(numericValue),
          unidad: r.Unidad,
        };
      });
  }, [results, selectedActivityID]);

  const chartKeys = useMemo(() => {
    if (chartData.length === 0) return { dataKey: null, yAxisLabel: null };

    const dataKey = Object.keys(chartData[0]).find(
      (key) => key.includes("Tiempo") || key.includes("Puntos")
    );
    const yAxisLabel =
      chartData[0]?.unidad ||
      (dataKey === "Tiempo_minutos" ? "Tiempo (minutos)" : "Puntos");

    return { dataKey, yAxisLabel };
  }, [chartData]);

  const { dataKey, yAxisLabel } = chartKeys;

  const chartTitle =
    activityList.find((a) => a.ID == selectedActivityID)?.Nombre ||
    "Actividad Desconocida";

  if (loading) {
    return (
      <div className="loading-state">Cargando resultados y estadísticas...</div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p className="error-title">Error al cargar datos:</p>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="empty-state">
        <TrendingUp size={48} className="empty-icon" />
        <p className="empty-title">
          No hay resultados finales disponibles para graficar.
        </p>
        <p className="empty-description">
          Verifique la pestaña "RESULTADOS" en su Google Sheet.
        </p>
      </div>
    );
  }

  return (
    <div className="intramuros-container">
      <div className="intramuros-header">
        <h2 className="intramuros-title">
          <Trophy size={28} />
          Ranking y Estadísticas Intramuros
        </h2>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={selectedActivityID || ""}
            onChange={(e) => setSelectedActivityID(e.target.value)}
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
      </div>

      <h3 className="activity-subtitle">{chartTitle} - Top Resultados</h3>

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
                fill="#007bff"
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
  );
};

export default IntramurosResults;

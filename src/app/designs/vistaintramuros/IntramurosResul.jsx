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

const RESULTS_API_URL =
  "https://script.google.com/macros/s/AKfycby5vPBAs8mWILW3cDcPv21OIXG0tcGb2E21iEwbgODxxWh56bRIV_p180rfcthP0LjC/exec";

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

        // Aseguramos que el valor sea 0 si es nulo o vacío, evitando NaN
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
      <div className="p-12 text-center text-blue-600 font-bold text-lg">
        Cargando resultados y estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-red-50 border border-red-300 rounded-lg text-red-700">
        <p className="font-bold mb-2">Error al cargar datos:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="p-12 text-center text-gray-500">
        <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="font-semibold">
          No hay resultados finales disponibles para graficar.
        </p>
        <p className="text-sm text-gray-400">
          Verifique la pestaña "RESULTADOS" en su Google Sheet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <Trophy className="text-yellow-600" size={28} />
          Ranking y Estadísticas Intramuros
        </h2>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={selectedActivityID || ""}
            onChange={(e) => setSelectedActivityID(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto font-semibold"
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

      <h3 className="text-xl font-semibold text-blue-600 mb-6 border-b pb-2">
        {chartTitle} - Top Resultados
      </h3>

      {chartData.length > 0 && dataKey ? (
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
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
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
      ) : (
        <div className="text-center py-10 text-gray-500">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
          <p>No hay datos de ranking para esta actividad.</p>
        </div>
      )}
    </div>
  );
};

export default IntramurosResults;

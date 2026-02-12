"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  CheckCircle,
  FileX,
  Search,
  Loader2,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Layers,
} from "lucide-react";

export default function AdminSolicitudes() {
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [seleccionada, setSeleccionada] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const queryClient = useQueryClient();

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ["inscripciones"],
    queryFn: async () => {
      const res = await fetch("/api/inscripciones");
      if (!res.ok) throw new Error("Error al cargar");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // --- LÓGICA DE AGRUPACIÓN POR ESTUDIANTE ---
  const alumnosAgrupados = React.useMemo(() => {
    const grupos = {};

    solicitudes.forEach((reg) => {
      const id = reg.estudianteId;
      if (!grupos[id]) {
        grupos[id] = {
          ...reg,
          todasLasActividades: [],
        };
      }
      // Agregamos la actividad a la lista del alumno
      grupos[id].todasLasActividades.push(reg.actividad);
    });

    const lista = Object.values(grupos);
    if (filtroEstado === "pendiente") {
      return lista.filter((a) => a.tipoSangreSolicitado && !a.sangreValidada);
    }
    return lista;
  }, [solicitudes, filtroEstado]);

  const mutation = useMutation({
    mutationFn: async ({ aluctr, accion, actividades }) => {
      // 1. Validar sangre en la tabla de inscripciones
      const res = await fetch(`/api/sangre`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aluctr, accion, mensaje: motivoRechazo }),
      });
      if (!res.ok) throw new Error("Error en validación");

      // 2. Si se aprueba, crear constancias para CADA actividad inscrita
      if (accion === "aprobar") {
        for (const act of actividades) {
          await fetch("/api/constancias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              numeroControl: aluctr,
              actividadId: act.id,
              actividadNombre: act.acodes, // Usando tu campo acodes
              periodo: "2026-1",
            }),
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inscripciones"]);
      setSeleccionada(null);
      alert("Proceso completado exitosamente");
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black flex items-center gap-3 italic">
            <ShieldCheck className="text-blue-600" size={32} /> PANEL DE CONTROL
          </h1>
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border">
            {["todas", "pendiente"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroEstado(f)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filtroEstado === f ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LISTA DE ALUMNOS (DEDUPLICADA) */}
          <div className="lg:col-span-6 space-y-4">
            {alumnosAgrupados.map((alumno) => (
              <div
                key={alumno.estudianteId}
                onClick={() => setSeleccionada(alumno)}
                className={`p-6 rounded-[2rem] bg-white border-2 cursor-pointer transition-all ${seleccionada?.estudianteId === alumno.estudianteId ? "border-blue-600 shadow-xl scale-[1.02]" : "border-transparent shadow-sm"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 uppercase">
                        {alumno.estudiante?.alunom} {alumno.estudiante?.aluapp}
                      </h3>
                      <p className="text-[10px] font-bold text-blue-600 tracking-widest">
                        {alumno.estudianteId}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                    <Layers size={12} /> {alumno.todasLasActividades.length}{" "}
                    ACTIVIDADES
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DETALLE Y VALIDACIÓN */}
          <div className="lg:col-span-6">
            {seleccionada ? (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border p-8 sticky top-6">
                <h2 className="text-xl font-black mb-6 uppercase">
                  Revisión de Documento
                </h2>

                {/* LISTA DE ACTIVIDADES A LAS QUE SE LES GENERARÁ CONSTANCIA */}
                <div className="mb-8 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actividades a liberar:
                  </label>
                  {seleccionada.todasLasActividades.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <BookOpen size={14} className="text-blue-500" />
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        {act.acodes}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100 rounded-3xl h-64 mb-6 flex items-center justify-center overflow-hidden border-4 border-slate-50">
                  {seleccionada.comprobanteSangrePDF ? (
                    <img
                      src={seleccionada.comprobanteSangrePDF}
                      className="object-contain w-full h-full"
                      alt="Sangre"
                    />
                  ) : (
                    <FileX size={48} className="text-slate-300" />
                  )}
                </div>

                <textarea
                  placeholder="Motivo de rechazo..."
                  className="w-full p-4 bg-slate-50 border rounded-2xl mb-4 text-sm resize-none h-20 outline-none focus:border-blue-500"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      mutation.mutate({
                        aluctr: seleccionada.estudianteId,
                        accion: "aprobar",
                        actividades: seleccionada.todasLasActividades,
                      })
                    }
                    className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    APROBAR TODO
                  </button>
                  <button
                    onClick={() =>
                      mutation.mutate({
                        aluctr: seleccionada.estudianteId,
                        accion: "rechazar",
                      })
                    }
                    className="bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs hover:bg-red-100 transition-all"
                  >
                    RECHAZAR
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 border-4 border-dashed rounded-[3rem] flex items-center justify-center text-slate-300 font-black uppercase text-sm italic">
                Selecciona un expediente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

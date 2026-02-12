"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Activity,
  XCircle,
  CheckCircle,
  FileX,
  Search,
  Loader2,
  MessageSquare,
} from "lucide-react";

export default function AdminSolicitudes() {
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [seleccionada, setSeleccionada] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const queryClient = useQueryClient();

  // 1. CARGA DE DATOS
  const { data: solicitudes = [], isLoading: cargandoLista } = useQuery({
    queryKey: ["inscripciones"],
    queryFn: async () => {
      const res = await fetch("/api/inscripciones");
      if (!res.ok) throw new Error("Error al cargar inscripciones");
      return res.json();
    },
    refetchInterval: 15000, // Refresca cada 15 seg para ver nuevos archivos
  });

  // 2. MUTACIÓN (APROBAR/RECHAZAR)
  const actualizarSangreMutation = useMutation({
    mutationFn: async ({ numeroControl, data }) => {
      const res = await fetch(`/api/sangre`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluctr: numeroControl,
          ...data,
        }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Error en servidor" }));
        throw new Error(errorData.error || "Error al procesar");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Limpiamos caché para que el alumno desaparezca de pendientes
      queryClient.invalidateQueries(["inscripciones"]);

      // Cerramos ficha y limpiamos mensaje
      setSeleccionada(null);
      setMotivoRechazo("");

      const esRechazo = variables.data.accion === "rechazar";
      alert(esRechazo ? "❌ Documento Rechazado" : "✅ Documento Aprobado");
    },
    onError: (error) => {
      alert("Hubo un problema: " + error.message);
    },
  });

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtroEstado === "todas") return true;
    if (filtroEstado === "pendiente")
      return s.tipoSangreSolicitado && !s.sangreValidada;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Activity size={28} />
            </div>
            Validación de Documentos
          </h1>
        </header>

        {/* FILTROS (Mantenemos tu estilo original) */}
        <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-8 border border-slate-200 shadow-sm">
          <button
            onClick={() => setFiltroEstado("todas")}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${filtroEstado === "todas" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroEstado("pendiente")}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${filtroEstado === "pendiente" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
          >
            Pendientes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LISTADO IZQUIERDO */}
          <div className="lg:col-span-7 space-y-4">
            {cargandoLista ? (
              <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : solicitudesFiltradas.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[32px] border-4 border-dashed border-slate-100">
                <Search className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold tracking-tight">
                  No hay solicitudes pendientes
                </p>
              </div>
            ) : (
              solicitudesFiltradas.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSeleccionada(s);
                    setMotivoRechazo("");
                  }}
                  className={`group p-5 bg-white rounded-[24px] border-2 transition-all cursor-pointer flex justify-between items-center ${seleccionada?.id === s.id ? "border-blue-500 bg-blue-50/40 shadow-xl" : "border-transparent shadow-sm hover:border-slate-200"}`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center ${s.sangreValidada ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      <User size={28} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-lg leading-tight uppercase">
                        {s.estudiante.alunom} {s.estudiante.aluapp}
                      </p>
                      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                        Control: {s.estudianteId}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl border-2 font-black text-xs ${s.sangreValidada ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"}`}
                  >
                    {s.tipoSangreSolicitado || "S/D"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PANEL DE ACCIÓN DERECHO */}
          <div className="lg:col-span-5">
            {seleccionada ? (
              <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden sticky top-8 animate-in fade-in slide-in-from-right-4">
                <div
                  className={`p-8 text-white ${seleccionada.sangreValidada ? "bg-emerald-600" : "bg-slate-900"}`}
                >
                  <h2 className="text-2xl font-black mb-1">Ficha Médica</h2>
                  <p className="text-xs opacity-70 font-black tracking-widest uppercase">
                    {seleccionada.estudianteId}
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  {/* VISOR (Imagen en LongText) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Documento Adjunto
                    </label>
                    <div className="rounded-2xl border-4 border-slate-50 overflow-hidden bg-slate-100 h-64 flex items-center justify-center">
                      {seleccionada.comprobanteSangrePDF ? (
                        <img
                          src={seleccionada.comprobanteSangrePDF}
                          className="max-w-full max-h-full object-contain shadow-inner"
                          alt="Certificado"
                        />
                      ) : (
                        <FileX className="text-slate-200" size={48} />
                      )}
                    </div>
                  </div>

                  {!seleccionada.sangreValidada && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12} /> Motivo del rechazo
                          (Opcional)
                        </label>
                        <textarea
                          value={motivoRechazo}
                          onChange={(e) => setMotivoRechazo(e.target.value)}
                          placeholder="Escribe por qué se rechaza para que el alumno lo corrija..."
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-500 outline-none transition-all resize-none h-24"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <button
                          disabled={actualizarSangreMutation.isPending}
                          onClick={() =>
                            actualizarSangreMutation.mutate({
                              numeroControl: seleccionada.estudianteId,
                              data: {
                                accion: "aprobar",
                                tipoSangre: seleccionada.tipoSangreSolicitado,
                              },
                            })
                          }
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actualizarSangreMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <CheckCircle size={20} />
                          )}
                          APROBAR DOCUMENTO
                        </button>

                        <button
                          disabled={actualizarSangreMutation.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                "¿Rechazar documento? El alumno verá tu motivo.",
                              )
                            ) {
                              actualizarSangreMutation.mutate({
                                numeroControl: seleccionada.estudianteId,
                                data: {
                                  accion: "rechazar",
                                  mensaje: motivoRechazo,
                                },
                              });
                            }
                          }}
                          className="w-full bg-white text-red-600 border-2 border-red-100 py-4 rounded-2xl font-black hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actualizarSangreMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <XCircle size={20} />
                          )}
                          RECHAZAR Y NOTIFICAR
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-[400px] border-4 border-dashed border-slate-200 rounded-[48px] flex flex-col items-center justify-center text-slate-300 bg-white/50">
                <Search size={64} className="mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-sm text-center px-10">
                  Selecciona un alumno para revisar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// app/verificar/[folio]/page.jsx
"use client";
import { useState, useEffect, use } from "react";
import { CheckCircle, XCircle, Search, FileText, Calendar, User, Award } from "lucide-react";

export default function VerificarConstancia({ params }) {
  const [constancia, setConstancia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const resolvedParams = use(params);
  const folio = resolvedParams.folio;

  useEffect(() => {
    verificarConstancia();
  }, [folio]);

  const verificarConstancia = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/constancias?folio=${folio}`);
      const data = await response.json();

      if (response.ok && data.constancia) {
        setConstancia(data.constancia);
      } else {
        setError("Constancia no encontrada o folio inválido");
      }
    } catch (err) {
      console.error("Error al verificar:", err);
      setError("Error al verificar la constancia");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando constancia...</p>
        </div>
      </div>
    );
  }

  if (error || !constancia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Constancia No Válida
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "No se encontró ninguna constancia con este folio"}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ Esta constancia no existe en nuestros registros o el folio es incorrecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fechaEmision = new Date(constancia.fechaEmision).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden">
        {/* Header de verificación exitosa */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle size={48} className="animate-pulse" />
            <h1 className="text-3xl font-bold">Constancia Verificada</h1>
          </div>
          <p className="text-center text-green-100">
            ✓ Este documento es auténtico y está registrado en nuestro sistema
          </p>
        </div>

        {/* Información de la constancia */}
        <div className="p-8 space-y-6">
          {/* Folio y código */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
                  <FileText size={18} />
                  Folio Oficial
                </label>
                <p className="text-2xl font-bold text-blue-900 tracking-wider">
                  {constancia.folio}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
                  <Search size={18} />
                  Código de Verificación
                </label>
                <p className="text-xl font-mono font-bold text-blue-900">
                  {constancia.codigoVerificacion}
                </p>
              </div>
            </div>
          </div>

          {/* Datos del estudiante */}
          <div className="border-l-4 border-purple-500 pl-6 py-2">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={20} className="text-purple-500" />
              Datos del Estudiante
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Nombre Completo:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {constancia.nombreCompleto}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Número de Control:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {constancia.numeroControl}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de la actividad */}
          <div className="border-l-4 border-orange-500 pl-6 py-2">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award size={20} className="text-orange-500" />
              Actividad Complementaria
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Actividad:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {constancia.actividadNombre}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Código</p>
                  <p className="font-bold text-gray-900">{constancia.actividadCodigo}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Créditos</p>
                  <p className="font-bold text-gray-900">{constancia.actividadCreditos || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Horas</p>
                  <p className="font-bold text-gray-900">{constancia.actividadHoras || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Datos de acreditación */}
          <div className="border-l-4 border-green-500 pl-6 py-2">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-green-500" />
              Información de Acreditación
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Período:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {constancia.periodo}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Acreditación:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {constancia.acreditacion}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Asesoría:</strong> {constancia.asesor}
            </p>
            <p>
              <strong>Fecha de Emisión:</strong> {fechaEmision}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Instituto Tecnológico de Ensenada - Departamento de Actividades Complementarias
            </p>
          </div>

          {/* Mensaje de seguridad */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 text-center">
              🔒 Este documento ha sido verificado digitalmente. Cualquier alteración invalida su autenticidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
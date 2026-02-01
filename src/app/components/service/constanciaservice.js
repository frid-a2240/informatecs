// services/constanciaService.js

export const ConstanciaService = {
  /**
   * Filtra estudiantes únicos y determina si tienen actividades aprobadas (>= 70)
   */
  procesarListaEstudiantes(inscripciones) {
    if (!Array.isArray(inscripciones)) return [];
    
    const estudiantesUnicos = new Map();
    
    inscripciones.forEach((inscripcion) => {
      const estudiante = inscripcion?.estudiante;
      if (estudiante && estudiante.aluctr) {
        if (!estudiantesUnicos.has(estudiante.aluctr)) {
          // Filtramos las actividades de este estudiante específico
          const actividadesDelEstudiante = inscripciones.filter(
            (i) => i?.estudiante?.aluctr === estudiante.aluctr
          );
          
          const tieneAprobada = actividadesDelEstudiante.some(
            (i) => (i.calificacion || 0) >= 70
          );
          
          estudiantesUnicos.set(estudiante.aluctr, {
            ...estudiante,
            tieneActividadAprobada: tieneAprobada,
            totalActividades: actividadesDelEstudiante.length,
          });
        }
      }
    });

    return Array.from(estudiantesUnicos.values()).sort(
      (a, b) => (a.aluctr || "").localeCompare(b.aluctr || "")
    );
  },

  /**
   * Determina la unidad de medida (Horas/Créditos)
   */
  obtenerUnidadAcreditacion(proposito) {
    return proposito === "servicio_social" ? "Horas" : "Créditos";
  },

  /**
   * Realiza la petición POST a la API para persistir la constancia
   */
  async registrarConstanciaBaseDatos(datos) {
    const response = await fetch("/api/constancias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar en BD");
    }
    
    return await response.json();
  }
};
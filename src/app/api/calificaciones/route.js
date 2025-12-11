import { prisma } from "@/lib/prisma";

// GET - Obtener calificaciones
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const actividadId = searchParams.get("actividadId");

    if (!actividadId) {
      return new Response(
        JSON.stringify({ error: "actividadId es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("🔍 Buscando inscripciones para actividadId:", actividadId);

    const inscripciones = await prisma.inscripact.findMany({
      where: {
        actividadId: parseInt(actividadId),
      },
      include: {
        estudiante: true,
      },
    });

    // ✅ CAMBIO: Devolver array completo en lugar de objeto
    // Esto soluciona el error "inscripciones.forEach is not a function"
    console.log(`✅ Encontradas ${inscripciones.length} inscripciones`);

    return new Response(
      JSON.stringify(inscripciones), // Array completo
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en GET /api/calificaciones:", error);
    console.error("Código de error:", error.code);
    console.error("Mensaje:", error.message);
    
    // ✅ Verificar si es error de conexión
    if (error.code === 'P1001') {
      return new Response(
        JSON.stringify({ 
          error: "No se puede conectar a la base de datos",
          code: "DB_CONNECTION_ERROR" 
        }),
        { 
          status: 503, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // ✅ En caso de error, devolver array vacío para evitar crashes
    return new Response(
      JSON.stringify([]),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

// PUT - Actualizar calificaciones
export async function PUT(request) {
  try {
    const body = await request.json();
    const { actividadId, calificaciones } = body;

    console.log("💾 Intentando guardar calificaciones para actividad:", actividadId);
    console.log("📊 Calificaciones recibidas:", calificaciones);

    if (!actividadId || !calificaciones) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Validar que calificaciones sea un objeto
    if (typeof calificaciones !== 'object' || Array.isArray(calificaciones)) {
      return new Response(
        JSON.stringify({ error: "Formato de calificaciones inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const resultados = {
      exitosos: 0,
      fallidos: 0,
      errores: [],
    };

    // ✅ Procesar cada calificación con manejo de errores individual
    for (const [aluctr, datos] of Object.entries(calificaciones)) {
      try {
        console.log(`📝 Procesando calificación de ${aluctr}:`, datos);

        // Buscar la inscripción
        const inscripcion = await prisma.inscripact.findFirst({
          where: {
            estudianteId: aluctr,
            actividadId: parseInt(actividadId),
          },
        });

        if (!inscripcion) {
          console.warn(`⚠️ No se encontró inscripción para ${aluctr}`);
          resultados.fallidos++;
          resultados.errores.push({
            numeroControl: aluctr,
            mensaje: "Inscripción no encontrada",
          });
          continue;
        }
        
        // ✅ CAMBIO: Preparar formularioData con observaciones
        const formularioDataActual = inscripcion.formularioData || {};
        const nuevoFormularioData = {
          ...formularioDataActual,
          observaciones: datos.observaciones || null,
        };

        // Actualizar calificación
        await prisma.inscripact.update({
          where: {
            id: inscripcion.id,
          },
          data: {
            calificacion: datos.calificacion !== null && datos.calificacion !== "" 
              ? parseFloat(datos.calificacion) 
              : null,
             formularioData: nuevoFormularioData, // ✅ Observaciones aquí
          },
        });

        console.log(`✅ Calificación guardada para ${aluctr}`);
        resultados.exitosos++;
      } catch (errorIndividual) {
        console.error(`❌ Error al actualizar ${aluctr}:`, errorIndividual);
        resultados.fallidos++;
        resultados.errores.push({
          numeroControl: aluctr,
          mensaje: errorIndividual.message || "Error desconocido",
        });
      }
    }

    console.log("📊 Resultados finales:", resultados);

    return new Response(
      JSON.stringify({
        mensaje: `Actualización completada: ${resultados.exitosos} exitosos, ${resultados.fallidos} fallidos`,
        guardadas: resultados.exitosos, // ✅ AGREGADO: Campo que usa el frontend
        resultados,
      }),
      {
        status: resultados.exitosos > 0 ? 200 : 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en PUT /api/calificaciones:", error);
    console.error("Código de error:", error.code);
    console.error("Mensaje:", error.message);

    // ✅ Verificar si es error de conexión
    if (error.code === 'P1001') {
      return new Response(
        JSON.stringify({ 
          error: "No se puede conectar a la base de datos. Verifica tu conexión.",
          code: "DB_CONNECTION_ERROR",
          detalles: "El servidor de base de datos no está disponible"
        }),
        { 
          status: 503, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "Error al guardar calificaciones",
        detalles: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

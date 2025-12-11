import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get('aluctr');

    const whereClause = aluctr ? { estudianteId: aluctr } : {};

    const inscripciones = await prisma.inscripact.findMany({
      where: whereClause,
      include: {
        actividad: true,
        estudiante: {
          // ✅ CAMBIO: Usar select en lugar de include
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
            alusme: true,
            alusex: true,
            alumai: true,
            alutsa: true,
            inscripciones: true, // ✅ Traer todas y filtrar en JS
          },
        },
      },
      orderBy: { fechaInscripcion: 'desc' },
    });

    // ✅ TRANSFORMAR para incluir formularioData parseado
    const inscripcionesTransformadas = inscripciones.map((inscripcion) => {
      let formularioData = null;
      
      if (inscripcion.formularioData) {
        try {
          formularioData = typeof inscripcion.formularioData === 'string' 
            ? JSON.parse(inscripcion.formularioData) 
            : inscripcion.formularioData;
        } catch (error) {
          console.error("Error parseando formularioData:", error);
          formularioData = inscripcion.formularioData;
        }
      }

      // ✅ Filtrar y ordenar inscripciones en JavaScript
      let inscripcionMasReciente = null;
      if (Array.isArray(inscripcion.estudiante.inscripciones)) {
        inscripcionMasReciente = inscripcion.estudiante.inscripciones
          .filter(i => i.calnpe !== null && i.calnpe !== undefined)
          .sort((a, b) => b.calnpe - a.calnpe)[0] || null;
      }

      return {
        // ✅ INCLUIR TODOS LOS CAMPOS DE INSCRIPACT
        id: inscripcion.id,
        estudianteId: inscripcion.estudianteId,
        actividadId: inscripcion.actividadId,
        ofertaId: inscripcion.ofertaId,
        fechaInscripcion: inscripcion.fechaInscripcion,
        calificacion: inscripcion.calificacion,
        liberado: inscripcion.liberado,
        
        // ✅ CAMPOS DE TIPO DE SANGRE
        tipoSangreSolicitado: inscripcion.tipoSangreSolicitado,
        comprobanteSangrePDF: inscripcion.comprobanteSangrePDF,
        nombreArchivoSangre: inscripcion.nombreArchivoSangre,
        sangreValidada: inscripcion.sangreValidada,
        
        // Formulario parseado
        formularioData,
        
        // Relaciones
        actividad: inscripcion.actividad,
        estudiante: {
          aluctr: inscripcion.estudiante.aluctr,
          alunom: inscripcion.estudiante.alunom,
          aluapp: inscripcion.estudiante.aluapp,
          aluapm: inscripcion.estudiante.aluapm,
          alusme: inscripcion.estudiante.alusme,
          alusex: inscripcion.estudiante.alusex,
          alumai: inscripcion.estudiante.alumai,
          alutsa: inscripcion.estudiante.alutsa,
          inscripciones: inscripcionMasReciente, // ✅ Solo la más reciente
        },
      };
    });

    return new Response(
      JSON.stringify(inscripcionesTransformadas),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en GET /api/inscripciones:", error);
    
    return new Response(
      JSON.stringify([]),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        } 
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.aluctr || !body.actividadId || !body.ofertaId) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar si ya existe la inscripción
    const inscripcionExistente = await prisma.inscripact.findUnique({
      where: {
        estudianteId_actividadId: {
          estudianteId: body.aluctr,
          actividadId: Number(body.actividadId),
        },
      },
    });

    if (inscripcionExistente) {
      return new Response(
        JSON.stringify({ error: "Ya estás inscrito en esta actividad" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear inscripción con datos médicos
    const nuevaInscripcion = await prisma.inscripact.create({
      data: {
        estudianteId: body.aluctr,
        actividadId: Number(body.actividadId),
        ofertaId: Number(body.ofertaId),
        formularioData: {
          hasCondition: body.hasCondition,
          conditionDetails: body.conditionDetails || null,
          takesMedication: body.takesMedication,
          medicationDetails: body.medicationDetails || null,
          hasAllergy: body.hasAllergy,
          allergyDetails: body.allergyDetails || null,
          hasInjury: body.hasInjury,
          injuryDetails: body.injuryDetails || null,
          hasRestriction: body.hasRestriction,
          restrictionDetails: body.restrictionDetails || null,
          purpose: body.purpose,
        },
      },
    });

    return new Response(JSON.stringify(nuevaInscripcion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en POST /api/inscripciones:", error);
    
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

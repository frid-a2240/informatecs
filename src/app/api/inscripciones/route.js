// /api/inscripciones/route.js
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get("aluctr");
    const whereClause = aluctr ? { estudianteId: aluctr } : {};

    const inscripciones = await prisma.inscripact.findMany({
      where: whereClause,
      include: {
        actividad: true,
        estudiante: {
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
            alusme: true,
            alusex: true,
            alumai: true,
            alutsa: true,
            // ✅ estudicarr es relación 1-a-1 (objeto, no array)
            inscripciones: {
              select: {
                calnpe: true, // semestre actual
                carcve: true, // clave carrera
                carrera: {
                  select: {
                    carcve: true,
                    carnom: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { fechaInscripcion: "desc" },
    });

    const inscripcionesTransformadas = inscripciones.map((inscripcion) => {
      let formularioData = null;
      if (inscripcion.formularioData) {
        try {
          formularioData =
            typeof inscripcion.formularioData === "string"
              ? JSON.parse(inscripcion.formularioData)
              : inscripcion.formularioData;
        } catch (error) {
          console.error("Error parseando formularioData:", error);
        }
      }

      // ✅ inscripciones es un OBJETO (1-a-1), no array — acceso directo
      const inscripcionAcademica = inscripcion.estudiante.inscripciones;
      const calnpe = inscripcionAcademica?.calnpe ?? null;
      const carrera = inscripcionAcademica?.carrera
        ? {
            carcve: inscripcionAcademica.carrera.carcve?.toString() || null,
            carnom: inscripcionAcademica.carrera.carnom || null,
          }
        : null;

      return {
        id: inscripcion.id,
        estudianteId: inscripcion.estudianteId,
        actividadId: inscripcion.actividadId,
        ofertaId: inscripcion.ofertaId,
        fechaInscripcion: inscripcion.fechaInscripcion,
        calificacion: inscripcion.calificacion,
        liberado: inscripcion.liberado,
        tipoSangreSolicitado: inscripcion.tipoSangreSolicitado,
        comprobanteSangrePDF: inscripcion.comprobanteSangrePDF,
        nombreArchivoSangre: inscripcion.nombreArchivoSangre,
        sangreValidada: inscripcion.sangreValidada,
        formularioData,
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
          calnpe, // semestre actual correcto
          carrera, // carrera del estudiante
        },
      };
    });

    return new Response(JSON.stringify(inscripcionesTransformadas), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ Error en GET /api/inscripciones:", error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ======================
// POST: Crear nueva inscripción
// ======================
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.aluctr || !body.actividadId) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existente = await prisma.inscripact.findFirst({
      where: { estudianteId: body.aluctr, actividadId: body.actividadId },
    });

    if (existente) {
      return new Response(
        JSON.stringify({ error: "Ya inscrito en esta actividad" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const nuevaInscripcion = await prisma.inscripact.create({
      data: {
        estudianteId: body.aluctr,
        actividadId: body.actividadId,
        ofertaId: body.ofertaId || null,
        formularioData: body.formularioData
          ? JSON.stringify(body.formularioData)
          : null,
        tipoSangreSolicitado: body.tipoSangreSolicitado || null,
      },
    });

    return new Response(JSON.stringify(nuevaInscripcion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en POST /api/inscripciones:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

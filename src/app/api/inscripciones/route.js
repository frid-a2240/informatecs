// /api/inscripciones/route.js
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get('aluctr');
    const whereClause = aluctr ? { estudianteId: aluctr } : {};

    console.log("🔍 Buscando inscripciones para:", aluctr || "TODOS");

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
            inscripciones: {  // ← estudicarr (aquí está calnpe)
              select: {
                calnpe: true
              }
            }
          },
        },
      },
      orderBy: { fechaInscripcion: 'desc' },
    });

    console.log("📊 Inscripciones encontradas:", inscripciones.length);
    console.log("🔍 Primera estudiante.inscripciones:", 
      inscripciones[0]?.estudiante.inscripciones);

    const inscripcionesTransformadas = inscripciones.map((inscripcion) => {
      // Parse formularioData
      let formularioData = null;
      if (inscripcion.formularioData) {
        try {
          formularioData = typeof inscripcion.formularioData === 'string' 
            ? JSON.parse(inscripcion.formularioData) 
            : inscripcion.formularioData;
        } catch (error) {
          console.error("Error parseando formularioData:", error);
        }
      }

      // ✅ EXTRAER calnpe de inscripciones (estudicarr)
      const calnpe = inscripcion.estudiante.inscripciones?.[0]?.calnpe || null;

      console.log(`📊 Estudiante ${inscripcion.estudiante.aluctr}: calnpe="${calnpe}"`);

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
          calnpe: calnpe,  // ✅ AQUÍ ESTÁ LA CLAVE
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
    return new Response(JSON.stringify([]), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}

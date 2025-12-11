import { prisma } from '@/lib/prisma';

// GET - Obtener estado de tipo de sangre
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get('aluctr');

    if (!aluctr) {
      return new Response(
        JSON.stringify({ error: "Falta número de control" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener estudiante
    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr },
      select: {
        aluctr: true,
        alutsa: true, // Tipo de sangre validado
      }
    });

    // ✅ CORRECCIÓN: Buscar usando estudianteId (no aluctr)
    const inscripcionPendiente = await prisma.inscripact.findFirst({
      where: {
        estudianteId: aluctr, // ✅ Usar estudianteId
        tipoSangreSolicitado: { not: null },
        sangreValidada: false,
      },
      select: {
        tipoSangreSolicitado: true,
        sangreValidada: true,
      }
    });

    return new Response(JSON.stringify({
      estudiante,
      tieneSolicitudPendiente: !!inscripcionPendiente,
      solicitudPendiente: inscripcionPendiente,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en GET /api/sangre:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST - Guardar tipo de sangre en la inscripción
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.aluctr || !body.bloodType || !body.bloodTypeFile) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ CORRECCIÓN: Verificar si ya tiene solicitud pendiente usando estudianteId
    const inscripcionPendiente = await prisma.inscripact.findFirst({
      where: {
        estudianteId: body.aluctr, // ✅ Usar estudianteId
        tipoSangreSolicitado: { not: null },
        sangreValidada: false,
      }
    });

    if (inscripcionPendiente) {
      return new Response(
        JSON.stringify({ 
          error: "Ya tienes una solicitud pendiente de validación" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ CORRECCIÓN: Buscar la inscripción más reciente usando estudianteId
    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: body.aluctr }, // ✅ Usar estudianteId
      orderBy: { fechaInscripcion: 'desc' },
    });

    if (!inscripcion) {
      return new Response(
        JSON.stringify({ error: "No tienes inscripciones activas" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar la inscripción con los datos de sangre
    await prisma.inscripact.update({
      where: { id: inscripcion.id },
      data: {
        tipoSangreSolicitado: body.bloodType,
        comprobanteSangrePDF: body.bloodTypeFile,
        nombreArchivoSangre: body.bloodTypeFileName || 'comprobante.pdf',
        sangreValidada: false,
      }
    });

    console.log("✅ Solicitud de tipo de sangre guardada en inscripción:", inscripcion.id);

    return new Response(JSON.stringify({ 
      success: true,
      mensaje: "Solicitud enviada. Espera la validación del administrador.",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en POST /api/sangre:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

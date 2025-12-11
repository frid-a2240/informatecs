import { prisma } from '@/lib/prisma';

// PUT - Validar tipo de sangre
export async function PUT(request) {
  try {
    const body = await request.json();
    const { inscripcionId, aluctr } = body;

    if (!inscripcionId || !aluctr) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener la inscripción
    const inscripcion = await prisma.inscripact.findUnique({
      where: { id: inscripcionId },
      select: {
        tipoSangreSolicitado: true,
        sangreValidada: true,
        estudianteId: true, // ✅ Cambiar de aluctr a estudianteId
      }
    });

    if (!inscripcion) {
      return new Response(
        JSON.stringify({ error: "Inscripción no encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (inscripcion.sangreValidada) {
      return new Response(
        JSON.stringify({ error: "Esta solicitud ya fue validada" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Marcar como validada
    await prisma.inscripact.update({
      where: { id: inscripcionId },
      data: { sangreValidada: true }
    });

    // Actualizar tipo de sangre en estudiantes
    await prisma.estudiantes.update({
      where: { aluctr }, // ✅ Aquí sí usamos aluctr porque es la tabla estudiantes
      data: { alutsa: inscripcion.tipoSangreSolicitado }
    });

    console.log(`✅ Tipo de sangre ${inscripcion.tipoSangreSolicitado} validado para ${aluctr}`);

    return new Response(JSON.stringify({ 
      success: true,
      mensaje: "Tipo de sangre validado correctamente"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en PUT /api/admin/validar-sangre:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

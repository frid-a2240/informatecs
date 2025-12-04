import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
            alusme: true,
            alusex: true,
            alumai: true,
            alutsa: true,
            inscripciones: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(inscripciones), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
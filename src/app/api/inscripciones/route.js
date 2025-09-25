import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get('aluctr');

    if (!aluctr) {
      return new Response(JSON.stringify({ error: 'Número de control faltante' }), { status: 400 });
    }

    const inscripciones = await prisma.inscripact.findMany({
      where: { estudianteId: aluctr },
      include: { actividad: true }
    });

    return new Response(JSON.stringify(inscripciones), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error GET inscripciones:', error);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST ya lo tienes
export async function POST(request) {
  try {
    const { aluctr, actividadId, hasPracticed, hasIllness, purpose, bloodType } = await request.json();

    if (!aluctr || !actividadId || !hasPracticed || !hasIllness || !purpose || !bloodType) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
    }

    const inscripcion = await prisma.inscripact.create({
      data: {
        estudianteId: aluctr,
        actividadId: parseInt(actividadId),
        ofertaId: 1, // Aquí deberías calcular la oferta real
        formularioData: {
          hasPracticed,
          hasIllness,
          purpose,
          bloodType
        }
      }
    });

    return new Response(JSON.stringify({ message: 'Inscripción registrada', inscripcion }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }
}

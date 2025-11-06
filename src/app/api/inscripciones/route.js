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

export async function POST(request) {
  try {
    const body = await request.json();
    const { aluctr, actividadId, ofertaId, hasPracticed, hasIllness, purpose, bloodType } = body;

    console.log('Datos recibidos en inscripciones:', body);

    // Validar campos requeridos
    if (!aluctr || !actividadId || !ofertaId || !hasPracticed || !hasIllness || !purpose || !bloodType) {
      console.error('Faltan datos:', { aluctr, actividadId, ofertaId, hasPracticed, hasIllness, purpose, bloodType });
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar si ya está inscrito
    const yaInscrito = await prisma.inscripact.findFirst({
      where: {
        estudianteId: aluctr,
        actividadId: parseInt(actividadId)
      }
    });

    if (yaInscrito) {
      return new Response(
        JSON.stringify({ error: 'Ya estás inscrito en esta actividad' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que la oferta existe
    const ofertaExiste = await prisma.ofertaSemestre.findUnique({
      where: { id: parseInt(ofertaId) }
    });

    if (!ofertaExiste) {
      return new Response(
        JSON.stringify({ error: 'La oferta de actividad no existe' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear inscripción
    const inscripcion = await prisma.inscripact.create({
      data: {
        estudianteId: aluctr,
        actividadId: parseInt(actividadId),
        ofertaId: parseInt(ofertaId),
        formularioData: {
          hasPracticed,
          hasIllness,
          purpose,
          bloodType
        }
      }
    });

    return new Response(
      JSON.stringify({ message: 'Inscripción registrada exitosamente', inscripcion }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error completo en POST inscripciones:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inscripciones = await prisma.inscripact.findMany({
      include: {
        actividad: true,
        estudiante: {
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true
          }
        },
        oferta: true
      },
      orderBy: {
        fechaInscripcion: 'desc'
      }
    });

    return Response.json(inscripciones);
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
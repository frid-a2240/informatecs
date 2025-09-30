import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DELETE() {
  try {
    // Borrar solo las ofertas activas que no tengan inscripciones
    const resultado = await prisma.ofertaSemestre.deleteMany({
      where: {
        activa: true,
        inscripciones: { none: {} }, // Asegura que no haya inscripciones asociadas
      },
    });

    return new Response(
      JSON.stringify({
        message: "Se borraron las actividades disponibles",
        count: resultado.count,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al borrar actividades disponibles:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno al borrar actividades disponibles",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}

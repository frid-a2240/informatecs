import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const estudiantes = await prisma.estudiantes.findMany({
      select: {
        aluctr: true,
        alunom: true,
        aluapp: true,
        aluapm: true,
        alumai: true,
      },
      orderBy: {
        alunom: "asc",
      },
    });

    return Response.json(estudiantes);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Error al obtener estudiantes" },
      { status: 500 }
    );
  }
}

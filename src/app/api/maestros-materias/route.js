import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const percve = searchParams.get("percve");

    if (!percve) {
      return NextResponse.json(
        { message: "Falta el ID del maestro" },
        { status: 400 },
      );
    }

    console.log("🔍 Buscando materias del maestro:", percve);

    // Buscar actividades asignadas al maestro CON sus inscripciones
    const materias = await prisma.actividades.findMany({
      where: { maestroId: parseInt(percve) },
      include: {
        maestro: true,
        inscripact: {
          include: {
            estudiante: {
              include: {
                inscripciones: {
                  include: {
                    carrera: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(`✅ Se encontraron ${materias.length} materias`);

    return NextResponse.json(materias);
  } catch (error) {
    console.error("❌ Error al obtener materias del maestro:", error);
    return NextResponse.json(
      { message: "Error al obtener materias", error: error.message },
      { status: 500 },
    );
  }
}

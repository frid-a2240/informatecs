import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const maestros = await prisma.maestros.findMany({
      where: {
        OR: [
          { percve: { equals: parseInt(query) || 0 } },
          { pernom: { contains: query, mode: "insensitive" } },
          { perapp: { contains: query, mode: "insensitive" } },
          { perapm: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        percve: true,
        pernom: true,
        perapp: true,
        perapm: true,
        perdce: true,
        perdep: true,
      },
    });

    const maestrosFormateados = maestros.map((m) => ({
      id: m.percve,
      nombreCompleto: `${m.pernom || ""} ${m.perapp || ""} ${m.perapm || ""}`.trim(),
      correo: m.perdce,
      departamento: m.perdep,
    }));

    return NextResponse.json(maestrosFormateados);
  } catch (error) {
    console.error("❌ Error al buscar maestros:", error);
    return NextResponse.json(
      { message: "Error al buscar maestros", error: error.message },
      { status: 500 }
    );
  }
}

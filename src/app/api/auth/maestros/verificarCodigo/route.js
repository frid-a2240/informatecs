import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { percve, code } = await req.json();

    console.log("🔍 Verificando código para percve:", percve);

    const maestro = await prisma.authMaestros.findUnique({
      where: { percve: parseInt(percve) },
    });

    if (!maestro || maestro.emailCode !== code) {
      console.log("❌ Código inválido");
      return NextResponse.json(
        { message: "Código inválido o expirado" },
        { status: 401 }
      );
    }

    console.log("✅ Código válido");

    return NextResponse.json({
      message: "Código válido. Puedes cambiar tu contraseña.",
    });
  } catch (error) {
    console.error("❌ Error al verificar código:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}

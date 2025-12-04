import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { percve, password } = await req.json();

    console.log("🔍 Intentando login con percve:", percve);

    // 🔹 1. Buscar maestro en la tabla maestros
    const maestro = await prisma.maestros.findUnique({
      where: { percve: parseInt(percve) },
    });

    if (!maestro) {
      console.log("❌ Maestro no encontrado");
      return NextResponse.json(
        { message: "ID de maestro no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Maestro encontrado:", maestro.pernom);

    // 🔹 2. Buscar o crear en authMaestros
    let authMaestro = await prisma.authMaestros.findUnique({
      where: { percve: parseInt(percve) },
    });

    if (!authMaestro) {
      console.log("📝 Creando registro en authMaestros...");
      const nombreCompleto = `${maestro.pernom ?? ""} ${
        maestro.perapp ?? ""
      } ${maestro.perapm ?? ""}`.trim();
      const hashedPassword = await bcrypt.hash("profe123", 10);

      authMaestro = await prisma.authMaestros.create({
        data: {
          percve: parseInt(percve),
          password: hashedPassword,
          nombreCompleto,
          correo: maestro.perdce || "",
          isVerified: false,
        },
      });
      console.log("✅ Registro creado en authMaestros");
    }

    // 🔹 3. Validar contraseña
    const passwordMatch = await bcrypt.compare(password, authMaestro.password);
    if (!passwordMatch) {
      console.log("❌ Contraseña incorrecta");
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    console.log("✅ Contraseña correcta");

    // 🔹 4. Verificar si ya cambió su contraseña
    if (!authMaestro.isVerified) {
      console.log("⚠️ Cuenta no verificada");
      return NextResponse.json(
        {
          message: "Cuenta no verificada",
          requiresVerification: true,
        },
        { status: 403 }
      );
    }

    // 🔹 5. Construir perfil completo del maestro
    const perfilMaestro = {
      percve: maestro.percve,
      nombreCompleto: `${maestro.pernom ?? ""} ${maestro.perapp ?? ""} ${
        maestro.perapm ?? ""
      }`.trim(),
      correo: maestro.perdce,
      telefono: maestro.perdte,
      departamento: maestro.perdep,
      sexo:
        maestro.persex === 1
          ? "Masculino"
          : maestro.persex === 2
          ? "Femenino"
          : "No especificado",
    };

    console.log("✅ Login exitoso:", perfilMaestro.nombreCompleto);

    return NextResponse.json({
      message: `Bienvenido, ${authMaestro.nombreCompleto}`,
      nombre: authMaestro.nombreCompleto,
      maestro: perfilMaestro,
    });
  } catch (error) {
    console.error("❌ Error en login de maestro:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}

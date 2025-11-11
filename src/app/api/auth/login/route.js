import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { matricula, password } = await req.json();

    // 🔹 1. Buscar estudiante y su carrera relacionada
    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr: matricula },
      include: {
        inscripciones: {
          include: {
            carrera: true,
          },
        },
      },
    });

    if (!estudiante) {
      return NextResponse.json(
        { message: "Matrícula no encontrada" },
        { status: 404 }
      );
    }

    // 🔹 2. Buscar en authStudents
    let student = await prisma.authStudents.findUnique({
      where: { matricula },
    });

    if (!student) {
      const nombreCompleto = `${estudiante.alunom ?? ""} ${
        estudiante.aluapp ?? ""
      } ${estudiante.aluapm ?? ""}`.trim();
      const hashedPassword = await bcrypt.hash("123456", 10);

      student = await prisma.authStudents.create({
        data: {
          matricula,
          password: hashedPassword,
          nombreCompleto,
          correo: estudiante.alumai || "",
          isVerified: true,
        },
      });
    }

    // 🔹 3. Validar contraseña
    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // 🔹 4. Extraer carrera (manejo si hay array o solo un registro)
    const inscripciones = Array.isArray(estudiante.inscripciones)
      ? estudiante.inscripciones
      : [estudiante.inscripciones].filter(Boolean);

    const carrera = inscripciones[0]?.carrera;

    // 🔹 5. Construir perfil completo con semestre y sexo
    const perfilCompleto = {
      numeroControl: estudiante.aluctr,
      nombreCompleto: `${estudiante.alunom ?? ""} ${estudiante.aluapp ?? ""} ${
        estudiante.aluapm ?? ""
      }`.trim(),
      fechaNacimiento: estudiante.alunac,
      rfc: estudiante.alurfc,
      curp: estudiante.alucur,
      telefono: estudiante.alute1,
      email: estudiante.alumai,
      sexo:
        estudiante.alusex === 1
          ? "Masculino"
          : estudiante.alusex === 2
          ? "Femenino"
          : "No especificado",
      semestre: estudiante.alusme?.toString() || "No disponible",
      carrera: carrera?.carnom || "Sin carrera asignada",
      carreraId: carrera?.carcve?.toString() || null,
      inscripciones,
    };

    console.log("🟢 PERFIL COMPLETO:", perfilCompleto);

    return NextResponse.json({
      message: `Bienvenido, ${student.nombreCompleto}`,
      nombre: student.nombreCompleto,
      estudiante: perfilCompleto,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}

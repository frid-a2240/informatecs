// app/api/constancias/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";



// Función para generar folio único
function generarFolio() {
  const año = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `ITE-${año}-${timestamp}`;
}

// Función para generar código de verificación único
function generarCodigoVerificacion(folio, numeroControl) {
  const hash = crypto
    .createHash("sha256")
    .update(`${folio}-${numeroControl}-${Date.now()}`)
    .digest("hex");
  return hash.substring(0, 12).toUpperCase(); // 12 caracteres
}

// POST - Crear nueva constancia
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      numeroControl,
      nombreCompleto,
      correoEstudiante,
      actividadCodigo,
      actividadNombre,
      actividadCreditos,
      actividadHoras,
      periodo,
      acreditacion,
      actividadId,
    } = body;

    // Validaciones
    if (!numeroControl || !nombreCompleto || !actividadId || !periodo || !acreditacion) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Generar folio y código únicos
    let folio, codigoVerificacion;
    let intentos = 0;
    const maxIntentos = 10;

    do {
      folio = generarFolio();
      codigoVerificacion = generarCodigoVerificacion(folio, numeroControl);
      
      // Verificar que no existan
      const existente = await prisma.constancias.findFirst({
        where: {
          OR: [{ folio }, { codigoVerificacion }],
        },
      });

      if (!existente) break;
      
      intentos++;
    } while (intentos < maxIntentos);

    if (intentos >= maxIntentos) {
      return NextResponse.json(
        { error: "No se pudo generar un folio único" },
        { status: 500 }
      );
    }

    // Crear constancia
    const constancia = await prisma.constancias.create({
      data: {
        folio,
        codigoVerificacion,
        numeroControl,
        nombreCompleto,
        correoEstudiante,
        actividadCodigo,
        actividadNombre,
        actividadCreditos,
        actividadHoras,
        periodo,
        acreditacion,
        estudianteId: numeroControl,
        actividadId: parseInt(actividadId),
      },
    });

    console.log(`✅ Constancia creada: ${folio}`);

    return NextResponse.json({
      success: true,
      constancia: {
        folio: constancia.folio,
        codigoVerificacion: constancia.codigoVerificacion,
        id: constancia.id,
      },
    });
  } catch (error) {
    console.error("❌ Error al crear constancia:", error);
    return NextResponse.json(
      { error: "Error al crear constancia", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Obtener constancias o buscar por folio
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folio = searchParams.get("folio");
    const numeroControl = searchParams.get("numeroControl");

    if (folio) {
      // Buscar constancia específica por folio
      const constancia = await prisma.constancias.findUnique({
        where: { folio },
        include: {
          estudiante: true,
          actividad: true,
        },
      });

      if (!constancia) {
        return NextResponse.json(
          { error: "Constancia no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({ constancia });
    }

    if (numeroControl) {
      // Buscar todas las constancias de un estudiante
      const constancias = await prisma.constancias.findMany({
        where: { numeroControl },
        include: {
          actividad: true,
        },
        orderBy: { fechaEmision: "desc" },
      });

      return NextResponse.json({ constancias });
    }

    // Obtener todas las constancias (con paginación recomendada)
    const constancias = await prisma.constancias.findMany({
      include: {
        estudiante: true,
        actividad: true,
      },
      orderBy: { fechaEmision: "desc" },
      take: 100, // Limitar a 100 registros
    });

    return NextResponse.json({ constancias });
  } catch (error) {
    console.error("❌ Error al obtener constancias:", error);
    return NextResponse.json(
      { error: "Error al obtener constancias", details: error.message },
      { status: 500 }
    );
  }
}
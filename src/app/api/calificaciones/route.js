import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener calificaciones de una actividad
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const actividadId = searchParams.get("actividadId");
    const maestroId = searchParams.get("maestroId");

    if (!actividadId || !maestroId) {
      return NextResponse.json(
        { message: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    console.log("📥 Obteniendo calificaciones...");
    console.log("Actividad ID:", actividadId);
    console.log("Maestro ID:", maestroId);

    // Buscar la actividad y verificar que pertenezca al maestro
    const actividad = await prisma.actividades.findFirst({
      where: {
        id: parseInt(actividadId),
        maestroId: parseInt(maestroId),
      },
    });

    if (!actividad) {
      return NextResponse.json(
        { message: "Actividad no encontrada o no autorizada" },
        { status: 404 }
      );
    }

    // Obtener inscripciones con calificaciones
    const inscripciones = await prisma.inscripact.findMany({
      where: {
        actividadId: parseInt(actividadId),
      },
      include: {
        estudiante: true,
      },
    });

    console.log(`✅ Se encontraron ${inscripciones.length} inscripciones`);

    return NextResponse.json(inscripciones);
  } catch (error) {
    console.error("❌ Error al obtener calificaciones:", error);
    return NextResponse.json(
      { message: "Error al obtener calificaciones", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Guardar/Actualizar calificaciones
export async function PUT(req) {
  try {
    const { actividadId, maestroId, calificaciones } = await req.json();

    console.log("💾 Guardando calificaciones...");
    console.log("Actividad ID:", actividadId);
    console.log("Maestro ID:", maestroId);
    console.log("Calificaciones a guardar:", Object.keys(calificaciones).length);

    // Verificar que la actividad pertenezca al maestro
    const actividad = await prisma.actividades.findFirst({
      where: {
        id: parseInt(actividadId),
        maestroId: parseInt(maestroId),
      },
    });

    if (!actividad) {
      return NextResponse.json(
        { message: "Actividad no encontrada o no autorizada" },
        { status: 403 }
      );
    }

    // Actualizar calificaciones una por una
    const promesas = Object.entries(calificaciones).map(
      async ([aluctr, datos]) => {
        // Buscar la inscripción
        const inscripcion = await prisma.inscripact.findFirst({
          where: {
            estudianteId: aluctr,
            actividadId: parseInt(actividadId),
          },
        });

        if (!inscripcion) {
          console.warn(`⚠️ Inscripción no encontrada para alumno: ${aluctr}`);
          return null;
        }

        // Actualizar calificación
        return await prisma.inscripact.update({
          where: {
            id: inscripcion.id,
          },
          data: {
            calificacion: datos.calificacion ? parseFloat(datos.calificacion) : null,
            liberado: datos.calificacion >= 70 ? true : false,
            // Guardar observaciones en el campo formularioData (JSON)
            formularioData: {
              ...inscripcion.formularioData,
              observaciones: datos.observaciones || "",
              fechaEvaluacion: new Date().toISOString(),
            },
          },
        });
      }
    );

    const resultados = await Promise.all(promesas);
    const exitosos = resultados.filter((r) => r !== null).length;

    console.log(`✅ Se guardaron ${exitosos} calificaciones correctamente`);

    return NextResponse.json({
      message: "Calificaciones guardadas correctamente",
      guardadas: exitosos,
    });
  } catch (error) {
    console.error("❌ Error al guardar calificaciones:", error);
    return NextResponse.json(
      { message: "Error al guardar calificaciones", error: error.message },
      { status: 500 }
    );
  }
}

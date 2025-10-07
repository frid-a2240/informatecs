import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get("aluctr");

    if (!aluctr) {
      return new Response(
        JSON.stringify({ error: "Número de control faltante" }),
        { status: 400 }
      );
    }

    const inscripciones = await prisma.inscripact.findMany({
      where: { estudianteId: aluctr },
      include: { actividad: true },
    });

    return new Response(JSON.stringify(inscripciones), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error GET inscripciones:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// Función POST corregida para recibir todos los datos necesarios
export async function POST(request) {
  try {
    // 1. Desestructurar los datos de la solicitud
    const {
      aluctr, // Corresponde a estudianteId
      actividadId,
      ofertaId, // ¡Necesitas este ID del frontend!
      formData, // El objeto completo del formulario (hasPracticed, purpose, etc.)
    } = await request.json();

    // 2. Validación de datos esenciales
    if (!aluctr || !actividadId || !ofertaId || !formData) {
      return new Response(
        JSON.stringify({
          error:
            "Faltan datos esenciales para la inscripción (Número de control, IDs o datos del formulario).",
        }),
        {
          status: 400,
        }
      );
    }

    // Convertir IDs a números enteros, ya que probablemente son de tipo Int en Prisma
    const actividadIdInt = parseInt(actividadId);
    const ofertaIdInt = parseInt(ofertaId);

    // 3. Crear el registro de inscripción en Prisma
    const inscripcion = await prisma.inscripact.create({
      data: {
        // Mapeo a las columnas de la tabla Inscripact (según tu imagen):
        estudianteId: aluctr, // OJO: Asume que es un String ('20750204')
        actividadId: actividadIdInt,
        ofertaId: ofertaIdInt,

        // Almacena el objeto del formulario directamente en un campo JSON
        // Prisma maneja la conversión automáticamente si el campo es de tipo Json
        formularioData: formData,

        // Las columnas 'calificacion', 'liberado', y 'fechaInscripcion'
        // probablemente tienen valores por defecto definidos en tu schema.prisma.
      },
    });

    return new Response(
      JSON.stringify({
        message: "Inscripción registrada con éxito",
        inscripcion,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en POST Inscripción:", error);
    // Verificar si es un error de clave duplicada (ej. ya inscrito)
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          error: "Ya existe una inscripción activa para esta oferta.",
        }),
        {
          status: 409,
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor al crear la inscripción.",
      }),
      {
        status: 500,
      }
    );
  }
}

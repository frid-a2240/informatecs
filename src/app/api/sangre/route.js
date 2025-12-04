import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET - Obtener tipo de sangre del estudiante
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get('aluctr');

    if (!aluctr) {
      return new Response(
        JSON.stringify({ error: "Falta número de control" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr },
      select: {
        aluctr: true,
        alutsa: true, // Campo tipo de sangre
      }
    });

    return new Response(JSON.stringify(estudiante), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST - Actualizar tipo de sangre
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.aluctr || !body.bloodType) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar tipo de sangre en la tabla estudiantes
    const estudiante = await prisma.estudiantes.update({
      where: { aluctr: body.aluctr },
      data: {
        alutsa: body.bloodType, // Guardar en el campo alutsa
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      bloodType: estudiante.alutsa 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
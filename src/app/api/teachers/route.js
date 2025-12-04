import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET - Buscar maestros
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const percve = searchParams.get('percve');

    // 🔹 Si se busca un maestro específico por ID
    if (percve) {
      const maestro = await prisma.maestros.findUnique({
        where: { percve: parseInt(percve) },
        select: {
          percve: true,
          pernom: true,
          perapp: true,
          perapm: true,
          perdvi: true,
          perdce: true,
          perdte: true,
          perdep: true,
          persex: true,
          // 🔥 NUEVO: Incluir ofertas asignadas
          ofertasImpartidas: {
            where: { activa: true },
            include: {
              actividad: true,
              inscripact: true,
            }
          }
        }
      });

      if (!maestro) {
        return new Response(
          JSON.stringify({ error: "Maestro no encontrado" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Construir nombre completo
      const maestroFormateado = {
        ...maestro,
        nombreCompleto: `${maestro.pernom || ""} ${maestro.perapp || ""} ${maestro.perapm || ""}`.trim(),
        sexoTexto: maestro.persex === 1 ? "Masculino" : maestro.persex === 2 ? "Femenino" : "No especificado"
      };

      return new Response(JSON.stringify(maestroFormateado), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔹 Si hay búsqueda por nombre o ID
    if (search) {
      const searchTerm = search.trim();
      const isNumeric = !isNaN(parseInt(searchTerm));

      const maestros = await prisma.maestros.findMany({
        where: {
          OR: [
            isNumeric ? { percve: parseInt(searchTerm) } : undefined,
            { pernom: { contains: searchTerm, mode: 'insensitive' } },
            { perapp: { contains: searchTerm, mode: 'insensitive' } },
            { perapm: { contains: searchTerm, mode: 'insensitive' } },
          ].filter(Boolean) // Elimina undefined
        },
        select: {
          percve: true,
          pernom: true,
          perapp: true,
          perapm: true,
          perdvi: true,
          perdce: true,
          perdte: true,
          persex: true,
        },
        take: 20, // Limitar a 20 resultados
        orderBy: {
          perapp: 'asc' // Ordenar por apellido
        }
      });

      // Formatear resultados
      const maestrosFormateados = maestros.map(m => ({
        ...m,
        nombreCompleto: `${m.pernom || ""} ${m.perapp || ""} ${m.perapm || ""}`.trim(),
        sexoTexto: m.persex === 1 ? "Masculino" : m.persex === 2 ? "Femenino" : "No especificado"
      }));

      return new Response(JSON.stringify(maestrosFormateados), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔹 Listar todos los maestros (con paginación)
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    const [maestros, total] = await Promise.all([
      prisma.maestros.findMany({
        select: {
          percve: true,
          pernom: true,
          perapp: true,
          perapm: true,
          perdvi: true,
          perdce: true,
          perdte: true,
          persex: true,
          perdep: true,
        },
        skip,
        take: limit,
        orderBy: {
          perapp: 'asc'
        }
      }),
      prisma.maestros.count()
    ]);

    const maestrosFormateados = maestros.map(m => ({
      ...m,
      nombreCompleto: `${m.pernom || ""} ${m.perapp || ""} ${m.perapm || ""}`.trim(),
      sexoTexto: m.persex === 1 ? "Masculino" : m.persex === 2 ? "Femenino" : "No especificado"
    }));

    return new Response(JSON.stringify({
      maestros: maestrosFormateados,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en API maestros:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

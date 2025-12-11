import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { actividadId, maestroId } = await req.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 ASIGNACIÓN DE MAESTRO - INICIO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 Datos recibidos:");
    console.log("   - actividadId:", actividadId);
    console.log("   - maestroId:", maestroId);
    console.log("   - Tipo actividadId:", typeof actividadId);
    console.log("   - Tipo maestroId:", typeof maestroId);

    // ✅ BUSCAR ACTIVIDAD (primero verificar si es ID o código)
    let actividadExistente;
    
    // Intentar buscar por ID numérico primero
    if (!isNaN(actividadId)) {
      console.log("🔍 Buscando por ID numérico:", parseInt(actividadId));
      actividadExistente = await prisma.actividades.findUnique({
        where: { id: parseInt(actividadId) },
      });
    }
    
    // Si no se encuentra, buscar por código
    if (!actividadExistente) {
      console.log("🔍 Buscando por código (aticve):", actividadId);
      actividadExistente = await prisma.actividades.findFirst({
        where: { aticve: actividadId },
      });
    }

    console.log("📋 Actividad encontrada:");
    if (actividadExistente) {
      console.log("   - ID:", actividadExistente.id);
      console.log("   - Código (aticve):", actividadExistente.aticve);
      console.log("   - Nombre (aconco):", actividadExistente.aconco);
      console.log("   - maestroId actual:", actividadExistente.maestroId);
    } else {
      console.log("   ❌ NO SE ENCONTRÓ LA ACTIVIDAD");
    }

    if (!actividadExistente) {
      console.log("❌ ASIGNACIÓN FALLIDA - Actividad no encontrada");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return NextResponse.json(
        { message: "Actividad no encontrada" },
        { status: 404 }
      );
    }

    console.log("🔄 Actualizando actividad...");
    console.log("   - ID a actualizar:", actividadExistente.id);
    console.log("   - Nuevo maestroId:", parseInt(maestroId));

    // ✅ ACTUALIZAR usando el id numérico
    const actividad = await prisma.actividades.update({
      where: { id: actividadExistente.id },
      data: { maestroId: parseInt(maestroId) },
      include: {
        maestro: true,
      },
    });

    console.log("✅ ACTIVIDAD ACTUALIZADA:");
    console.log("   - ID:", actividad.id);
    console.log("   - Nombre:", actividad.aconco);
    console.log("   - maestroId nuevo:", actividad.maestroId);
    console.log("   - Maestro asignado:", actividad.maestro?.pernco || "N/A");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ ASIGNACIÓN EXITOSA");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      message: "Maestro asignado correctamente",
      actividad,
    });
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ ERROR AL ASIGNAR MAESTRO");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Mensaje:", error.message);
    console.error("❌ Stack:", error.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return NextResponse.json(
      { message: "Error al asignar maestro", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const actividadId = searchParams.get("actividadId");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🗑️ REMOVER MAESTRO - INICIO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 actividadId recibido:", actividadId);

    // ✅ BUSCAR ACTIVIDAD (por ID o código)
    let actividadExistente;
    
    if (!isNaN(actividadId)) {
      console.log("🔍 Buscando por ID numérico:", parseInt(actividadId));
      actividadExistente = await prisma.actividades.findUnique({
        where: { id: parseInt(actividadId) },
      });
    }
    
    if (!actividadExistente) {
      console.log("🔍 Buscando por código (aticve):", actividadId);
      actividadExistente = await prisma.actividades.findFirst({
        where: { aticve: actividadId },
      });
    }

    console.log("📋 Actividad encontrada:");
    if (actividadExistente) {
      console.log("   - ID:", actividadExistente.id);
      console.log("   - Código:", actividadExistente.aticve);
      console.log("   - Nombre:", actividadExistente.aconco);
      console.log("   - maestroId actual:", actividadExistente.maestroId);
    } else {
      console.log("   ❌ NO SE ENCONTRÓ LA ACTIVIDAD");
    }

    if (!actividadExistente) {
      console.log("❌ ELIMINACIÓN FALLIDA - Actividad no encontrada");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return NextResponse.json(
        { message: "Actividad no encontrada" },
        { status: 404 }
      );
    }

    console.log("🔄 Removiendo maestro...");
    
    // ✅ REMOVER el maestro usando el id numérico
    await prisma.actividades.update({
      where: { id: actividadExistente.id },
      data: { maestroId: null },
    });

    console.log("✅ Maestro removido exitosamente");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({ message: "Maestro removido correctamente" });
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ ERROR AL REMOVER MAESTRO");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Mensaje:", error.message);
    console.error("❌ Stack:", error.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return NextResponse.json(
      { message: "Error al remover maestro", error: error.message },
      { status: 500 }
    );
  }
}

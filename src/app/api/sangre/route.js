// // import { prisma } from '@/lib/prisma';

// // // GET - Obtener estado de tipo de sangre
// // export async function GET(request) {
// //   try {
// //     const { searchParams } = new URL(request.url);
// //     const aluctr = searchParams.get('aluctr');

// //     if (!aluctr) {
// //       return new Response(
// //         JSON.stringify({ error: "Falta número de control" }),
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     // Obtener estudiante
// //     const estudiante = await prisma.estudiantes.findUnique({
// //       where: { aluctr },
// //       select: {
// //         aluctr: true,
// //         alutsa: true, // Tipo de sangre validado
// //       }
// //     });

// //     // ✅ CORRECCIÓN: Buscar usando estudianteId (no aluctr)
// //     const inscripcionPendiente = await prisma.inscripact.findFirst({
// //       where: {
// //         estudianteId: aluctr, // ✅ Usar estudianteId
// //         tipoSangreSolicitado: { not: null },
// //         sangreValidada: false,
// //       },
// //       select: {
// //         tipoSangreSolicitado: true,
// //         sangreValidada: true,
// //       }
// //     });

// //     return new Response(JSON.stringify({
// //       estudiante,
// //       tieneSolicitudPendiente: !!inscripcionPendiente,
// //       solicitudPendiente: inscripcionPendiente,
// //     }), {
// //       status: 200,
// //       headers: { "Content-Type": "application/json" },
// //     });
// //   } catch (error) {
// //     console.error("❌ Error en GET /api/sangre:", error);
// //     return new Response(
// //       JSON.stringify({ error: "Error interno", message: error.message }),
// //       { status: 500, headers: { "Content-Type": "application/json" } }
// //     );
// //   }
// // }

// // // POST - Guardar tipo de sangre en la inscripción
// // export async function POST(request) {
// //   try {
// //     const body = await request.json();

// //     if (!body.aluctr || !body.bloodType || !body.bloodTypeFile) {
// //       return new Response(
// //         JSON.stringify({ error: "Faltan datos requeridos" }),
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     // ✅ CORRECCIÓN: Verificar si ya tiene solicitud pendiente usando estudianteId
// //     const inscripcionPendiente = await prisma.inscripact.findFirst({
// //       where: {
// //         estudianteId: body.aluctr, // ✅ Usar estudianteId
// //         tipoSangreSolicitado: { not: null },
// //         sangreValidada: false,
// //       }
// //     });

// //     if (inscripcionPendiente) {
// //       return new Response(
// //         JSON.stringify({
// //           error: "Ya tienes una solicitud pendiente de validación"
// //         }),
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     // ✅ CORRECCIÓN: Buscar la inscripción más reciente usando estudianteId
// //     const inscripcion = await prisma.inscripact.findFirst({
// //       where: { estudianteId: body.aluctr }, // ✅ Usar estudianteId
// //       orderBy: { fechaInscripcion: 'desc' },
// //     });

// //     if (!inscripcion) {
// //       return new Response(
// //         JSON.stringify({ error: "No tienes inscripciones activas" }),
// //         { status: 404, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     // Actualizar la inscripción con los datos de sangre
// //     await prisma.inscripact.update({
// //       where: { id: inscripcion.id },
// //       data: {
// //         tipoSangreSolicitado: body.bloodType,
// //         comprobanteSangrePDF: body.bloodTypeFile,
// //         nombreArchivoSangre: body.bloodTypeFileName || 'comprobante.pdf',
// //         sangreValidada: false,
// //       }
// //     });

// //     console.log("✅ Solicitud de tipo de sangre guardada en inscripción:", inscripcion.id);

// //     return new Response(JSON.stringify({
// //       success: true,
// //       mensaje: "Solicitud enviada. Espera la validación del administrador.",
// //     }), {
// //       status: 200,
// //       headers: { "Content-Type": "application/json" },
// //     });
// //   } catch (error) {
// //     console.error("❌ Error en POST /api/sangre:", error);
// //     return new Response(
// //       JSON.stringify({ error: "Error interno", message: error.message }),
// //       { status: 500, headers: { "Content-Type": "application/json" } }
// //     );
// //   }
// // }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. OBTENER ESTADO (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get("aluctr");

    if (!aluctr)
      return NextResponse.json({ error: "Falta aluctr" }, { status: 400 });

    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr },
      select: { aluctr: true, alutsa: true },
    });

    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({
      estudiante,
      solicitudPendiente:
        inscripcion?.comprobanteSangrePDF && !inscripcion?.sangreValidada
          ? inscripcion
          : null,
      inscripcion: inscripcion || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. SUBIR DOCUMENTO (POST)
export async function POST(request) {
  try {
    // Al usar request.formData() en App Router, Next.js maneja el streaming automáticamente
    const formData = await request.formData();
    const aluctr = formData.get("aluctr");
    const bloodType = formData.get("bloodType");
    const file = formData.get("file");

    if (!aluctr || !file) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Convertir archivo a Buffer binario
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: "No hay inscripción activa" },
        { status: 404 },
      );
    }

    const actualizado = await prisma.inscripact.update({
      where: { id: inscripcion.id },
      data: {
        tipoSangreSolicitado: bloodType,
        comprobanteSangrePDF: buffer,
        nombreArchivoSangre: file.name,
        sangreValidada: false,
        mensajeAdmin: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en POST:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// 3. ACCIÓN ADMIN (PATCH)
export async function PATCH(request) {
  try {
    const { aluctr, accion, tipoSangre, mensaje } = await request.json();

    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    if (!inscripcion)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    if (accion === "aprobar") {
      await prisma.$transaction([
        prisma.estudiantes.update({
          where: { aluctr },
          data: { alutsa: tipoSangre },
        }),
        prisma.inscripact.update({
          where: { id: inscripcion.id },
          data: {
            sangreValidada: true,
            mensajeAdmin: null,
            comprobanteSangrePDF: null,
          },
        }),
      ]);
    } else if (accion === "rechazar") {
      await prisma.inscripact.update({
        where: { id: inscripcion.id },
        data: {
          comprobanteSangrePDF: null,
          sangreValidada: false,
          mensajeAdmin:
            mensaje || "Rechazado: El documento no es legible o es incorrecto.",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en PATCH:", error);
    return NextResponse.json(
      { error: "Error en la operación" },
      { status: 500 },
    );
  }
}

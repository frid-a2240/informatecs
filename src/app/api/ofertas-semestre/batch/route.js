import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
export async function POST(request) { try { const { ofertas } = await request.json(); 
if (!ofertas || !Array.isArray(ofertas)) { return Response.json({ error: 'Datos inválidos' }, 
  { status: 400 }); } const resultado = await prisma.ofertaSemestre.createMany({ data: ofertas, skipDuplicates: true }); 
  return Response.json({ message: 'Actividades publicadas exitosamente', count: resultado.count }); 
} 
  catch (error) { console.error('Error:', error); return Response.json({ error: 'Error interno' }, { status: 500 }); } }
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const actividades = await prisma.actividades.findMany({
      orderBy: { aconco: 'asc' }
    })
    return Response.json(actividades)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Error al obtener actividades' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const actividad = await prisma.actividades.create({
      data: {
        acocve: data.acocve,
        aticve: data.aticve,
        aconco: data.aconco,
        acodes: data.acodes,
        acocre: data.acocre,
        acohrs: data.acohrs,
        depcve: data.depcve,
        puecve: data.puecve
      }
    })
    return Response.json(actividad)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Error al crear actividad' }, { status: 500 })
  }
}
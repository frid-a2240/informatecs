import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ofertas = await prisma.ofertaSemestre.findMany({
        where: { activa: true },
        include: { actividad: true }
      });
      res.status(200).json(ofertas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener ofertas' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

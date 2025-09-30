import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function borrar() {
  try {
    const res = await prisma.ofertaSemestre.deleteMany({});
    console.log("Se borraron:", res.count);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

borrar();

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { matricula, code } = await req.json();

  const student = await prisma.authStudents.findUnique({
    where: { matricula },
  });

  if (!student || student.emailCode !== code) {
    return NextResponse.json({ message: 'Código inválido' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Código válido. Puedes cambiar tu contraseña.' });
}

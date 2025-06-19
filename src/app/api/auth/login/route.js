
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { matricula, password } = await req.json();

  const estudiante = await prisma.estudiantes.findUnique({
    where: { aluctr: matricula }
  });

  if (!estudiante) {
    return NextResponse.json({ message: 'Matrícula no encontrada' }, { status: 404 });
  }

  let student = await prisma.authStudents.findUnique({
    where: { matricula },
  });

  if (!student) {
    const nombreCompleto = `${estudiante.alunom ?? ''} ${estudiante.aluapp ?? ''} ${estudiante.aluapm ?? ''}`.trim();
    const genericPassword = '123456';
    const hashedPassword = await bcrypt.hash(genericPassword, 10);

    student = await prisma.authStudents.create({
      data: {
        matricula,
        password: hashedPassword,
        nombreCompleto,
        correo: '',
        isVerified: false,
      },
    });
  }

  const passwordMatch = await bcrypt.compare(password, student.password);

  if (!passwordMatch) {
    return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
  }

  if (student.isVerified) {
    return NextResponse.json({
      message: `Bienvenido, ${student.nombreCompleto}`,
      nombre: student.nombreCompleto,
    });
  }

  return NextResponse.json({
    message: 'Verificación requerida. Escribe tu correo electrónico.',
    requiresVerification: true,
    correo: student.correo || '',
  });
}

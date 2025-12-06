import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { signToken } from '@/lib/jwt';

/** 
 * POST /api/auth/login 
 * Autentica un usuario y retorna un JWT    
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = loginSchema.parse(body);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar JWT
    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    // Retornar token y datos del usuario
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

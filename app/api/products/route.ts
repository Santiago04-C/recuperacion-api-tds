import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProductSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/jwt';

/**
 * GET /api/products
 * Obtiene todos los productos (público)
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Crea un nuevo producto (requiere autenticación)
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado - Token faltante' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const body = await request.json();

    // Validar datos con Zod
    const validatedData = createProductSchema.parse(body);

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock || 0,
        userId: payload.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Producto creado exitosamente',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Error de validación de Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Log from '@/models/Log';
import { createLogSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/jwt';

/**
 * POST /api/logs
 * Crea un nuevo log de acción (requiere autenticación)
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
    const validatedData = createLogSchema.parse(body);

    // Conectar a MongoDB
    await connectMongoDB();

    // Crear log
    const log = await Log.create({
      userId: payload.userId,
      action: validatedData.action,
      metadata: validatedData.metadata || {},
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Log creado exitosamente',
        log: {
          id: log._id,
          userId: log.userId,
          action: log.action,
          metadata: log.metadata,
          timestamp: log.timestamp,
        },
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

    console.error('Error al crear log:', error);
    return NextResponse.json(
      { error: 'Error al crear log' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/logs
 * Obtiene todos los logs del usuario autenticado
 */
export async function GET(request: NextRequest) {
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

    // Conectar a MongoDB
    await connectMongoDB();

    // Obtener logs del usuario (o todos si es admin)
    const query = payload.role === 'admin' ? {} : { userId: payload.userId };
    
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    return NextResponse.json(
      {
        logs: logs.map(log => ({
          id: log._id,
          userId: log.userId,
          action: log.action,
          metadata: log.metadata,
          timestamp: log.timestamp,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener logs:', error);
    return NextResponse.json(
      { error: 'Error al obtener logs' },
      { status: 500 }
    );
  }
}

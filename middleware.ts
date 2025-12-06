import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/products', // GET público
];

// Rutas que requieren rol admin
const ADMIN_ROUTES = [
  '/api/products/delete',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo procesar rutas de API
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // Excepto DELETE en /api/products que requiere admin
    if (request.method === 'DELETE' && pathname.startsWith('/api/products/')) {
      // Continuar con verificación de admin
    } else if (request.method === 'GET' && pathname.startsWith('/api/products')) {
      // GET de productos es público
      return NextResponse.next();
    } else if (pathname === '/api/auth/login' || pathname === '/api/auth/register') {
      return NextResponse.next();
    }
  }

  // Verificar token JWT
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'No autorizado - Token faltante' },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    // Verificar si la ruta requiere admin
    if (request.method === 'DELETE' && pathname.startsWith('/api/products/')) {
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Acceso denegado - Se requiere rol de administrador' },
          { status: 403 }
        );
      }
    }

    // Token válido, continuar
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};

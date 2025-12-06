import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

/**
 * Extrae y verifica el token JWT del header Authorization
 * Retorna el payload del usuario o null si no es válido
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Verifica que el usuario esté autenticado
 * Lanza error si no lo está
 */
export function requireAuth(request: NextRequest): JWTPayload {
  const user = getUserFromRequest(request);
  
  if (!user) {
    throw new Error('No autorizado - Token inválido o faltante');
  }
  
  return user;
}

/**
 * Verifica que el usuario sea admin
 * Lanza error si no lo es
 */
export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Acceso denegado - Se requiere rol de administrador');
  }
  
  return user;
}

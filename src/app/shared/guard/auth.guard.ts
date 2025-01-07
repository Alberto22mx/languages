import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificar si existe el token
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  // Si no hay token, redirigir al login
  router.navigate(['/login']);
  return false;
};

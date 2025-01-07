import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return true;
  }
  
  // Si ya está autenticado, redirigir al dashboard
  router.navigate(['/dashboard']);
  return false;
};

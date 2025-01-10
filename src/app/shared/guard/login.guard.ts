import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return true;
  }

  const userType = authService.getUserType()?.toLowerCase();
  
  // Si ya está autenticado, redirigir al dashboard
  if (userType == 'user') {
    router.navigate(['/modulos/i/dashboard']);
  } else if(userType == 'teacher') {
    router.navigate(['/modulos/ii/dashboard']);
  } else if(userType == 'admin') {
    router.navigate(['/modulos/iii/dashboard']);
  }
  return false;
};

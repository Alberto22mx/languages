import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

export const loginGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (!authService.isAuthenticated()) {
    return true;
  }

  const userType = authService.getUserType()?.toLowerCase();
  
  // Si ya está autenticado, redirigir al dashboard
  if (userType == 'student') {
    router.navigate(['/modulos/i/dashboard']);
  } else if(userType == 'teacher') {
    router.navigate(['/modulos/ii/dashboard']);
  } else if(userType == 'admin') {
    router.navigate(['/modulos/iii/dashboard']);
  }
  return false;
};

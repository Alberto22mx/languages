import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { inject } from '@angular/core';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (_route, _state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userType = authService.getUserType()?.toLowerCase();

    if (!authService.isAuthenticated()) {
      if (userType == 'student') {
        router.navigate(['/modulos/i/dashboard']);
      } else if(userType == 'teacher') {
        router.navigate(['/modulos/ii/dashboard']);
      } else if(userType == 'admin') {
        router.navigate(['/modulos/iii/dashboard']);
      }
      return false;
    }

    if (userType && allowedRoles.map(role => role.toLowerCase()).includes(userType)) {
      return true;
    }

    if (userType == 'student') {
      router.navigate(['/modulos/i/dashboard']);
    } else if(userType == 'teacher') {
      router.navigate(['/modulos/ii/dashboard']);
    } else if(userType == 'admin') {
      router.navigate(['/modulos/iii/dashboard']);
    }
    return false;
  };
};

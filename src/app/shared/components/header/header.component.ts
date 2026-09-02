import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserType } from '../../../core/interfaces/user.interface';
import { GroupsService } from '../../../core/services/groups/groups.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username: string | null;
  matricula: string | null;
  userType: string;
  
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService, private groupsService: GroupsService) {
    this.username = authService.getUserName();
    this.matricula = authService.getRegistrationNumber();
    this.userType = authService.getUserType() || '';
  }

  logout() {
    this.authService.logout();
  }

  getProfileRoute(): string {
    const userType = this.authService.getUserType();
    if (userType == 'student') {
      return '/modulos/i/profil';
    } else if(userType == 'teacher') {
      return '/modulos/ii/profil';
    } else {
      return '/modulos/iii/profil';
    }
  }

  getUserTypeLabel(type: string): string {
    switch (type) {
      case UserType.ADMIN:
        return 'Administrador';
      case UserType.STUDENT:
        return 'Alumno';
      case UserType.TEACHER:
        return 'Maestro';
      default:
        return 'Desconocido';
    }
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  username = 'John Doe'; // Ejemplo
  
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService){ }

  logout() {
    // Implementar lógica de logout
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getProfileRoute(): string {
    const userType = this.authService.getUserType();
    if (userType == 'user') {
      return '/modulos/i/profil';
    } else if(userType == 'teacher') {
      return '/modulos/ii/profil';
    } else {
      return '/modulos/iii/profil';
    }
  }
}

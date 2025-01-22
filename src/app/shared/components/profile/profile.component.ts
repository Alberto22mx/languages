import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { User } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EditComponent } from './modals/edit/edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isEditing: boolean = false;
  user: User= {};

  constructor(
      private usersService: UsersService,
      private authService: AuthService,
      private alertsService: AlertsService
    ) {}
  
  ngOnInit(): void {
    this.getPerfil();
  }

  getPerfil() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.usersService.getUserById(userId).subscribe(res => {
        this.user = res;
      });
    }
  }

  openEditModal(data: any): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '600px',
      data, // Pasamos los datos del juego a editar
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPerfil();
    });
  }
}

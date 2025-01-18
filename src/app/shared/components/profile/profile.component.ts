import { Component } from '@angular/core';
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
export class ProfileComponent {
  isEditing: boolean = false;

  user: User = {
    firstName: 'Juan',
    lastNameFather: 'Pérez',
    lastNameMother: 'Gómez',
    password: '********',
    phone: '1234567890',
    email: 'juan.perez@example.com',
    birthDate: new Date(1990, 1, 15),
    image: '', // Placeholder image
  };

  tempUser: User = { ...this.user };

  toggleEditMode() {
    if (this.isEditing) {
      // Guardar cambios
      this.user = { ...this.tempUser };
    } else {
      // Cancelar cambios (restaurar tempUser)
      this.tempUser = { ...this.user };
    }
    this.isEditing = !this.isEditing;
  }
}

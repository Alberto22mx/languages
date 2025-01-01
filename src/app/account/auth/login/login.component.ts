import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Aquí irá la lógica de autenticación
      console.log('Form submitted:', this.loginForm.value);
      this.snackBar.open('Iniciando sesión...', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/home']);
    }
  }

  getErrorMessage(field: string): string {
    if (this.loginForm.get(field)?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field === 'email' && this.loginForm.get('email')?.hasError('email')) {
      return 'Email no válido';
    }
    if (field === 'password' && this.loginForm.get('password')?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}

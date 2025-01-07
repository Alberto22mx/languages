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
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      matricula: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const emailValue = this.loginForm.get('matricula')?.value;
      const passwordValue = this.loginForm.get('password')?.value;
      if (emailValue && passwordValue) {
        // Aquí irá la lógica de autenticación
        this.authService.login(emailValue, passwordValue).subscribe({
          next: (res) => {
            this.snackBar.open('Iniciando sesión...', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/modulos/dashboard']);
                localStorage.setItem('token', res.accessToken);
            },
          error: (err) => {
            this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          },
        });
      }
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

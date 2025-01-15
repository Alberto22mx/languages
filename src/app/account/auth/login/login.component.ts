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
import { LoginCredentials } from '../../../core/interfaces/login.interface';

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
      const matriculalValue = this.loginForm.get('matricula')?.value;
      const passwordValue = this.loginForm.get('password')?.value;
      if (matriculalValue && passwordValue) {
        const credentials: LoginCredentials = {
          registrationNumber: matriculalValue,
          password: passwordValue,
        }
        this.authService.login(credentials).subscribe({
          next: (res) => {
            this.authService.setAuthData(res);
            this.snackBar.open('Iniciando sesión...', 'Cerrar', {
              duration: 3000
            });
            if (res.userType == 'user') {
              this.router.navigate(['/modulos/i/dashboard']);
            } else if(res.userType == 'teacher') {
              this.router.navigate(['/modulos/ii/dashboard']);
            } else if(res.userType == 'admin') {
              this.router.navigate(['/modulos/iii/dashboard']);
            }
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
